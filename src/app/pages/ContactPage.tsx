import { FormEvent, useState } from "react";
import { PageIntro, PageShell } from "../components/PageShell";

type FormStatus = "idle" | "sending" | "sent" | "error";

export function ContactPage() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");

    const form = event.currentTarget;
    const values = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(values)),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "We couldn't send your message. Please try again.");
      }

      form.reset();
      setStatus("sent");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "We couldn't send your message. Please try again.");
      setStatus("error");
    }
  }

  const fieldClass =
    "mt-2 w-full rounded border border-line bg-ink-2 px-3 py-2.5 text-[15px] text-cream outline-none transition placeholder:text-muted/60 focus:border-gold focus:ring-1 focus:ring-gold";

  return (
    <PageShell>
      <PageIntro index="06 — Get in touch" title="Contact">
        <p>
          Have a question about inlet fogging, the simulator, or something you found on the site? Send a note and
          I’ll get back to you.
        </p>
      </PageIntro>

      <section className="mx-auto max-w-3xl px-5 pb-12">
        <form onSubmit={handleSubmit} className="rounded-lg border border-line bg-panel p-5 sm:p-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="font-sans text-sm text-cream">
              Name
              <input className={fieldClass} name="name" type="text" autoComplete="name" maxLength={100} required />
            </label>
            <label className="font-sans text-sm text-cream">
              Email
              <input className={fieldClass} name="email" type="email" autoComplete="email" maxLength={254} required />
            </label>
          </div>

          <label className="mt-5 block font-sans text-sm text-cream">
            Subject
            <input className={fieldClass} name="subject" type="text" maxLength={160} required />
          </label>

          <label className="mt-5 block font-sans text-sm text-cream">
            Message
            <textarea className={`${fieldClass} min-h-40 resize-y`} name="message" maxLength={5000} required />
          </label>

          <label className="absolute -left-[10000px]" aria-hidden="true">
            Company
            <input name="company" type="text" tabIndex={-1} autoComplete="off" />
          </label>

          <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded bg-gold px-5 py-2.5 font-sans text-sm font-semibold text-ink transition hover:bg-gold-2 disabled:cursor-wait disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Send message"}
            </button>
            <div aria-live="polite" className="text-sm">
              {status === "sent" && <p className="text-cyan">Thanks — your message has been sent.</p>}
              {status === "error" && <p className="text-heat">{error}</p>}
            </div>
          </div>
        </form>
      </section>
    </PageShell>
  );
}
