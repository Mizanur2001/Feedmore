const AddressModal = require('../../../models/addressModel');
const userModal = require('../../../models/user');
const orderModel = require('../../../models/orders');
const profileController = () => {
    return {
        async index(req, res) {
            if (!req.session.user) {
                req.flash('error', 'Login First to view your profile')
                return res.redirect('/login')
            }

            // Fetch user Address
            const address = await AddressModal.findOne({ userId: req.session.user.userId });
            const orders = await orderModel.find({ customerId: req.session.user.userId });
            const user = await userModal.findById(req.session.user.userId);

            //calculate total orders + total amount spent
            let totalOrders = orders.length;
            let totalAmountSpent = 0;
            orders.forEach(order => {
                const items = Object.values(order.items || {});
                items.forEach(({ items: details = {}, qty = 0 }) => {
                    totalAmountSpent += (details.price || 0) * qty;
                });
            });

            //Calculate How old is this account in years + months + days
            const createdAt = new Date(user.createdAt);
            const now = new Date();

            const ageInMilliseconds = now - createdAt;
            const ageInDays = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24));
            const years = Math.floor(ageInDays / 365);
            const months = Math.floor((ageInDays % 365) / 30);
            const days = ageInDays % 30;
            const accountAge = `${years} years, ${months} months, and ${days} days`;

            res.render('customers/profile', {
                title: 'Profile - FeedMore',
                address: address ? address : [],
                totalOrders,
                totalAmountSpent,
                accountAge,
                user
            })
        }
    }
}

module.exports = profileController