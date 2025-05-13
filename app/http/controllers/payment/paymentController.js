const paymentController = ()=>{
    return{
        MaintenancePaymentPage(req, res){
            if (!req.session.user) {
                return res.redirect('/login')
            }
            if (req.session.user.role == 'customer') {
                return res.redirect('/')
            }
            res.render('payment/paymentPage');
        }
    }
}

module.exports = paymentController;