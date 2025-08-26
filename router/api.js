const paymentController = require('../app/http/controllers/payment/paymentController');
const phonepePaymentController = require('../app/http/controllers/PhonePayPayment/PhonePayPaymentController')
const onlinePaymentUser = require('../app/http/controllers/onlinePaymentUser/userPaymentController')

const apiRouter = (app) => {
    app.post('/api/v1/tools/payment/initiate', paymentController().MaintenancePaymentInitiate);
    app.post('/api/v1/tools/payment/verify', paymentController().MaintenancePaymentVerify);
    // app.post('/api/v1/tools/payment/phonepe/initiate', phonepePaymentController().newPayment);
    // app.post('/api/v1/tools/payment/phonepe/verify', phonepePaymentController().verifyPayment);
    app.post('/api/v1/tools/payment/customers/cashfree/initiate', onlinePaymentUser().collectPayment);
    app.post('/api/v1/tools/payment/customers/cashfree/verify', onlinePaymentUser().verifyPayment);
}

module.exports = apiRouter;