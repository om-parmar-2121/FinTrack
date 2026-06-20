import crypto from 'crypto';

export function generateOTP() {
    const otp = crypto.randomInt(100000, 1000000);
    return otp.toString();
}

export function getOtpHtml(otp: String) {
    const code = String(otp);
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify your email - FinTrack</title>
    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
    <!--<![endif]-->
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
        
        body {
            color: #e4e4e7;
            font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
            width: 100% !important;
            height: 100% !important;
        }
        .wrapper {
            width: 100%;
            table-layout: fixed;
            padding: 40px 0;
        }
        .container {
            max-width: 440px;
            margin: 0 auto;
            background-color: #0f0f0f;
            color: #e4e4e7;
            border: 1px solid #262626;
            border-radius: 16px;
            padding: 42px 32px;
            text-align: center;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
        }
        .header {
            margin-bottom: 28px;
        }
        .logo-title {
            font-size: 22px;
            font-weight: 700;
            color: #ffffff;
            margin: 0;
            letter-spacing: -0.025em;
            font-family: 'JetBrains Mono', 'Courier New', Courier, monospace;
        }
        .logo-subtitle {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.3em;
            color: #3b82f6;
            margin-top: 4px;
            margin-bottom: 0;
            font-weight: 600;
        }
        .title {
            font-size: 20px;
            font-weight: 700;
            color: #ffffff;
            margin-top: 0;
            margin-bottom: 10px;
            letter-spacing: -0.01em;
        }
        .description {
            font-size: 14px;
            line-height: 22px;
            color: #a1a1aa;
            margin-top: 0;
            margin-bottom: 28px;
        }
        .otp-table {
            margin: 0 auto 28px auto;
            border-collapse: separate;
        }
        .otp-cell {
            width: 42px;
            height: 48px;
            background-color: #181818;
            border: 1px solid #2a2a2a;
            border-radius: 6px;
            text-align: center;
            font-family: 'JetBrains Mono', 'Courier New', Courier, monospace;
            font-size: 22px;
            font-weight: 700;
            color: #3b82f6;
            line-height: 48px;
        }
        .otp-space {
            width: 6px;
        }
        .warning-box {
            display: inline-block;
            background-color: rgba(251, 191, 36, 0.05);
            border: 1px solid rgba(251, 191, 36, 0.15);
            border-radius: 8px;
            padding: 8px 16px;
            margin-bottom: 28px;
        }
        .warning-text {
            font-size: 12px;
            color: #fbbf24;
            font-weight: 500;
            margin: 0;
        }
        .footer {
            border-top: 1px solid #262626;
            padding-top: 24px;
            margin-top: 8px;
        }
        .footer-text {
            font-size: 12px;
            color: #71717a;
            line-height: 18px;
            margin: 0;
        }
    </style>
</head>
<body>
    <!-- Hidden preheader text for mobile email client notification previews -->
    <div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px; line-height: 1px; color: #0f0f0f; opacity: 0;">
        Your verification code is: ${code}. This code is valid for 5 minutes.
    </div>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <h1 class="logo-title">FinTrack</h1>
                <p class="logo-subtitle">Money OS</p>
            </div>
            
            <h2 class="title">Verify your email</h2>
            <p class="description">
                Please enter the following 6-digit verification code to complete your security check.
            </p>
            
            <table cellpadding="0" cellspacing="0" border="0" class="otp-table">
                <tr>
                    <td class="otp-cell" style="border-radius: 6px;">${code[0]}</td>
                    <td class="otp-space"></td>
                    <td class="otp-cell" style="border-radius: 6px;">${code[1]}</td>
                    <td class="otp-space"></td>
                    <td class="otp-cell" style="border-radius: 6px;">${code[2]}</td>
                    <td class="otp-space"></td>
                    <td class="otp-cell" style="border-radius: 6px;">${code[3]}</td>
                    <td class="otp-space"></td>
                    <td class="otp-cell" style="border-radius: 6px;">${code[4]}</td>
                    <td class="otp-space"></td>
                    <td class="otp-cell" style="border-radius: 6px;">${code[5]}</td>
                </tr>
            </table>
            
            <div class="warning-box">
                <p class="warning-text">⚠️ This code is valid for 5 minutes only.</p>
            </div>
            
            <div class="footer">
                <p class="footer-text">
                    If you did not request this verification, you can safely ignore this email.
                </p>
                <p class="footer-text" style="margin-top: 12px;">
                    &copy; 2026 FinTrack. All rights reserved.
                </p>
            </div>
        </div>
    </div>
</body>
</html>`
}