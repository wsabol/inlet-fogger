interface Env {
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
}

interface ContactSubmission {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  company?: unknown;
}

const FROM_EMAIL = "contact@willsabol.com";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(data: object, status = 200): Response {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname !== "/api/contact") {
      return new Response("Not found", { status: 404 });
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed." }, 405);
    }

    if (!request.headers.get("content-type")?.includes("application/json")) {
      return json({ error: "Please send a valid form submission." }, 415);
    }

    let submission: ContactSubmission;
    try {
      submission = await request.json<ContactSubmission>();
    } catch {
      return json({ error: "Please send a valid form submission." }, 400);
    }

    const name = clean(submission.name);
    const email = clean(submission.email).toLowerCase();
    const subject = clean(submission.subject);
    const message = clean(submission.message);

    // A hidden honeypot field lets bots appear successful without sending mail.
    if (clean(submission.company)) {
      return json({ ok: true });
    }

    if (!name || name.length > 100) {
      return json({ error: "Please enter your name." }, 400);
    }
    if (!EMAIL_PATTERN.test(email) || email.length > 254) {
      return json({ error: "Please enter a valid email address." }, 400);
    }
    if (!subject || subject.length > 160) {
      return json({ error: "Please enter a subject." }, 400);
    }
    if (!message || message.length > 5000) {
      return json({ error: "Please enter a message of 5,000 characters or fewer." }, 400);
    }
    if (!env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return json({ error: "Email is temporarily unavailable. Please try again later." }, 503);
    }
    if (!env.CONTACT_TO_EMAIL) {
      console.error("CONTACT_TO_EMAIL is not configured");
      return json({ error: "Email is temporarily unavailable. Please try again later." }, 503);
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replaceAll("\n", "<br>");
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Inlet Fogging Contact <${FROM_EMAIL}>`,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: email,
        subject: `[Inlet Fogging] ${subject}`,
        html: `<h2>New contact form message</h2><p><strong>From:</strong> ${safeName} &lt;${safeEmail}&gt;</p><p><strong>Subject:</strong> ${safeSubject}</p><hr><p>${safeMessage}</p>`,
        text: `New contact form message\n\nFrom: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
      }),
    });

    if (!resendResponse.ok) {
      console.error("Resend rejected contact email", resendResponse.status, await resendResponse.text());
      return json({ error: "We couldn't send your message. Please try again later." }, 502);
    }

    return json({ ok: true });
  },
};
