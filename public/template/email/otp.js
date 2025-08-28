exports.otpMailTemplate = (name, otp) => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>OTP for Password Reset</title>
    <style>
        body {
            background-color: #f7f7f7;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 16px;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 480px;
            margin: 40px auto;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.08);
            padding: 32px 24px;
            text-align: center;
        }
        .logo {
            width: 120px;
            margin-bottom: 24px;
        }
        .message {
            font-size: 22px;
            font-weight: 600;
            color: #FF8800;
            margin-bottom: 18px;
        }
        .body {
            font-size: 16px;
            margin-bottom: 24px;
            color: #444;
        }
        .otp-box {
            display: inline-block;
            background: #FF8800;
            color: #fff;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 4px;
            padding: 12px 32px;
            border-radius: 8px;
            margin: 18px 0;
        }
        .support {
            font-size: 14px;
            color: #888;
            margin-top: 28px;
        }
        a {
            color: #FF8800;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="https://feedmore.in/img/logo.png" alt="FeedMore Logo" class="logo" />
        <div class="message">Password Reset OTP</div>
        <div class="body">
            <p>Dear ${name},</p>
            <p>We received a request to reset your password for your FeedMore account. Please use the OTP below to proceed:</p>
            <div class="otp-box">${otp}</div>
            <p>This OTP is valid for 5 minutes.<br>If you did not request a password reset, please ignore this email.</p>
        </div>
        <div class="support">
            Need help? Email us at <a href="mailto:feedmore.in@gmail.com">feedmore.in@gmail.com</a>
        </div>
    </div>
</body>
</html>`;
};