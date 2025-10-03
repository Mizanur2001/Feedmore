const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpayController = () => {
    return {
        async createOrder(req, res) {
            try {
                const { amountInPaise } = req.body;

                if (!amountInPaise || amountInPaise <= 0) {
                    return res.status(400).json({
                        status: false,
                        message: "Invalid amount",
                        code: 400
                    });
                }

                const razorpay = new Razorpay({
                    key_id: process.env.RAZORPAY_KEY,
                    key_secret: process.env.RAZORPAY_SECRET,
                });

                razorpay.orders.create({
                    amount: amountInPaise,
                    currency: "INR",
                    receipt: `receipt_order_${Date.now()}`,
                }, (err, order) => {
                    if (err) {
                        return res.status(400).json({
                            status: false,
                            message: "Error creating order",
                            error: err,
                            code: 400
                        });
                    }
                    return res.status(200).json({
                        status: true,
                        message: "Order created successfully",
                        data: { order },
                        code: 200
                    });
                });
            } catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "Internal server error",
                    error: error?.message,
                    code: 500
                })
            }
        },
        async validate(req, res) {
            try {
                const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

                if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
                    return res.status(400).json({
                        status: false,
                        message: "Missing required fields",
                        code: 400
                    });
                }
                const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
                sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
                const digest = sha.digest("hex");
                if (digest !== razorpay_signature) {
                    return res.status(400).json({
                        status: false,
                        message: "Transaction is not legit!",
                        code: 400
                    });
                }


                return res.status(200).json({
                    status: true,
                    message: "Payment validated successfully",
                    data: {
                        orderId: razorpay_order_id,
                        paymentId: razorpay_payment_id,
                    },
                    code: 200
                });

            } catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "Internal server error",
                    error: error?.message,
                    code: 500
                });
            }
        }
    }
}

module.exports = razorpayController;