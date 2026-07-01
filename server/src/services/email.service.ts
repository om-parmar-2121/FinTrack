import axios from "axios";
import config from "../config/config.js";

interface TokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html: string
): Promise<void> => {
  try {
    const tokenResponse = await axios.post<TokenResponse>(
      "https://oauth2.googleapis.com/token",
      {
        client_id: config.GOOGLE_CLIENT_ID,
        client_secret: config.GOOGLE_CLIENT_SECRET,
        refresh_token: config.GOOGLE_REFRESH_TOKEN,
        grant_type: "refresh_token",
      }
    );

    const accessToken = tokenResponse.data.access_token;

    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
    const messageParts = [
      `From: FinTrack <${config.GOOGLE_USER}>`,
      `To: ${to}`,
      `Content-Type: text/html; charset=utf-8`,
      `MIME-Version: 1.0`,
      `Subject: ${utf8Subject}`,
      ``,
      html
    ];
    const message = messageParts.join("\r\n");

    const raw = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

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

    console.log(`[Gmail API] Email sent to: ${to}`);
  } catch (error: any) {
    const detail = error.response?.data?.error?.message || error.message;
    console.error(`[Gmail API] Failed to send email to ${to}:`, detail);
    throw new Error(`Email delivery failed: ${detail}`);
  }
};

export default sendEmail;