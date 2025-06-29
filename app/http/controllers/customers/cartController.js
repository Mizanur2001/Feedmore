const menu = require('../../../models/menu')
const AddressModal = require('../../../models/addressModel');

function cartController() {
    return {
        async index(req, res) {
            if (!req.session.user) {
                req.flash('error', 'You need to login first')
                return res.redirect('/login');
            }
            res.header('Cache-Control', 'no-store')

            const address = await AddressModal.findOne({ userId: req.session.user.userId });
            // const address = await AddressModal.findOne({ userId: '6257bd196723dd12d6ef25ca' });

            res.render("customers/cart", {
                title: 'Cart - FeedMore',
                address: address ? address : [],
            });
        },
        async updateCart(req, res) {
            const food = await menu.findOne({ _id: req.body._id })
            if (!req.session.user) {
                return res.json({ message: true })
            }
            else if (req.body.availability != food.availability) {
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
        floatingCartInfo(req, res) {
            const cart = req.session.cart || { items: {} };
            const images = [];
            let count = 0;
            for (let key in cart.items) {
                if (cart.items.hasOwnProperty(key)) {
                    images.push({ image: cart.items[key].items.image });
                    count += cart.items[key].qty;
                }
            }
            res.json({ images, count });
        },
        deleteItems(req, res) {
            let cart = req.session.cart
            const foodId = req.body.items._id
            if (cart.items[foodId].qty != 0) {
                cart.items[foodId].qty = cart.items[foodId].qty - 1
                cart.totalQty = cart.totalQty - 1
                cart.totalPrice = cart.totalPrice - req.body.items.price
            }

            if (cart.totalQty == 0) {
                delete req.session.cart
            }

            if (cart.items[foodId].qty == 0) {
                delete cart.items[foodId];
            }

            res.json(cart)
        }
    }
}

module.exports = cartController;