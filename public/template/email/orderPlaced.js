exports.orderPlacedTemplate = (name, order_id, order_date) => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Order Placed Successfully</title>
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
            max-width: 520px;
            margin: 40px auto;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.08);
            padding: 32px 24px;
            text-align: center;
        }
        .logo {
            width: 120px;
            margin-bottom: 18px;
        }
        .heading {
            font-size: 24px;
            font-weight: bold;
            color: #FF8800;
            margin-bottom: 8px;
            letter-spacing: 1px;
        }
        .message {
            font-size: 20px;
            font-weight: 600;
            color: #222;
            margin-bottom: 18px;
        }
        .body {
            font-size: 16px;
            color: #444;
            margin-bottom: 24px;
        }
        .order-info {
            background: #FFF3E0;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 18px;
            color: #FF8800;
            font-weight: 500;
        }
        .delivery-slots {
            background: #FF8800;
            color: #fff;
            border-radius: 8px;
            padding: 14px;
            margin-bottom: 18px;
            font-size: 15px;
            font-weight: 500;
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
        <div class="heading">FeedMore</div>
        <div class="message">Order Placed Successfully</div>
        <div class="body">
            <p>Dear ${name},</p>
            <p>Thank you for placing an order with FeedMore!</p>
            <div class="order-info">
                <div>Order ID: <strong>${order_id}</strong></div>
                <div>Order Date: <strong>${order_date}</strong></div>
            </div>
            <p>Your order is now being processed and will be dispatched soon.</p>
        </div>
        <div class="delivery-slots">
            <div>Afternoon Delivery: <strong>12:30 PM – 2:30 PM</strong></div>
            <div>Evening Delivery: <strong>9:30 PM – 11:00 PM</strong></div>
        </div>
        <div class="support">
            If you have any questions or need assistance, please email us at
            <a href="mailto:feedmore.in@gmail.com">feedmore.in@gmail.com</a>.<br>We are here to help!
        </div>
    </div>
</body>
</html>`;
};
