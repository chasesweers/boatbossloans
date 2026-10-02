"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsletterSchema, type NewsletterInput, type NewsletterSignup } from "@/lib/newsletter/schema";
import { track } from "@/lib/analytics";

type Status = { kind: "idle" } | { kind: "done" } | { kind: "error"; message: string };

export function NewsletterForm({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const pathname = usePathname() ?? "/";
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterInput, unknown, NewsletterSignup>({ resolver: zodResolver(newsletterSchema) });

  const onSubmit = async (values: NewsletterSignup) => {
    setStatus({ kind: "idle" });
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, sourcePage: pathname }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }
      track("newsletter_signup", { source_page: pathname });
      setStatus({ kind: "done" });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong. Please try again." });
    }
  };

  const muted = tone === "dark" ? "text-smoke" : "text-grey";
  const errorText = tone === "dark" ? "text-red-light" : "text-red";
  const field =
    tone === "dark"
      ? "border-hairline bg-panel text-white placeholder:text-smoke/70"
      : "border-grey/40 bg-white text-ink placeholder:text-grey";

  if (status.kind === "done") {
    return (
      <p role="status" className="font-display text-2xl uppercase">
        Check your inbox to confirm your subscription.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="nl-email" className="mb-1 block text-sm font-semibold">
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            id="nl-email"
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "nl-email-error" : undefined}
            className={`h-12 w-full border px-3 ${field}`}
            {...register("email")}
          />
        </div>
        <div className="sm:w-48">
          <label htmlFor="nl-first" className="mb-1 block text-sm font-semibold">
            First name <span className={`font-normal ${muted}`}>(optional)</span>
          </label>
          <input id="nl-first" type="text" autoComplete="given-name" className={`h-12 w-full border px-3 ${field}`} {...register("firstName")} />
        </div>
        {/* Honeypot: visually hidden and skipped by keyboard and screen readers. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="nl-company">Company</label>
          <input id="nl-company" type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
        </div>
        <div className="sm:self-end">
          <button type="submit" disabled={isSubmitting} className="btn btn-solid h-12 w-full sm:w-auto disabled:opacity-60">
            {isSubmitting ? "Sending…" : "Sign me up"}
          </button>
        </div>
      </div>
      {errors.email && (
        <p id="nl-email-error" className={`text-sm font-semibold ${errorText}`}>
          {errors.email.message}
        </p>
      )}
      {status.kind === "error" && (
        <p role="alert" className={`text-sm font-semibold ${errorText}`}>
          {status.message}
        </p>
      )}
      <p className={`text-sm ${muted}`}>
        Boat buying and financing tips from Kim, about twice a month. Unsubscribe anytime. See our{" "}
        <Link href="/privacy" className="underline underline-offset-2">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
