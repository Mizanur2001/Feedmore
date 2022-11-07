const menu = require('../../models/menu');
function homeController() {
    return {
        async index(req, res) {
            const available = [], unAvailable = [];
            const food = await menu.find();
            food.forEach(element => {
                element.availability == "available" ? available.push(element) : unAvailable.push(element);
            });

            const foodSorted = [...available, ...unAvailable]

            res.header('Cache-Control', 'no-store')
            res.render("home", { foodItems: foodSorted });
        }
    }
}

module.exports = homeController;