const express = require('express');
const app = express();
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const PORT = 3300 || process.env.PORT;

//assets
app.use(express.static('public'));
app.get("/", (req, res) => {
    res.render("home");
});

//set Template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});