function cartController() {
    return {
        index(req, res) {
            res.render("customers/cart");
        },
        updateCart(req, res) {
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
        },
        deleteItems(req, res) {
            let cart = req.session.cart
            if (cart.items[req.body.items._id].qty != 0) {
                cart.items[req.body.items._id].qty = cart.items[req.body.items._id].qty - 1
                cart.totalQty = cart.totalQty - 1
                cart.totalPrice = cart.totalPrice - req.body.items.price
            }
            res.json(cart.items[req.body.items._id].qty)
        }
    }
}

module.exports = cartController;