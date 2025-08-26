const { Cashfree } = require('cashfree-pg');
const crypto = require('crypto');
const axios = require('axios');
const momentTimezone = require('moment-timezone');
const transactionModel = require('../../../models/transaction')

const userPaymentController = () => {

    const generateOrderId = () => {
        const uniqueId = crypto.randomBytes(16).toString('hex');
        const hash = crypto.createHash('sha256');
        hash.update(uniqueId);
        const orderId = hash.digest('hex');
        return orderId.substr(0, 12);
    }

    return {
        async collectPayment(req, res) {
            try {

                if (!req.session.user) {
                    return res.redirect('/login')
                }

                const { amount, customerName, customerPhone, customerEmail, userId } = req.body

                if (!amount || !customerName || !customerPhone || !customerEmail) {
                    return res.status(400).json({
                        status: false,
                        message: "All fields are required",
                        code: 400
                    })
                }

                if (amount <= 0) {
                    return res.status(400).json({
                        status: false,
                        message: "Amount must be greater than zero",
                        code: 400
                    })
                }

                if (!userId) {
                    return res.status(400).json({
                        status: false, message: "userId Required",
                        code: 400
                    });
                }

                let orderId = generateOrderId();
                const customerId = customerName.replace(/\s+/g, "") + "_" + customerPhone.replace(/\D/g, "");

                // Initiate payment
                let request = {
                    "order_amount": amount,
                    "order_currency": "INR",
                    "order_id": orderId,
                    "customer_details": {
                        "customer_id": customerId,
                        "customer_phone": customerPhone,
                        "customer_name": customerName,
                        "customer_email": customerEmail
                    },
                    "order_meta": {
                        "return_url": `https://feedmore.in/customers/orders`,
                    }
                }

                let cashfree = new Cashfree(Cashfree.SANDBOX, process.env.CASHFREE_USER_PAYMENT_CLIENT_ID, process.env.CASHFREE_USER_PAYMENT_CLIENT_SECRET);

                cashfree.PGCreateOrder(request).then(async (response) => {
                    const newTransaction = new transactionModel({
                        userId,
                        amount,
                        customerName,
                        customerPhone,
                        customerEmail,
                        orderId,
                        date: momentTimezone().tz('Asia/Kolkata').format('dddd, DD-MM-YYYY, h:mm:ss a'),
                    })
                    await newTransaction.save()

                    req.session.orderId = orderId;

                    res.status(200).json({
                        status: true,
                        message: "Payment initiated successfully",
                        data: response.data,
                        code: 200
                    })
                }).catch((error) => {
                    res.status(500).json({
                        status: false,
                        message: "Payment initiation failed",
                        error: error?.response?.data?.message,
                        code: 500
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
        async verifyPayment(req, res) {
            try {
                if (!req.session.user) {
                    return res.redirect('/login')
                }

                const { orderId } = req.body

                if (!orderId) {
                    return res.status(400).json({
                        status: false,
                        message: "Please provide order id",
                        code: 400
                    });
                }


                let cashfree = new Cashfree(Cashfree.SANDBOX, process.env.CASHFREE_USER_PAYMENT_CLIENT_ID, process.env.CASHFREE_USER_PAYMENT_CLIENT_SECRET);
                cashfree.PGFetchOrder(orderId).then(async (response) => {
                    await transactionModel.findOneAndUpdate({ orderId }, { status: response.data.order_status });
                    res.status(200).json({
                        status: true,
                        message: "Payment status fetched successfully",
                        orderStatus: response?.data?.order_status,
                        code: 200
                    })
                }).catch((error) => {
                    res.status(404).json({
                        status: false,
                        message: "Payment status fetch failed",
                        error: error.response.data.message,
                        code: 404
                    });
                });


            } catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "Internal server error",
                    error: error.message,
                    code: 500
                })
            }
        }
    }
}

module.exports = userPaymentController;