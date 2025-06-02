const Orders = require('../../../models/orders')
const moment = require('moment');
const Payment = require('../../../models/payment')


const orderControler = () => {
    return {
        async index(req, res) {
            if (!req.session.user) {
                req.flash('error', 'You need to Login First')
                return res.redirect('/login')
            }
            const items = await Orders.find({ customerId: req.session.user.userId }, null, { sort: { 'createdAt': -1 } })
            res.header('Cache-Control', 'no-store')
            res.render("customers/orders", { orders: items });
        },
        async store(req, res) {
            if (!req.session.user) {
                req.flash('error', 'You need to Login First')
                return res.redirect('/login')
            }
            const { address, phone } = req.body
            const phoneRegex = /^(\+91)?[0-9]{10}$/;
            if (!address || !phone) {
                req.flash('error', 'All Field Required')
                return res.redirect('/cart')
            }
            else if (!phoneRegex.test(phone)) {
                req.flash('error', 'Invalid Phone Number')
                return res.redirect('/cart')
            }
            else {

                //const chacking min qty of food

                for (const itemId in req.session.cart.items) {
                    const item = req.session.cart.items[itemId];
                    const { minOrder, name } = item.items;
                    const { qty } = item;

                    if (minOrder > qty) {
                        req.flash('error', `Quantity for ${name} should be at least ${minOrder}.`);
                        return res.redirect('/cart')
                    }
                }

                const orders = new Orders({
                    customerId: req.session.user.userId,
                    items: req.session.cart.items,
                    phone: phone,
                    address: address,
                })

                try {
                    const result = await orders.save();

                    // Calculate total order amount
                    const cartItems = req.session.cart.items;
                    let totalAmount = 0;
                    for (const itemId in cartItems) {
                        const { qty, items } = cartItems[itemId];
                        totalAmount += qty * items.price;
                    }

                    const currentMonth = moment().format('YYYY-MM');

                    // Find existing payment document or create a new one
                    let paymentDoc = await Payment.findOne({ billingMonth: currentMonth });

                    if (paymentDoc) {
                        paymentDoc.totalOrderAmount += totalAmount;
                        paymentDoc.paid = false;
                        paymentDoc.status = "NOT_PAID";
                    } else {
                        paymentDoc = new Payment({
                            billingMonth: currentMonth,
                            totalOrderAmount: totalAmount,
                            paid: false,
                            status: "NOT_PAID",
                            // commissionAmount will be calculated in pre('save')
                        });
                    }

                    await paymentDoc.save(); // Triggers the pre('save') hook for commission


                    //Fetch Daily Order Amount
                    const now = new Date();
                    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    const results = await Orders.aggregate([
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
                            }
                        }
                    ]);
                    const dailyTotal = results[0].daily[0]?.total || 0;
                    
                    
                    // Send Data to the event emitter (Using Socket Io)
                    Orders.populate(result, { path: 'customerId' }, (err, placedOrder) => {
                        if (err) {
                            req.flash('error', 'Something went wrong while placing the order');
                            return res.redirect('/cart');
                        }

                        delete req.session.cart;
                        req.flash('success', 'Order placed successfully');

                        //Emit
                        const eventEmitter = req.app.get('eventEmitter')
                        eventEmitter.emit('oderPlace', placedOrder)

                        //Emit for Total totalOrdersAmount (Daly)
                        eventEmitter.emit('totalOrdersAmount', dailyTotal)

                        return res.redirect('/customers/orders');
                    });
                } catch (err) {
                    console.error('Order or payment failed:', err);
                    req.flash('error', 'Something went wrong');
                    return res.redirect('/cart');
                }

            }
        },
        async show(req, res) {
            try {
                const order = await Orders.findById(req.params.id)
                if (order.customerId == req.session.user.userId) {
                    return res.render('customers/singleOrder', { order })
                }
                cnsole.log("it is here")
            }
            catch (err) {
                return res.redirect('/customers/orders')
            }
        }
    }
}

module.exports = orderControler