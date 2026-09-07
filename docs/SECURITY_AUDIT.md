# Security Audit — Akhila Architecture Platform

**Date:** 2026-09-06  
**Scope:** Frontend, Backend (Next.js App Router), Admin CMS, Media uploads, CCTV streaming, Auth/RBAC, Sessions, Storage  
**Status:** High/Critical findings remediated for current architecture; residual risks documented below  
**Build evidence:** `npm run build` passes (Next.js 16 / TypeScript)

---

## 1. Executive summary

The admin CMS and API layer implement a **defense-in-depth** model appropriate for a single-node CMS:

| Control | Status |
|---|---|
| No CCTV RTSP/credentials in frontend or API list responses | **PASS** |
| Server-side RBAC on protected mutations | **PASS** |
| HttpOnly session cookies + HMAC signing | **PASS** |
| Login rate limiting | **PASS** |
| Upload MIME + magic-byte validation + path sanitization | **PASS** |
| Audit logging for admin/CCTV/stream actions | **PASS** |
| Secrets via env (`SESSION_SECRET`) — not in source | **PASS** (prod requires ≥32 chars) |
| npm production dependency audit | **PASS** (`npm audit --omit=dev` → 0 vulnerabilities) |
| Real HLS/RTSP media proxy | **PARTIAL** (session minting + opaque playback token; ingest proxy still stub) |
| CSRF tokens | **PARTIAL** (SameSite=Lax cookies; no double-submit CSRF token) |
| Multi-instance rate limits / session store | **OPEN** (in-memory) |

**Verdict:** Safe to continue internal/staging use with the residual risks below. Not yet `VERIFIED_PRODUCTION` until a real stream proxy, durable secrets store, and CSRF/CSP hardening are completed.

---

## 2. Architecture under review

```text
Browser (public + admin)
  → Next.js middleware (cookie presence for /admin/*)
  → requireAdmin / requireApiSession (HMAC session + RBAC)
  → CMS JSON store (data/cms/*)
  → camera-secrets.json (server-only; never returned to clients)
  → Stream sessions (opaque short-lived playback tokens)
```

---

## 3. Findings by area

### 3.1 Authentication & sessions — PASS (with notes)

**Implemented**
- PBKDF2 password hashing (`lib/auth/password.ts`)
- Signed session payload (HMAC-SHA256) in HttpOnly cookie
- `secure` flag in production; `sameSite: "lax"`
- Middleware redirects unauthenticated `/admin/*` (except login) based on cookie presence
- Full verification + permission checks in `requireAdmin` / `requireApiSession`
- Login rate limit: 10 attempts / 15 min per IP

**Remediated / enforced**
- Production refuses weak/missing `SESSION_SECRET` (<32 chars)

**Residual**
- Middleware only checks cookie *presence* (not signature). Mitigated because all data APIs and dashboard layouts call full session verify.
- Seed admin password must be rotated: `admin@akhila.com` / `Admin!ChangeMe1` (see `.env.example`)

### 3.2 Authorization (RBAC) — PASS

Permissions include `camera:view`, `camera:manage`, `media:write`, `project:write`, `page:write`, `user:manage`, etc.

- Camera create/update/delete/secret → `camera:manage`
- Camera list → `camera:view`
- Stream mint for private cameras → authenticated + `camera:view`
- Public cameras may mint sessions without admin auth (still no credentials returned)

**Residual:** Some collection list pages are thin wrappers; ensure every future mutation route calls `requireApiSession` with the correct permission (do not rely on UI hiding alone).

### 3.3 CCTV / streams — PASS (credential isolation); PARTIAL (proxy)

**Implemented**
- Camera records expose only `streamSourceId` (opaque)
- Secrets written via `POST /api/admin/cameras/[id]/secret` → `camera-secrets.json`
- Secret fields stripped from create/patch bodies
- API responses never echo RTSP URLs/usernames/passwords
- Playback via `/api/streams/sessions` → short-lived `/api/streams/playback/[token]`
- Audit events for secret changes and session minting
- Admin CCTV UI uses password field for source URI; value is not re-fetched

**Residual (High if ignored in production)**
- Playback route is a **stub proxy** — must not forward raw private URLs to browsers when a real MediaMTX/NVR is connected
- Secrets at rest are file JSON (not KMS/encrypted). Restrict filesystem permissions; plan encryption-at-rest before production CCTV
- No continuous heartbeat/monitoring worker yet (status is CMS-managed)

### 3.4 Media uploads — PASS (with derivative gap)

**Implemented**
- Allowed MIME allowlist (JPEG/PNG/WebP/AVIF/MP4/WebM)
- Size caps (images ~15MB, video ~250MB)
- Magic-byte / brand checks
- Filename + folder sanitization; path traversal blocked
- Authz: `media:write`
- Rate limit: 60 uploads / 15 min per user
- Audit log on upload

**Residual**
- Derivatives currently often point at the original URL (placeholder pipeline). Responsive helpers exist (`lib/media/variants.ts`) but **true** thumb/mobile/tablet/desktop generation (Sharp/ffmpeg) is not production-complete — do not serve 4K originals as default on public pages
- Uploaded files under `public/media` are world-readable if the Next static server exposes them — acceptable for public gallery assets; keep private/CCTV snapshots out of public folder or gate with auth

### 3.5 XSS / rich content — CONDITIONAL

**Implemented**
- HTML sanitizer (`lib/security/sanitize.ts`) with allowlisted tags
- Prefer structured blocks over free HTML in page builder

**Residual**
- Ensure every public render path for `html` / rich text blocks runs sanitizer
- Add Content-Security-Policy headers at the edge (not yet enforced app-wide)

### 3.6 CSRF — PARTIAL

SameSite=Lax cookies mitigate classic cross-site POST from other sites for most cases. Admin is cookie-authenticated.

**Recommendation:** Add Origin/Referer checks on state-changing admin APIs and/or CSRF tokens before production.

### 3.7 CORS — PASS for same-origin app

Admin and APIs are same-origin Next routes. Do not enable `Access-Control-Allow-Origin: *` for credentialed admin APIs.

### 3.8 SQL injection — N/A

File-backed JSON store (no SQL). Future DB migration must use parameterized queries / ORM.

### 3.9 SSRF — WATCH

When the stream proxy fetches RTSP/HLS origins from `camera-secrets.json`, enforce:
- Private-network allowlist / deny metadata IPs
- No user-controlled open proxy URLs without validation

### 3.10 Error handling — PASS (baseline)

API routes return generic `{ error }` messages. Avoid stack traces in production responses (Next default hides them in prod).

### 3.11 Logging / PII — CONDITIONAL

Audit log records actor, action, entity. Do not log passwords, RTSP URLs, or Authorization headers.

### 3.12 Dependencies — PASS (snapshot)

`npm audit --omit=dev` → **0 vulnerabilities** (as of audit date). Re-run on every release.

### 3.13 Environment / storage / DB permissions

| Item | Guidance |
|---|---|
| `SESSION_SECRET` | Required in production; rotate on compromise |
| `data/cms/camera-secrets.json` | Mode `600`; never commit; never sync to CDN |
| CMS JSON | Back up; restrict write access to app user |
| `.env.local` | Gitignored; use secret manager in prod |

---

## 4. Critical / High remediation log

| ID | Severity | Finding | Resolution |
|---|---|---|---|
| SEC-01 | Critical | CCTV credentials must not reach browser | Secrets isolated; stripped from APIs; opaque stream refs |
| SEC-02 | Critical | Unauthenticated admin APIs | `requireApiSession` + permissions on mutations |
| SEC-03 | High | Weak session secret in prod | Throw if `SESSION_SECRET` missing/short in production |
| SEC-04 | High | Unrestricted uploads | MIME allowlist, magic bytes, size limits, path sanitize |
| SEC-05 | High | Login brute force | IP rate limit on login |
| SEC-06 | High | Upload abuse | Per-user upload rate limit |
| SEC-07 | Medium | No audit trail | `audit.jsonl` for auth, CMS, cameras, streams |

---

## 5. Remaining risks & recommended mitigations

| Risk | Priority | Mitigation |
|---|---|---|
| Stub stream playback may accidentally leak origins when wired | P0 | Proxy only; return HLS/WebRTC playlists signed for CDN; never JSON-dump secret file |
| File-backed secrets unencrypted | P0 | Encrypt with KMS/envelope encryption; store outside web root |
| No CSRF token | P1 | Origin check + CSRF token on admin POST/PATCH/DELETE |
| No CSP / security headers suite | P1 | CSP, HSTS, X-Content-Type-Options, Referrer-Policy via middleware/host |
| In-memory rate limits / stream sessions | P1 | Redis (or equivalent) for multi-instance |
| Derivative generation incomplete | P1 | Sharp/ffmpeg pipeline; never default public src to original 4K |
| Seed admin credentials | P1 | Force password change on first login; disable seed in prod |
| Public `/media/*` for sensitive snapshots | P2 | Private bucket + signed URLs for non-public assets |
| HTML block XSS if sanitizer skipped | P2 | Lint/test that all HTML render paths sanitize |
| Dependency drift | P2 | CI `npm audit` + Dependabot |

---

## 6. Test evidence (security-relevant)

| Check | Result |
|---|---|
| Production build / TypeScript | Pass |
| Camera list API omits secrets | Pass (by design + strip filters) |
| Secret endpoint returns `{ secretConfigured: true }` only | Pass |
| Stream session returns `playbackUrl` + `expiresAt` only | Pass |
| Upload rejects disallowed MIME | Pass (validator unit logic) |
| Login rate limit returns 429 | Pass (code path) |
| Admin routes behind middleware + requireAdmin | Pass |
| `npm audit --omit=dev` | 0 vulns |

---

## 7. Sign-off

| Gate | Result |
|---|---|
| No secrets in frontend | **PASS** |
| No private CCTV URLs in client payloads | **PASS** |
| Server-side authz on protected ops | **PASS** |
| Upload validation | **PASS** |
| High/Critical code issues in current scope | **REMEDIATED** |
| Production CCTV readiness | **NOT YET** (proxy + secret encryption) |

**A55 Production readiness:** `SECURITY_REVIEW` conditional pass — proceed to staging; block public CCTV until P0 stream/secret items close.
