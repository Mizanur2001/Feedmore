const sessionManager = () => {
    return {
        deleteMarchantOrderId(req, res) {
            try {
                if (!req.session.user) {
                    return res.redirect('/login')
                }

                delete req.session.merchantOrderId;
                return res.json({
                    status: true,
                    message: "merchantOrderId deleted from session"
                });
            } catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "Internal server error",
                    error: error?.message,
                    code: 500
                })
            }
        },
        addPaymentType(req, res) {
            try {
                if (!req.session.user) {
                    return res.redirect('/login')
                }

                req.session.paymentType = 'Online';
                req.session.save(err => {
                    if (err) {
                        return res.status(500).json({
                            status: false,
                            message: "Session save error",
                            error: err?.message,
                            code: 500
                        });
                    }
                    return res.json({
                        status: true,
                        message: "Payment type added to session"
                    });
                });

            } catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "Internal server error",
                    error: error?.message,
                    code: 500
                })
            }
        }
    }
}

module.exports = sessionManager;