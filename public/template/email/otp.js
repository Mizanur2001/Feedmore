exports.otpMailTemplate = (name, otp) => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>FeedMore — Password Reset OTP</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
        :root{
            --bg:#f4f7fb;
            --card:#ffffff;
            --accent:#ff7a00;
            --muted:#6b7280;
            --radius:14px;
            --shadow: 0 8px 30px rgba(18,38,63,0.08);
            --glass: linear-gradient(135deg, rgba(255,122,0,0.06), rgba(45,118,255,0.03));
        }
        *{box-sizing:border-box}
        body{
            margin:0;
            padding:24px;
            background: radial-gradient(1200px 400px at 10% 10%, rgba(45,118,255,0.05), transparent),
                        var(--bg);
            font-family: "Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial;
            color:#222;
            -webkit-font-smoothing:antialiased;
        }
        .wrap{
            max-width:600px;
            margin:28px auto;
            padding:28px;
        }
        .card{
            background: var(--card);
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            overflow:hidden;
            border:1px solid rgba(18,38,63,0.03);
        }
        .header{
            padding:28px;
            display:flex;
            gap:16px;
            align-items:center;
            background: linear-gradient(90deg, rgba(255,122,0,0.06), rgba(45,118,255,0.03));
        }
        .logo{
            width:72px;
            height:72px;
            border-radius:12px;
            overflow:hidden;
            background:var(--glass);
            display:flex;
            align-items:center;
            justify-content:center;
            box-shadow: 0 6px 18px rgba(18,38,63,0.04) inset;
        }
        .logo img{
            width:64px; 
            height:64px;
            display:block;
            border-radius:15px;
        }
        .title{
            font-size:18px;
            font-weight:700;
            color:#111827;
            line-height:1;
        }
        .subtitle{
            margin-top:6px;
            font-size:13px;
            color:var(--muted);
        }
        .content{
            padding:28px;
            text-align:left;
        }
        .greeting{
            font-size:16px;
            color:#111827;
            margin:0 0 8px 0;
            font-weight:600;
        }
        .lead{
            margin:0 0 18px 0;
            color: #374151;
            line-height:1.5;
            font-size:15px;
        }
        .otp-wrap{
            text-align:center;
            margin:18px 0 22px 0;
        }
        .otp-box{
            display:inline-block;
            background-color: #ff6a00;
            color:#fff;
            padding:14px 34px;
            border-radius:10px;
            font-size:28px;
            letter-spacing:6px;
            font-weight:700;
            font-family: "Courier New", Courier, monospace;
            box-shadow: 0 10px 30px rgba(255,122,0,0.18);
        }
        .note{
            margin:0;
            color:var(--muted);
            font-size:13px;
            text-align:center;
        }
        .divider{
            height:1px;
            background:linear-gradient(90deg, transparent, rgba(18,38,63,0.04), transparent);
            margin:20px 0;
        }
        .footer{
            padding:20px 28px 28px;
            text-align:center;
            font-size:13px;
            color:var(--muted);
        }
        .support a{ color:var(--accent); text-decoration:none; }
        .wisdom{
            margin-top:12px;
            font-size:13px;
            color:#374151;
            font-style:italic;
        }
        @media (max-width:480px){
            .wrap{ padding:12px }
            .header, .content, .footer{ padding-left:18px; padding-right:18px }
            .logo{ width:56px; height:56px }
            .otp-box{ font-size:24px; padding:12px 22px; letter-spacing:4px }
        }
    </style>
</head>
<body>
    <div class="wrap">
        <div class="card" role="article" aria-label="Password Reset OTP">
            <div class="header">
                <div class="logo" aria-hidden="true">
                    <img src="https://feedmore.in/img/logo-sort.png" alt="FeedMore"/>
                </div>
                <div>
                    <div class="title">FeedMore — Password Reset</div>
                    <div class="subtitle">One-Time Password to securely continue</div>
                </div>
            </div>

            <div class="content">
                <p class="greeting">Hello ${name},</p>
                <p class="lead">We received a request to reset your FeedMore account password. Use the one-time password (OTP) below to verify your identity and proceed with the reset.</p>

                <div class="otp-wrap">
                    <div class="otp-box" aria-label="One time password">${otp}</div>
                </div>

                <p class="note">This OTP will expire in <strong>15 minutes</strong>. For your security do not share this code with anyone.</p>

                <div class="divider" role="separator"></div>

                <p class="wisdom">A small secure step now keeps your account safe tomorrow.</p>
            </div>

            <div class="footer">
                <div class="support">Need help? Email <a href="mailto:feedmore.in@gmail.com">feedmore.in@gmail.com</a></div>
                <div style="margin-top:8px;color:#9ca3af;font-size:12px;">
                    If you did not request a password reset, you can safely ignore this message.
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
};