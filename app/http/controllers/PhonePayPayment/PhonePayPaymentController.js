const axios = require('axios');
const querystring = require('querystring');
const clientId = process.env.PHONEPE_MERCHANT_ID;
const clientSecret = process.env.PHONEPE_SALT_KEY;
const Authorization_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token";
const CreatePayment_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay";
const verifyPayment_BASE_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/order"; // /{orderId}/status


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
                const { amount, orderId, message } = req.body;
                if (amount <= 0) {
                    return res.status(400).json({ status: false, message: "Invalid amount", code: 400 });
                }

                if (!orderId) {
                    return res.status(400).json({ status: false, message: "Invalid orderId", code: 400 });
                }

                const token_response = await getAccessToken(req, res);
                const token = token_response?.access_token;

                // Construct paymentFlow in backend
                const paymentFlow = {
                    type: "PG_CHECKOUT",
                    message: message || "Payment for order Default Message",
                    merchantUrls: {
                        redirectUrl: "https://feedmore.in/redirect"
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

                const token_response = await getAccessToken(req, res);
                const token = token_response?.access_token;

                const response = await axios.get(`${verifyPayment_BASE_URL}/${orderId}/status`, {
                    headers: {
                        'Authorization': `O-Bearer ${token}`,
                        'Content-Type': "application/json"
                    }
                });

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
        }
    }
}

module.exports = phonepePaymentController;
