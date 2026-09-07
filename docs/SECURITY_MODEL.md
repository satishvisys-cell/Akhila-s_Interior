# Security Model — Akhila

Applies to public site, admin CMS, and live construction monitoring.

---

## 1. Threat priorities

| Threat | Severity | Mitigation |
|---|---|---|
| CCTV credential / RTSP leakage to browser | Critical | Server-only secrets; proxy; signed TTL playback |
| Unauthorized private camera access | Critical | AuthN + AuthZ on session mint |
| Admin takeover | Critical | Strong auth, RBAC, session hardening |
| XSS via CMS HTML/blocks | High | Sanitize; CSP |
| Path traversal / IDOR on media | High | Signed URLs; authz checks |
| Abuse of stream endpoints | Medium | Rate limits; per-user/camera quotas |

---

## 2. Secrets — never in client

Do **not** put in frontend bundles, public env, or CMS JSON sent to browsers:

- Database credentials
- Object storage secret keys
- Admin API tokens
- CCTV / RTSP usernames & passwords
- Private camera origin URLs
- Service account keys

Public env only: site URL, anonymous analytics key (if any), public CDN base.

---

## 3. CCTV architecture

```text
Camera (private network)
  → Ingest (MediaMTX / NVR) [credentials here]
  → Stream Proxy API (authn/authz, rate limit)
  → Signed short-lived playback URL (HLS/WebRTC)
  → CameraViewer (browser)
```

### Rules
1. `Camera.sourceConfig` encrypted at rest; decrypt only in stream service.
2. `POST /api/streams/sessions` requires session cookie + permission `camera:view` for that project/site.
3. Public cameras: still no raw origin — still proxied; may allow anonymous mint with stricter rate limits.
4. Private cameras: authenticated users only (client or staff roles).
5. Admin UI shows **“Source configured securely”** — never password/RTSP fields in responses after save.
6. Audit every session mint, config change, snapshot.

### Camera statuses (UX + security)
| Status | Client behavior |
|---|---|
| LIVE | Show playback |
| OFFLINE | Fallback UI; no retry storm |
| MAINTENANCE | Explicit message |
| Unauthorized | 401/403 → Restricted state |
| Timeout | Retry with backoff; then error |

---

## 4. RBAC

| Role | Capabilities (summary) |
|---|---|
| Super Admin | All + roles/users |
| Admin | CMS + CCTV config + publish |
| Editor | Content draft/edit; limited publish |
| Project Manager | Assigned projects, progress, live view |
| Viewer | Read-only assigned projects / public |

Permissions examples: `project:read|write|publish`, `media:write`, `camera:view|manage`, `user:manage`, `settings:write`

Enforce **server-side** on every mutation and stream mint. Never trust client role claims alone.

---

## 5. Auth sessions (admin)

- HTTP-only, Secure, SameSite=Lax/Strict cookies
- CSRF protection on cookie-based mutations
- Password hashing (Argon2id/bcrypt)
- Lockout / rate limit on `/admin/login`
- Optional MFA later (OPEN_QUESTION)

---

## 6. Media security

- Private originals in non-public bucket
- Public site uses CDN derivatives via signed or tightly scoped public paths
- Admin preview uses short-lived signed URLs
- Validate content-type/size on upload; virus scan if available

---

## 7. Application security baseline

- Input validation (zod) on all APIs
- Output encoding; sanitize rich text / custom HTML blocks
- CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- Dependency scanning in CI
- Least-privilege DB and storage IAM

---

## 8. Logging & privacy

- Audit: login, permission denials, CCTV config, stream mint, publish
- Do not log raw credentials or full signed URLs in client analytics
- Privacy copy on Live Sites: authenticated/proxied streams

---

## 9. Frontend checklist (CameraViewer)

- [ ] Props include only `session.playbackUrl`, status, labels — no sourceConfig
- [ ] Do not persist playback URLs in localStorage
- [ ] Tear down media element on unmount
- [ ] Load **one** primary stream; thumbs are images not live streams
- [ ] Handle 401/403/timeout with Stitch fallback UI
