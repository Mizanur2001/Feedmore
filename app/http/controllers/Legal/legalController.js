const legalController = () => {
    return {
        getTerms(req, res) {
            res.render('Legal/Terms');
        },
        getPrivacy(req, res) {
            res.render('Legal/privacy');
        }
    }
};

module.exports = legalController;