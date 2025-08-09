const { v4: uuidv4 } = require('uuid');

const loadingPageController = () => {
    return {
        async showLoadingPage(req, res) {
            try {
                if (!req.session.user) {
                    return res.redirect('/login')
                }

                // Generate a unique Transaction ID and add to session
                const merchantOrderId = 'FMT-' + uuidv4();
                req.session.merchantOrderId = merchantOrderId;

                res.render('customers/paymentLoadingPage', {
                    title: 'Payment Processing...',
                    session: req.session,
                });
            } catch (error) {
                console.error("Error rendering loading page:", error);
                res.status(500).send("Internal Server Error");
            }
        }
    };
};

module.exports = loadingPageController;
