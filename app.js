if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
 // Used to send files to Flask
const http = require('http');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const User = require('./models/user');
const trainRoutes = require('./routes/trains');
const bookingRoutes=require('./routes/booking')
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/users');
const methodOverride = require('method-override');
const { isLoggedIn } = require('./middleware');
const MongoDBStore = require("connect-mongo");
const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs', ejsMate);
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.use(mongoSanitize({
    replaceWith: '_'
}))
app.use(methodOverride('_method'));
app.use(flash());

const secret = process.env.SECRET || 'thisshouldbeabettersecret!'; 
const store = MongoDBStore.create({ 
    mongoUrl: dbUrl, 
    secret, 
    touchAfter: 24 * 60 * 60, 
});
store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
};
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    // console.log("Session Data:", req.session);
    // console.log("User from Passport:", req.user);
    res.locals.currentUser = req.user|| null;// Access user data in EJS
    // res.locals.success = req.flash('success');
    // res.locals.error = req.flash('error');
    next();
});

// Serve the EJS index page
app.use('/trains', trainRoutes); // User train routes
app.use('/bookings', bookingRoutes);
app.use('/admin', adminRoutes);
app.use('/', userRoutes);
app.get('/', (req, res) => {
    res.render('index');
});



const Port = 3000;
app.listen(Port, () => {
    console.log(`Serving on port ${Port}`)
})