exports.otpMailTemplate = (name, otp) => {
return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your One-Time Password</title>
    <style>
        /* Base styles */
        body {
            margin: 0;
            padding: 0;
            background-color: #f4f4f7;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        /* Main container for the email */
        .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
            overflow: hidden;
        }

        /* Header with a subtle background */
        .email-header {
            background-color: #fff8f0;
            padding: 40px 20px;
            text-align: center;
        }

        .logo {
            max-width: 130px;
            margin-bottom: 20px;
        }

        .header-title {
            font-size: 26px;
            font-weight: 600;
            color: #333333;
            margin: 0;
        }

        /* Main content area */
        .email-body {
            padding: 30px 40px;
            text-align: center;
            font-size: 16px;
            line-height: 1.6;
            color: #555555;
        }

        /* The standout OTP box */
        .otp-code {
            display: inline-block;
            background-color: #FF8800;
            color: #ffffff;
            font-size: 36px;
            font-weight: 700;
            letter-spacing: 5px;
            padding: 15px 40px;
            border-radius: 8px;
            margin: 25px 0;
            font-family: 'Courier New', Courier, monospace;
        }

        .validity-text {
            font-size: 14px;
            color: #888888;
            margin-top: 15px;
        }

        /* Footer section */
        .email-footer {
            background-color: #fafafa;
            padding: 25px 40px;
            text-align: center;
            font-size: 14px;
            color: #888888;
            border-top: 1px solid #eeeeee;
        }

        .email-footer a {
            color: #FF8800;
            text-decoration: none;
            font-weight: 500;
        }

    </style>
</head>
<body>
    <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
        Your FeedMore verification code is here.
    </div>

    <div class="email-container">
        <div class="email-header">
            <img src="https://feedmore.in/img/logo.png" alt="FeedMore Logo" class="logo" />
            <h1 class="header-title">Verification Code</h1>
        </div>

        <div class="email-body">
            <p>Hello ${name},</p>
            <p>Please use the verification code below to complete your password reset. The code is active for the next 15 minutes.</p>
            <div class="otp-code">${otp}</div>
            <p>If you did not request this, please disregard this email or contact our support if you have any concerns.</p>
        </div>

        <div class="email-footer">
            <p>Need help? Contact our support team at<br/>
                <a href="mailto:feedmore.in@gmail.com">feedmore.in@gmail.com</a>
            </p>
        </div>
    </div>
</body>
</html>`;
};