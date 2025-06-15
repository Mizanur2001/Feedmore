const Order = require('../../../models/orders')
const paymentModel = require('../../../models/payment')
const moment = require('moment');

const orderControler = () => {
    return {
        async index(req, res) {
            if (!req.session.user) {
                return res.redirect('/login')
            }
            if (req.session.user.role == 'customer') {
                return res.redirect('/')
            }

            // Check if the payment is paid or not
            const unpaidBill = await paymentModel.findOne({ paid: false }).sort({ billingMonth: 1 });
            const currentMonth = moment().format('MM');
            const BillingMonth = moment(unpaidBill?.billingMonth).format('MM');
            if (!unpaidBill?.paid && currentMonth != BillingMonth) {
                return res.redirect('/maintenance-payment')
            }


            Order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 } }).populate('customerId', '-password').exec((err, orders) => {
                if (req.xhr) {
                    return res.json(orders);
                } else {
                    return res.render('admin/order', {
                        title: 'Admin Orders - FeedMore',
                    });
                }
            });
        },
        async priceCalculation(req, res) {
            try {
                if (!req.session.user) {
                    return res.redirect('/login');
                }
                if (req.session.user.role == 'customer') {
                    return res.redirect('/');
                }

                const now = new Date();
                const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

                const results = await Order.aggregate([
                    {
                        $addFields: {
                            totalPrice: {
                                $sum: {
                                    $map: {
                                        input: { $objectToArray: "$items" },
                                        as: "item",
                                        in: { $multiply: ["$$item.v.qty", "$$item.v.items.price"] }
                                    }
                                }
                            }
                        }
                    },
                    {
                        $facet: {
                            daily: [
                                { $match: { createdAt: { $gte: startOfDay } } },
                                { $group: { _id: null, total: { $sum: "$totalPrice" } } }
                            ]
                        }
                    }
                ]);

                const dailyTotal = results[0].daily[0]?.total || 0;

                return res.json({
                    dailyTotal,
                });
            } catch (error) {
                console.log(error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    };
};

module.exports = orderControler;