const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const orderControler = require('../app/http/controllers/customers/orderControler');
const adminOrderControler = require('../app/http/controllers/admin/orderControler');
const statusControler = require('../app/http/controllers/admin/statusControler');
const availabelControler = require('../app/http/controllers/admin/availableControler');
const profileController = require('../app/http/controllers/customers/profileController');
const logoutController = require('../app/http/controllers/customers/logoutController');
const Legal = require('../app/http/controllers/Legal/legalController');
const paymentController = require('../app/http/controllers/payment/paymentController');
const analyticsController = require('../app/http/controllers/analytics/analyticsController');
const addressController = require('../app/http/controllers/customers/addressController')

function initRoutes(app) {
    app.get("/", homeController().index);
    app.get("/login", authController().login);
    app.get("/logout", logoutController().logout);
    app.post('/login', authController().postLogin)
    app.get('/register', authController().register);
    app.post('/register', authController().postRegister);
    app.get('/cart', cartController().index);
    app.post('/update-cart', cartController().updateCart);
    app.get('/cart-info', cartController().floatingCartInfo);
    app.post('/delete-items', cartController().deleteItems);
    app.post('/orders', orderControler().store);
    app.get('/customers/orders', orderControler().index);
    app.get('/customers/orders/:id', orderControler().show);
    app.get('/admin/orders', adminOrderControler().index);
    app.get('/admin/orders/pricecalculation', adminOrderControler().priceCalculation);
    app.post('/admin/order/status', statusControler().update);
    app.get('/admin/available', availabelControler().index);
    app.post('/admin/available', availabelControler().update);
    app.get('/admin/analytics', analyticsController().index)
    app.get('/customers/profile', profileController().index);
    app.get('/privacy', Legal().getPrivacy);
    app.get('/terms', Legal().getTerms);
    app.get('/maintenance-payment', paymentController().MaintenancePaymentPage);
    app.post('/add-address', addressController().addAddress);
    app.get('/get-address/:userId', addressController().getAddress);
    app.put('/update-address',addressController().updateAddress);
}

module.exports = initRoutes;