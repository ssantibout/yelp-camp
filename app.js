const express = require('express');
const path = require("path");
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const AppError = require('./utils/appError');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const User = require('./models/user');
const LocalStrategy = require('passport-local');
const userRoutes = require('./routes/users');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    // .then(() => console.log("Mongoose Connected"))
    .catch(err => console.log(`err`, err))

const app = express();

app.engine('ejs', ejsMate);

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', 1);

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log('----*************----------')
    // console.log('TIME: ', new Date().toDateString());
    console.log(`${req.method} to ${req.url}`);
    // console.log(`req.session.returnTo`, req.session.returnTo);
    res.locals.path = req.path;
    res.locals.user = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', userRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/campgrounds', campgroundRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', (req, res, next) => {
    next(new AppError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = "Oops something went wrong!";
    // console.dir(err)
    err.message = `FROM ${err.location}: ${err.message}`
    res.status(status).render('errorPage', { err });
});

app.listen(3000, () => {
    console.log('serving on port 3000');
});
