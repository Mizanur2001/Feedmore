const express = require('express');
const app = express();
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const PORT = 3300 || process.env.PORT;
const mongoose = require('mongoose');

//Connecte to dataBase
const URL = "mongodb://localhost/feedmore";
try {
    mongoose.connect(URL)
    const connection = mongoose.connection;
    connection.once('open', () => {
        console.log('Database connected...');
    });
} catch (err) {
    console.log("Connection failure...error->" + err);
}


//assets
app.use(express.static('public'));

//set Template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

//Routers
require('./router/web')(app);

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});