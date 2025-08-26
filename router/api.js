const paymentController = require('../app/http/controllers/payment/paymentController');
const phonepePaymentController = require('../app/http/controllers/PhonePayPayment/PhonePayPaymentController')

const apiRouter = (app) => {
    app.post('/api/v1/tools/payment/initiate', paymentController().MaintenancePaymentInitiate);
    app.post('/api/v1/tools/payment/verify', paymentController().MaintenancePaymentVerify);
    // app.post('/api/v1/tools/payment/phonepe/initiate', phonepePaymentController().newPayment);
    // app.post('/api/v1/tools/payment/phonepe/verify', phonepePaymentController().verifyPayment);
}

module.exports = apiRouter;