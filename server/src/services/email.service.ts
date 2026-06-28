import axios from "axios";
import config from "../config/config.js";

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html: string
): Promise<void> => {
  const credentials = Buffer.from(
    `${config.MAILJET_API_KEY}:${config.MAILJET_SECRET_KEY}`
  ).toString("base64");

  try {
    await axios.post(
      "https://api.mailjet.com/v3.1/send",
      {
        Messages: [
          {
            From: {
              Email: config.MAILJET_SENDER_EMAIL,
              Name: "FinTrack",
            },
            To: [{ Email: to }],
            Subject: subject,
            TextPart: text,
            HTMLPart: html,
          },
        ],
      },
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`[Mailjet] Email sent to: ${to}`);
  } catch (error: any) {
    const detail =
      error.response?.data?.ErrorMessage ||
      error.response?.data?.Messages?.[0]?.Errors?.[0]?.ErrorMessage ||
      error.message;
    console.error(`[Mailjet] Failed to send email to ${to}:`, detail);
    throw new Error(`Email delivery failed: ${detail}`);
  }
};

export default sendEmail;