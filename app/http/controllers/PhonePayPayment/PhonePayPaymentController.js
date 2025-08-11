const axios = require('axios');
const momentTimezone = require('moment-timezone');
const querystring = require('querystring');
const transactionModel = require('../../../models/transaction');
const clientId = process.env.PHONEPE_MERCHANT_ID;
const clientSecret = process.env.PHONEPE_SALT_KEY;
//SandBOX
// const Authorization_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token";
// const CreatePayment_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay";
// const verifyPayment_BASE_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/order"; // /{orderId}/status

//Production
const Authorization_URL = "https://api.phonepe.com/apis/identity-manager/v1/oauth/token";
const CreatePayment_URL = "https://api.phonepe.com/apis/pg/checkout/v2/pay";
const verifyPayment_BASE_URL = "https://api.phonepe.com/apis/pg/checkout/v2/order"; // /{orderId}/status


// Authorization to Get Access Token
const getAccessToken = async (req, res) => {
    try {
        const payload = querystring.stringify({
            client_id: clientId,
            client_version: 1,
            client_secret: clientSecret,
            grant_type: "client_credentials"
        });

        const response = await axios.post(Authorization_URL, payload, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

        return (response.data);
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error,
            code: 500
        })
    }
}

const phonepePaymentController = () => {
    return {
        async newPayment(req, res) {
            try {
                const { amount, orderId, message, userId } = req.body;
                if (amount <= 0 || !amount) {
                    return res.status(400).json({ status: false, message: "Invalid amount", code: 400 });
                }

                if (!orderId) {
                    return res.status(400).json({ status: false, message: "orderId Required", code: 400 });
                }

                if (!userId) {
                    return res.status(400).json({ status: false, message: "userId Required", code: 400 });
                }

                // find marchantOrderId exit or not
                const existingTransaction = await transactionModel.findOne({ merchantOrderId: orderId });
                if (existingTransaction) {
                    return res.status(400).json({ status: false, message: "TransactionId already exists", code: 400 });
                }

                const token_response = await getAccessToken(req, res);
                const token = token_response?.access_token;

                // Construct paymentFlow in backend
                const paymentFlow = {
                    type: "PG_CHECKOUT",
                    message: message || "Payment for order Default Message",
                    merchantUrls: {
                        redirectUrl: "http://localhost:3300/cart?online_payment=redirect"
                    }
                };

                const response = await axios.post(CreatePayment_URL, {
                    amount: amount,
                    merchantOrderId: orderId,
                    paymentFlow,
                }, {
                    headers: {
                        'Authorization': `O-Bearer ${token}`,
                        'Content-Type': "application/json"
                    }
                });


                // Save transaction details to the database
                const newTransaction = new transactionModel({
                    userId: userId,
                    amount: amount,
                    status: response?.data?.state || 'PENDING',
                    merchantOrderId: orderId,
                    phonepeOrderId: response?.data?.orderId || '',
                    date: momentTimezone().tz('Asia/Kolkata').format('dddd, DD-MM-YYYY, h:mm:ss a'),
                });
                await newTransaction.save();

                res.status(200).json({
                    status: true,
                    data: response.data,
                    code: 200,
                })

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
                const { orderId } = req.body;
                if (!orderId) {
                    return res.status(400).json({ status: false, message: "Invalid orderId", code: 400 });
                }

                //Find transaction by orderId
                const existingTransaction = await transactionModel.findOne({ merchantOrderId: orderId });
                if (!existingTransaction) {
                    return res.status(404).json({ status: false, message: "Transaction not found", code: 404 });
                }

                const token_response = await getAccessToken(req, res);
                const token = token_response?.access_token;

                const response = await axios.get(`${verifyPayment_BASE_URL}/${orderId}/status`, {
                    headers: {
                        'Authorization': `O-Bearer ${token}`,
                        'Content-Type': "application/json"
                    }
                });


                //Update transaction status and transactionId
                await transactionModel.updateOne(
                    { merchantOrderId: orderId },
                    {
                        status: response?.data?.state,
                        transactionId: response?.data?.paymentDetails[0]?.transactionId,
                        paymentMode: response?.data?.paymentDetails[0]?.paymentMode
                    }
                );


                res.status(200).json({
                    status: true,
                    data: response.data.state,
                    code: 200,
                })

            } catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "Internal server error",
                    error: error?.message,
                    code: 500
                })
            }
        }
    }
}

module.exports = phonepePaymentController;
