const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const orderControler = require('../app/http/controllers/customers/orderControler');
const adminOrderControler = require('../app/http/controllers/admin/orderControler');

function initRoutes(app) {
    app.get("/", homeController().index);
    app.get("/login", authController().login);
    app.post('/login',authController().postLogin)
    app.get('/register', authController().register);
    app.post('/register',authController().postRegister)
    app.get('/cart',cartController().index);
    app.post('/update-cart',cartController().updateCart);
    app.post('/delete-items',cartController().deleteItems);
    app.post('/orders',orderControler().store);
    app.get('/customers/orders',orderControler().index);
    app.get('/admin/orders',adminOrderControler().index)
}

module.exports = initRoutes;