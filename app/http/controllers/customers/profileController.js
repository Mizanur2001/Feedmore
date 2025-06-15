const profileController = () => {
    return {
        index(req, res) {
            if(!req.session.user){
                req.flash('error', 'Login First to view you profile')
                return res.redirect('/login')
            }
            res.render('customers/profile',{
                title: 'Profile - FeedMore',
            })
        }
    }
}

module.exports = profileController