const axios = require('axios');
const paymentModel = require('../../../models/payment');

const paymentController = () => {
    return {
        async MaintenancePaymentPage(req, res) {
            if (!req.session.user) {
                return res.redirect('/login')
            }
            if (req.session.user.role == 'customer') {
                return res.redirect('/')
            }

            // Get oldest unpaid bill from the database
            const unpaidBill = await paymentModel.findOne({
                paid: false,
                // status: "NOT_PAID"
            }).sort({ billingMonth: 1 }); // oldest month first

            if (!unpaidBill) {
                return res.render('payment/paymentPage', {
                    bill: null,
                    message: 'No unpaid bills found'
                });
            }


            res.render('payment/paymentPage', {
                bill: unpaidBill,
                message: null
            });
        },
        async MaintenancePaymentInitiate(req, res) {
            try {
                const { order_id, status } = req.body
                if (!order_id || !status) {
                    return res.status(400).json({
                        message: "Order ID and status are required",
                        code: 400
                    })
                }

                const findBill = await paymentModel.findOne({ _id: order_id })
                if (!findBill) {
                    return res.status(202).json({
                        message: "Bill not found",
                        code: 202
                    })
                }

                //Update the bill status to INITIATE
                await paymentModel.updateOne({ _id: order_id }, { status: "INITIATE" })


                res.json({
                    code: 200,
                    message: "Payment Initiated successfully",
                    data: {
                        order_id,
                        status
                    }
                })
            } catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "Internal server error",
                    error: error.message,
                    code: 500
                })

            }
        },
        MaintenancePaymentVerify(req, res) {
            try {
                const { order_id, status } = req.body
                if (!order_id || !status) {
                    return res.status(400).json({
                        message: "Order ID and status are required",
                        code: 400
                    })
                }


                axios.get(`https://sandbox.cashfree.com/pg/orders/${order_id}`, {
                    // axios.get(`https://api.cashfree.com/pg/orders/${order_id}`, {
                    headers: {
                        'x-client-id': process.env.CLIENT_ID,
                        'x-client-secret': process.env.CLIENT_SECRET,
                        'x-api-version': '2023-08-01',
                    }
                }).then(async (response) => {
                    await paymentModel.updateOne({ _id: order_id }, { 
                        status: response?.data?.order_status,
                        paid: response?.data?.order_status == "PAID" ? true : false
                    })
                    
                    res.json({
                        data: response.data,
                        message: "Payment verified successfully",
                        code: 200
                    });
                }).catch(error => {
                    return res.status(500).json({
                        message: "Internal server error",
                        error: error,
                        code: 500
                    })
                })
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

module.exports = paymentController;