function PasswordUpdateTemplate({ firstname, email, oldEmail, newEmail, updateTime, role }) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Updated Successfully - Alantur</title>
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
            background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
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

        .success-notice {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            padding: 20px;
            border-radius: 6px;
            margin: 25px 0;
            font-size: 15px;
            color: #155724;
            font-weight: 500;
            text-align: center;
        }

        .success-notice .check-icon {
            font-size: 20px;
            margin-right: 8px;
        }

        .timestamp-box {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            padding: 20px;
            border-radius: 6px;
            margin: 25px 0;
            text-align: center;
        }

        .timestamp-box .time {
            font-weight: 600;
            color: #495057;
            font-size: 16px;
        }

        .timestamp-box .label {
            color: #6c757d;
            font-size: 14px;
            margin-bottom: 5px;
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

        .warning-box {
            background-color: #f8d7da;
            border-left: 4px solid #e74c3c;
            padding: 20px;
            margin: 25px 0;
            border-radius: 0 6px 6px 0;
        }

        .warning-box h4 {
            color: #721c24;
            margin-top: 0;
            margin-bottom: 10px;
            font-size: 16px;
        }

        .warning-box p {
            margin: 0;
            color: #721c24;
            font-size: 14px;
        }

        .contact-support {
            background-color: #e3f2fd;
            border: 1px solid #bbdefb;
            padding: 20px;
            border-radius: 6px;
            margin: 25px 0;
            text-align: center;
        }

        .contact-support h4 {
            color: #1565c0;
            margin-top: 0;
            margin-bottom: 10px;
            font-size: 16px;
        }

        .contact-support p {
            margin: 0;
            color: #1976d2;
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
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <h1><span class="emoji">✅</span>Account Updated Successfully</h1>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">
                Hi <strong>${firstname}</strong>,
            </div>

            <div class="main-text">
                Your account information for your <strong>Alantur</strong> account has been updated successfully.
            </div>

            <div class="success-notice">
                <span class="check-icon">🔒</span>
                <strong>Your account is now secured with your updated information.</strong>
            </div>

            <div class="timestamp-box">
                <div class="label">Account updated on:</div>
                <div class="time">${updateTime}</div>
            </div>

            ${role ? `
            <div class="timestamp-box">
                <div class="label">Account Role:</div>
                <div style="font-weight: 600; color: #495057; font-size: 16px;">${role === 'cm' ? "Customer Manager" : role === 'crm' ? "Relationship Manager" : role === 'hob' ? "Head of the Business" : ""}</div>
            </div>
            ` : ''}

            ${oldEmail && newEmail ? `
            <div class="timestamp-box">
                <div class="label">Email Address Changes:</div>
                <div style="margin: 10px 0;">
                    <div style="color: #6c757d; font-size: 14px; margin-bottom: 5px;">Previous Email:</div>
                    <div style="font-weight: 500; color: #495057; margin-bottom: 15px;">${oldEmail}</div>
                    <div style="color: #6c757d; font-size: 14px; margin-bottom: 5px;">New Email:</div>
                    <div style="font-weight: 600; color: #27ae60;">${newEmail}</div>
                </div>
            </div>
            ` : ''}

            <div class="warning-box">
                <h4>🚨 Didn't make these changes?</h4>
                <p>If you did not make these account changes, please contact our support team immediately. Your account security may be compromised.</p>
            </div>

            <div class="security-notice">
                <div style="margin-bottom: 10px;">
                    <span class="icon">🔒</span>
                    <strong>Security Tips:</strong>
                </div>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Use a strong, unique password for your account</li>
                    <li>Don't share your password with anyone</li>
                    <li>Consider enabling two-factor authentication if available</li>
                    <li>Log out from all devices if you suspect unauthorized access</li>
                </ul>
            </div>

            <div class="contact-support">
                <h4>Need Help?</h4>
                <p>If you have any questions or concerns about your account security, our support team is here to help.</p>
            </div>

            <div class="main-text">
                Thank you for keeping your account secure.
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Stay secure,</p>
            <p><span class="company-name">Alantur Inc</span></p>
            <p style="font-size: 12px; margin-top: 15px; opacity: 0.8;">
                This email was sent to ${newEmail || email}. For security questions, please contact our support team.
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
module.exports = PasswordUpdateTemplate;