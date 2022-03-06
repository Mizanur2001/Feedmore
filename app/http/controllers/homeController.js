const menu = require('../../models/menu');
function homeController() {
    return {
        async index(req, res) {
            const food = await menu.find();
            res.render("home", { foodItems: food });
        }
    }
}

module.exports = homeController;