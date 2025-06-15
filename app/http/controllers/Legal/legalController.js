const legalController = () => {
    return {
        getTerms(req, res) {
            res.render('Legal/Terms', {
                title: 'Terms of Service - FeedMore',
            });
        },
        getPrivacy(req, res) {
            res.render('Legal/privacy', {
                title: 'Privacy Policy - FeedMore',
            });
        }
    }
};

module.exports = legalController;