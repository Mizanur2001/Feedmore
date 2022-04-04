const menu = require('../../models/menu');
function homeController() {
    return {
        async index(req, res) {
            const food = await menu.find();
            res.header('Cache-Control', 'no-store')
            res.render("home", { foodItems: food });
        }
    }
}

module.exports = homeController;