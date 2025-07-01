function ForgotTemplate({ firstname, email, resetLink }) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - Alantur</title>
    <style>
        /* Reset styles for email clients */
        body, table, td, p, a, li, blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }

        /* Main styles */
        body {
            margin: 0 !important;
            padding: 0 !important;
            background-color: #f4f4f4;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .header {
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
            padding: 30px 20px;
            text-align: center;
            color: white;
        }

        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }

        .header .emoji {
            font-size: 32px;
            margin-right: 10px;
        }

        .content {
            padding: 40px 30px;
            line-height: 1.6;
            color: #333333;
        }

        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #2c3e50;
        }

        .main-text {
            font-size: 16px;
            margin-bottom: 25px;
            color: #555555;
        }

        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
            color: white !important;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            transition: transform 0.2s ease;
        }

        .cta-button:hover {
            transform: translateY(-2px);
        }

        .security-notice {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 20px;
            border-radius: 6px;
            margin: 25px 0;
            font-size: 14px;
            color: #856404;
        }

        .security-notice .icon {
            font-size: 18px;
            margin-right: 8px;
        }

        .expiry-notice {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            padding: 20px;
            border-radius: 6px;
            margin: 25px 0;
            font-size: 15px;
            color: #721c24;
            font-weight: 500;
            text-align: center;
        }

        .expiry-notice .clock-icon {
            font-size: 20px;
            margin-right: 8px;
        }

        .warning-box {
            background-color: #fdf2e9;
            border-left: 4px solid #e67e22;
            padding: 20px;
            margin: 25px 0;
            border-radius: 0 6px 6px 0;
        }

        .warning-box h4 {
            color: #d35400;
            margin-top: 0;
            margin-bottom: 10px;
            font-size: 16px;
        }

        .warning-box p {
            margin: 0;
            color: #8e4b10;
            font-size: 14px;
        }

        .footer {
            background-color: #2c3e50;
            color: white;
            padding: 25px 30px;
            text-align: center;
        }

        .footer p {
            margin: 5px 0;
            font-size: 14px;
        }

        .company-name {
            font-weight: 600;
            color: #3498db;
        }

        .link-display {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            padding: 15px;
            border-radius: 6px;
            margin: 15px 0;
            font-family: monospace;
            font-size: 12px;
            color: #6c757d;
            word-break: break-all;
        }

        /* Responsive design */
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                margin: 0 !important;
                border-radius: 0 !important;
            }
            
            .content {
                padding: 30px 20px !important;
            }
            
            .header {
                padding: 25px 20px !important;
            }
            
            .header h1 {
                font-size: 24px !important;
            }
            
            .cta-button {
                display: block !important;
                text-align: center !important;
                width: 100% !important;
                box-sizing: border-box !important;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <h1><span class="emoji">🔐</span>Password Reset Request</h1>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">
                Hi <strong>${firstname}</strong>,
            </div>

            <div class="main-text">
                We received a request to reset the password for your <strong>Alantur</strong> account.
            </div>

            <div class="main-text">
                If you made this request, you can reset your password using the link below:
            </div>

            <div style="text-align: center;">
                <a href="${resetLink}" class="cta-button">
                    👉 Reset My Password
                </a>
            </div>

            <div class="expiry-notice">
                <span class="clock-icon">⏰</span>
                <strong>This link will expire in 60 minutes for security purposes.</strong>
            </div>

            <div class="warning-box">
                <h4>⚠️ Important Security Information</h4>
                <p>If you didn't request a password reset, please ignore this email or contact our support team immediately.</p>
            </div>

            <div class="security-notice">
                <div style="margin-bottom: 10px;">
                    <span class="icon">🔒</span>
                    <strong>For your security:</strong>
                </div>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Please do not share this link with anyone</li>
                    <li>This link can only be used once</li>
                    <li>Always verify the sender before clicking any links</li>
                    <li>If you're suspicious about this email, contact support directly</li>
                </ul>
            </div>



            <div class="main-text">
                If you continue to have problems, please contact our support team for assistance.
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Stay secure,</p>
            <p><span class="company-name">Alantur Inc</span></p>
            <p style="font-size: 12px; margin-top: 15px; opacity: 0.8;">
                This email was sent to ${email}. For security questions, please contact our support team.
            </p>
            <p style="font-size: 11px; margin-top: 10px; opacity: 0.7;">
                © 2024 Alantur Inc. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>


`

}
module.exports = ForgotTemplate;