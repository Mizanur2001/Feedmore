const Orders = require('../../../models/orders')
const statusControler = () => {
    return {
        update(req, res) {
            if (!req.session.user) {
                return res.redirect('/login')
            }
            if (req.session.user.role == 'customer') {
                return res.redirect('/')
            }
            Orders.updateOne({ _id: req.body.orderId }, { status: req.body.status }, (err, data) => {
                if (err) {
                    res.redirect('/admin/orders')
                }
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('updateStatus',{id:req.body.orderId, status : req.body.status})
                res.redirect('/admin/orders')
            })
        }
    }
}

module.exports = statusControler