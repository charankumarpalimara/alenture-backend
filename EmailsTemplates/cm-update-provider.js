function CmUpdateTemplate({ imagelink, firstname, email, extraind10, updateDetails }) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile Updated - Alantur</title>
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
            background-color: #fff;
            background: #fff;
            padding: 30px 20px;
            text-align: center;
            color: white;
        }

        .header h1 {
            margin: 0;
            color: #27ae60;
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

        .success-message {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            padding: 20px;
            border-radius: 6px;
            margin: 25px 0;
            color: #155724;
        }

        .success-message h3 {
            margin-top: 0;
            color: #155724;
            font-size: 18px;
        }

        .update-details {
            background-color: #f8f9fa;
            padding: 25px;
            border-radius: 8px;
            margin: 25px 0;
            border-left: 4px solid #27ae60;
        }

        .update-details h3 {
            color: #2c3e50;
            margin-top: 0;
            margin-bottom: 15px;
            font-size: 18px;
        }

        .detail-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 12px;
            font-size: 15px;
        }

        .detail-item .icon {
            color: #27ae60;
            font-weight: bold;
            margin-right: 10px;
            font-size: 16px;
        }

        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
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

        .role-specific {
            background-color: #e8f4fd;
            border-left: 4px solid #3498db;
            padding: 20px;
            margin: 25px 0;
            border-radius: 0 6px 6px 0;
        }

        .role-specific h4 {
            color: #2980b9;
            margin-top: 0;
            margin-bottom: 15px;
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

        .security-notice {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            font-size: 14px;
            color: #856404;
        }

        .timestamp {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            font-size: 14px;
            color: #6c757d;
            text-align: center;
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
            <img src="${imagelink}" alt="Alantur Logo" style="max-width: 300px; width: 100%; height: auto; margin-bottom: 15px;" />
            <h1>✅ Profile Updated Successfully</h1>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">
                Hi <strong>${firstname}</strong>,
            </div>

            <div class="success-message">
                <h3>🎉 Your profile has been updated successfully!</h3>
                <p>We've received and processed your profile update request. Your information has been updated in our system.</p>
            </div>

            <div class="main-text">
                Your login credentials remain the same:
                <br><strong>Username:</strong> ${email}
            </div>

            <div class="update-details">
                <h3>📝 Update Summary</h3>
                ${updateDetails ? updateDetails.map(detail => `
                    <div class="detail-item">
                        <span class="icon">✓</span>
                        <span>${detail}</span>
                    </div>
                `).join('') : `
                    <div class="detail-item">
                        <span class="icon">✓</span>
                        <span>Profile information has been updated</span>
                    </div>
                `}
            </div>

            <div style="text-align: center;">
                <a href="https://www.alantur.ai/login" class="cta-button">
                    🔐 Access Your Account
                </a>
            </div>

            <div class="role-specific">
                <h4>Your Role: <strong>${extraind10}</strong></h4>
                <p>As a Customer Manager, you can continue to:</p>
                <div class="detail-item">
                    <span class="icon">✅</span>
                    <span>Submit customer feedback and experiences</span>
                </div>
                <div class="detail-item">
                    <span class="icon">✅</span>
                    <span>Manage customer interactions</span>
                </div>
                <div class="detail-item">
                    <span class="icon">✅</span>
                    <span>Track customer satisfaction</span>
                </div>
            </div>

            <div class="main-text">
                If you didn't make these changes or have any questions, please contact our support team immediately.
            </div>

            <div class="main-text">
                Thank you for keeping your profile up to date!
            </div>

            <div class="timestamp">
                <strong>Update completed:</strong> ${new Date().toLocaleString()}
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Best regards,</p>
            <p><span class="company-name">Alantur Inc</span></p>
            <p style="font-size: 12px; margin-top: 15px; opacity: 0.8;">
                This email was sent to ${email}. If you have any questions, please contact our support team.
            </p>
        </div>
    </div>
</body>
</html>
`
}

module.exports = CmUpdateTemplate;
