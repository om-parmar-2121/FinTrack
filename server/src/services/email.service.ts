import nodemailer from "nodemailer"
import config from "../config/config.js"

const transporter = nodemailer.createTransport({
    service: 'gmail',
    family: 4,
    auth: {
        type: 'OAuth2',
        user: config.GOOGLE_USER,
        clientId: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        refreshToken: config.GOOGLE_REFRESH_TOKEN
    }
} as any)

transporter.verify((error: any, success: any) => {
    if(error) {
        console.log('Error connecting to mail server:', error)
    } else {
        console.log('Email server is ready to send message')
    }
})

export const sendEmail = async (to: any, subject: any, text: any, html: any) => {
    try {
        const info = await transporter.sendMail({
            from: `"FinTrack" <${config.GOOGLE_USER}>`,
            to,
            subject,
            text,
            html
        })
    } catch (error: any) {
        console.error("Error in sending email", error)
        throw new Error(`Failed to send email: ${error.message}`)
    }
}

export default transporter