import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) {
    redirect("/admin");
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — cinematic brand panel */}
      <aside className="relative hidden overflow-hidden bg-graphite lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(26,25,23,0.55), rgba(26,25,23,0.25)), url('/media/site/home-hero.jpg')",
          }}
          aria-hidden
        />
        <div className="relative flex h-full flex-col justify-end p-12 text-text-inverse">
          <p className="font-display text-4xl tracking-tight">Akhila</p>
          <p className="mt-3 max-w-sm text-small text-text-inverse/70">
            Interior architecture CMS — projects, media, and live construction
            monitoring in one secure workspace.
          </p>
        </div>
      </aside>

      {/* Right — form */}
      <main className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-12 flex items-baseline gap-3">
            <span className="font-display text-2xl text-text">Akhila</span>
            <span className="label-caps text-text-muted">Admin</span>
          </div>

          <h1 className="font-display text-h2 text-text">Welcome Back</h1>
          <p className="mt-3 text-small text-text-muted">
            Please enter your credentials to access the secure administrative
            dashboard.
          </p>

          <div className="mt-10">
            <Suspense fallback={<p className="text-small text-text-muted">Loading…</p>}>
              <LoginForm />
            </Suspense>
          </div>

          <p className="mt-16 flex items-start gap-2 text-caption text-text-muted">
            <span aria-hidden>🔒</span>
            <span>
              This is a secure system. Access is logged and restricted to
              authorized Akhila personnel only.
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}
