const paymentController = require('../app/http/controllers/payment/paymentController');

const apiRouter = (app)=>{
    app.post('/api/v1/tools/payment/initiate', paymentController().MaintenancePaymentInitiate);
    app.post('/api/v1/tools/payment/verify', paymentController().MaintenancePaymentVerify);
}

module.exports = apiRouter;