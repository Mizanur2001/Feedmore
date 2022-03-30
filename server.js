require('dotenv').config()
const express = require('express');
const app = express();
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const PORT = 3300 || process.env.PORT;
const mongoose = require('mongoose');
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')(session)

//Connecte to dataBase
const URL = "mongodb://localhost/feedmore";
mongoose.connect(URL,{useNewUrlParser: true , useUnifiedTopology: true})
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected...');
}).catch(err => {
    console.log("Connection failure...error->" + err);
})



//Session connection
let mongoStore = new MongoDbStore({
    mongooseConnection: connection,
    collection: 'sessions'
})

//Session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } //life 24 hour
    //cookie: { maxAge: 1000 *10 } //life 10 seconds
}))

app.use(flash())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Set Global middleware
app.use((req,res,next)=>{
    res.locals.session = req.session
    next()
})

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