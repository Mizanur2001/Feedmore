const menu = require('../../../models/menu');
function availabelControler() {
    return {
        async index(req, res) {
            if (!req.session.user) {
                return res.redirect('/login')
            }
            if (req.session.user.role == 'customer') {
                return res.redirect('/')
            }
            const food = await menu.find()
            food.sort((a, b) => {
                if (a.availability === 'available' && b.availability !== 'available') return -1;
                if (a.availability !== 'available' && b.availability === 'available') return 1;
                return 0;
            });
            if (req.xhr) {
                return res.json(food)
            }
            else {
                res.render('admin/available', { 
                    title: 'Admin Available Food - FeedMore',
                    allFoods: food 
                })
            }
        },
        update(req, res) {
            if (!req.session.user) {
                return res.redirect('/login')
            }
            if (req.session.user.role == 'customer') {
                return res.redirect('/')
            }
            menu.updateOne({ _id: req.body.foodId }, { availability: req.body.availableStatus }, (err, data) => {
                if (err) {
                    res.redirect('admin/available')
                }
                res.redirect('/admin/available')
            })
        }
    }
}

module.exports = availabelControler