const menu = require('../../../models/menu')
function cartController() {
    return {
        index(req, res) {
            if (!req.session.user) {
                req.flash('error', 'You need to login first')
                return res.redirect('/login');
            }
            res.header('Cache-Control', 'no-store')
            res.render("customers/cart");
        },
        async updateCart(req, res) {
            const food = await menu.findOne({ _id: req.body._id })
            if (!req.session.user) {
                return res.json({ message: true })
            }
            else if(req.body.availability!=food.availability){
                return res.json({ availableFoodMsg: true })
            }
            else {
                if (!req.session.cart) {
                    req.session.cart = {
                        items: {},
                        totalQty: 0,
                        totalPrice: 0
                    }
                }
                let cart = req.session.cart;

                if (!cart.items[req.body._id]) {
                    cart.items[req.body._id] = {
                        items: req.body,
                        qty: 1
                    }
                    cart.totalQty = cart.totalQty + 1
                    cart.totalPrice = cart.totalPrice + req.body.price
                }
                else {
                    cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1
                    cart.totalQty = cart.totalQty + 1
                    cart.totalPrice = cart.totalPrice + req.body.price
                }
                res.json({ totalQty: req.session.cart.totalQty })
            }
        },
        deleteItems(req, res) {
            let cart = req.session.cart
            if (cart.items[req.body.items._id].qty != 0) {
                cart.items[req.body.items._id].qty = cart.items[req.body.items._id].qty - 1
                cart.totalQty = cart.totalQty - 1
                cart.totalPrice = cart.totalPrice - req.body.items.price
            }
            if(cart.totalQty == 0){
                delete req.session.cart
            }
            res.json(cart.items[req.body.items._id].qty)
        }
    }
}

module.exports = cartController;