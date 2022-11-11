const privacy = () => {
    return {
        index(req, res) {
            res.render("admin/privacy");
        }
    }
}

module.exports= privacy