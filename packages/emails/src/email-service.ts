import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import type { ReactElement } from "react";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  ...(process.env.SMTP_USER
    ? {
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      }
    : {}),
});

/**
 * Sends an email using SMTP
 * @returns nodemailer send result
 */
export async function sendEmail({
  react,
  "o:tag": _tag,
  ...options
}: {
  to: string;
  subject: string;
  "o:tag"?: string;
} & (
  | { html: string; text: string; react?: never }
  | { react: ReactElement; html?: never; text?: never }
)) {
  const from = process.env.EMAIL_FROM || `Sill <noreply@${process.env.EMAIL_DOMAIN}>`;

  const email = {
    from,
    ...options,
    ...(react ? await renderReactEmail(react) : null),
  };

  if (!process.env.SMTP_HOST) {
    console.error("SMTP settings not configured.");
    console.error(
      "To send emails, set SMTP_HOST (and optionally SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE) environment variables."
    );
    console.error(
      "Would have sent the following email:",
      JSON.stringify(email)
    );
    return {
      status: "200",
      id: "mock",
      message: email,
    } as const;
  }

  const resp = await transporter.sendMail(email);
  return resp;
}

/**
 * Renders a React element into HTML and plain text email content
 * @param react React element to render
 * @returns HTML and plain text email content
 */
export async function renderReactEmail(react: ReactElement) {
  const [html, text] = await Promise.all([
    render(react),
    render(react, { plainText: true }),
  ]);
  return { html, text };
}
