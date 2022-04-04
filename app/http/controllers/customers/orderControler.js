const Orders = require('../../../models/orders')
const orderControler = () => {
    return {
        async index(req, res) {
            if (!req.session.user) {
                req.flash('error', 'You need to Login First')
                return res.redirect('/login')
            }
            const items = await Orders.find({ customerId: req.session.user.userId },null,{sort:{'createdAt':-1}})
            res.header('Cache-Control', 'no-store')
            res.render("customers/orders", { orders: items });
        },
        store(req, res) {
            if (!req.session.user) {
                req.flash('error', 'You need to Login First')
                return res.redirect('/login')
            }
            const { address, phone } = req.body
            if (!address || !phone) {
                req.flash('error', 'All Field Required')
                return res.redirect('/cart')
            }
            else if (phone.length != 10) {
                req.flash('error', 'Invalid Phone Number')
                return res.redirect('/cart')
            }
            else {
                const orders = new Orders({
                    customerId: req.session.user.userId,
                    items: req.session.cart.items,
                    phone: phone,
                    address: address,
                })
                orders.save().then(result => {
                    req.flash('success', 'Order placed successfully')
                    delete req.session.cart
                    return res.redirect('/customers/orders')
                }).catch(err => {
                    req.flash('error', 'Something went Wrong')
                    return req.redirect('/cart')
                })
            }
        }
    }
}

module.exports = orderControler