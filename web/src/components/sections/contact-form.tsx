"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/toast";

export function ContactForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const location = String(data.get("location") ?? "").trim();
    const type = String(data.get("type") ?? "").trim();

    if (!name || !email || !location || !type) {
      toast({
        title: "Missing fields",
        description: "Please complete the required fields marked with *.",
        tone: "error",
      });
      return;
    }

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      toast({
        title: "Inquiry sent",
        description: "Thank you — we will respond within two business days.",
        tone: "success",
      });
      form.reset();
    } finally {
      setLoading(false);
    }
  }

  const field =
    "w-full border-0 border-b border-border bg-transparent px-0 py-3 font-sans text-base text-charcoal placeholder:text-text-secondary transition-colors duration-300 focus:border-accent focus:outline-none focus:ring-0";

  return (
    <form onSubmit={onSubmit} className="space-y-8" noValidate>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <label className="sr-only" htmlFor="name">
            Full Name
          </label>
          <input
            className={field}
            id="name"
            name="name"
            placeholder="Full Name *"
            required
            type="text"
            autoComplete="name"
          />
        </div>
        <div>
          <label className="sr-only" htmlFor="email">
            Email Address
          </label>
          <input
            className={field}
            id="email"
            name="email"
            placeholder="Email Address *"
            required
            type="email"
            autoComplete="email"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <label className="sr-only" htmlFor="phone">
            Phone Number
          </label>
          <input
            className={field}
            id="phone"
            name="phone"
            placeholder="Phone Number"
            type="tel"
            autoComplete="tel"
          />
        </div>
        <div>
          <label className="sr-only" htmlFor="location">
            Project Location
          </label>
          <input
            className={field}
            id="location"
            name="location"
            placeholder="Project Location *"
            required
            type="text"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <label className="sr-only" htmlFor="type">
            Project Type
          </label>
          <select
            className={`${field} bg-transparent text-text-secondary`}
            id="type"
            name="type"
            defaultValue=""
            required
          >
            <option disabled value="">
              Select Project Type *
            </option>
            <option value="residential">Residential Architecture</option>
            <option value="commercial">Commercial Development</option>
            <option value="interior">Interior Design</option>
            <option value="restoration">Heritage Restoration</option>
          </select>
        </div>
        <div>
          <label className="sr-only" htmlFor="budget">
            Estimated Budget
          </label>
          <select
            className={`${field} bg-transparent text-text-secondary`}
            id="budget"
            name="budget"
            defaultValue=""
          >
            <option disabled value="">
              Estimated Budget
            </option>
            <option value="t1">Under $1M</option>
            <option value="t2">$1M - $3M</option>
            <option value="t3">$3M - $5M</option>
            <option value="t4">$5M+</option>
          </select>
        </div>
      </div>
      <div>
        <label className="sr-only" htmlFor="message">
          Project Details
        </label>
        <textarea
          className={`${field} resize-none`}
          id="message"
          name="message"
          placeholder="Tell us about your vision..."
          rows={4}
        />
      </div>
      <div className="pt-4">
        <button
          className="group inline-flex items-center justify-center rounded bg-accent px-8 py-4 font-sans text-sm uppercase tracking-widest text-text-inverse transition-colors duration-300 hover:bg-accent-hover disabled:opacity-60"
          type="submit"
          disabled={loading}
        >
          <span>{loading ? "Sending…" : "Send Inquiry"}</span>
          <span
            className="ml-2 transition-transform group-hover:translate-x-1"
            aria-hidden
          >
            →
          </span>
        </button>
      </div>
    </form>
  );
}
