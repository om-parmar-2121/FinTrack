import axios from "axios";
import config from "../config/config.js";

/**
 * Gmail REST API email sender.
 *
 * Uses HTTPS (port 443) — NOT blocked by Render's free tier.
 * Can send OTPs to ANY email address worldwide.
 *
 * How it works:
 *  1. Exchange the OAuth2 refresh token for a short-lived access token.
 *  2. Build a raw RFC 2822 email message (base64url encoded).
 *  3. POST the raw message to https://gmail.googleapis.com/gmail/v1/users/me/messages/send
 */

/** Step 1: Get a fresh access token from Google using the stored refresh token */
const getGmailAccessToken = async (): Promise<string> => {
  const response = await axios.post(
    "https://oauth2.googleapis.com/token",
    new URLSearchParams({
      client_id: config.GOOGLE_CLIENT_ID as string,
      client_secret: config.GOOGLE_CLIENT_SECRET as string,
      refresh_token: config.GOOGLE_REFRESH_TOKEN as string,
      grant_type: "refresh_token",
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  return response.data.access_token as string;
};

/** Step 2: Encode a raw RFC 2822 email as base64url (required by Gmail API) */
const buildRawEmail = (to: string, subject: string, html: string, text: string): string => {
  const from = `"FinTrack" <${config.GOOGLE_USER}>`;
  const boundary = "fintrack_boundary_" + Date.now();

  const rawEmail = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/plain; charset="UTF-8"`,
    ``,
    text,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset="UTF-8"`,
    ``,
    html,
    ``,
    `--${boundary}--`,
  ].join("\r\n");

  // base64url encode (Gmail API requirement: use - and _ instead of + and /)
  return Buffer.from(rawEmail)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

/** Send an email using Gmail REST API (HTTPS — works on Render) */
export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html: string
): Promise<void> => {
  try {
    // Get fresh OAuth2 access token
    const accessToken = await getGmailAccessToken();

    // Build base64url-encoded raw email
    const raw = buildRawEmail(to, subject, html, text);

    // Call Gmail REST API
    await axios.post(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
      { raw },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`[Gmail API] Email sent successfully to: ${to}`);
  } catch (error: any) {
    const detail =
      error.response?.data?.error_description ||
      error.response?.data?.error?.message ||
      error.message;
    console.error(`[Gmail API] Failed to send email to ${to}:`, detail);
    throw new Error(`Email delivery failed: ${detail}`);
  }
};

export default sendEmail;