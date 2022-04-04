const Order = require('../../../models/orders')

const orderControler = () => {
    return {
        index(req, res) {
            if (!req.session.user) {
                return res.redirect('/login')
            }
            if (req.session.user.role == 'customer') {
                return res.redirect('/')
            }
            Order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 } }).populate('customerId', '-password').exec((err, orders) => {
                if (req.xhr) {
                    return res.json(orders)
                } else {
                    return res.render('admin/order')
                }
            })
        }
    }
}

module.exports = orderControler