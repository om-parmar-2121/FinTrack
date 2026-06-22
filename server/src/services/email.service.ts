import nodemailer from "nodemailer";
import axios from "axios";
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  family: 4,
  auth: {
    type: "OAuth2",
    user: config.GOOGLE_USER,
    clientId: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    refreshToken: config.GOOGLE_REFRESH_TOKEN,
  },
} as any);

if (!process.env.RESEND_API_KEY) {
  transporter.verify((error: any, success: any) => {
    if (error) {
      console.log("Local SMTP mail server verification failed:", error.message);
    } else {
      console.log("Local SMTP mail server is ready to send messages");
    }
  });
}

export const sendEmail = async (to: string, subject: string, text: string, html: string) => {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    try {
      const response = await axios.post(
        "https://api.resend.com/emails",
        {
          from: "FinTrack <onboarding@resend.dev>",
          to: [to.toLowerCase()],
          subject: subject,
          html: html,
          text: text,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data?.message || error.message;
      console.error("Resend API failed to send email:", apiError);
      throw new Error(`Resend email delivery failed: ${apiError}`);
    }
  } else {
    try {
      const info = await transporter.sendMail({
        from: `"FinTrack" <${config.GOOGLE_USER}>`,
        to,
        subject,
        text,
        html,
      });
      return info;
    } catch (error: any) {
      console.error("SMTP failed to send email:", error);
      throw new Error(`SMTP email delivery failed: ${error.message}`);
    }
  }
};

export default transporter;