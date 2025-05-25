const Order = require('../../../models/orders')
const paymentModel = require('../../../models/payment');


const analyticsController = () => {
    return {
        async index(req, res) {
            try {
                if (!req.session.user) {
                    return res.redirect('/login');
                }
                if (req.session.user.role == 'customer') {
                    return res.redirect('/');
                }

                const now = new Date();
                const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const startOfYear = new Date(now.getFullYear(), 0, 1);

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
                            ],
                            weekly: [
                                { $match: { createdAt: { $gte: startOfWeek } } },
                                { $group: { _id: null, total: { $sum: "$totalPrice" } } }
                            ],
                            monthly: [
                                { $match: { createdAt: { $gte: startOfMonth } } },
                                { $group: { _id: null, total: { $sum: "$totalPrice" } } }
                            ],
                            yearly: [
                                { $match: { createdAt: { $gte: startOfYear } } },
                                { $group: { _id: null, total: { $sum: "$totalPrice" } } }
                            ],
                            overall: [
                                { $group: { _id: null, total: { $sum: "$totalPrice" } } }
                            ]
                        }
                    }
                ]);

                const dailyTotal = results[0].daily[0]?.total || 0;
                const weeklyTotal = results[0].weekly[0]?.total || 0;
                const monthlyTotal = results[0].monthly[0]?.total || 0;
                const yearlyTotal = results[0].yearly[0]?.total || 0;
                const overallTotal = results[0].overall[0]?.total || 0;

                //Maintenance Billing Data
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

                const data = {
                    dailyTotal,
                    weeklyTotal,
                    monthlyTotal,
                    yearlyTotal,
                    overallTotal,
                    billTotalOrderAmount: unpaidBill.totalOrderAmount,
                    billCommissionAmount: unpaidBill.commissionAmount,
                    billingMonth: unpaidBill.billingMonth,
                };

                res.render('analytics/orderPriceCount', { data });
            } catch (error) {
                console.log(error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    }
}

module.exports = analyticsController;
