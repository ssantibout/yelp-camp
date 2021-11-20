const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

module.exports.register = catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        console.log(`registeredUser`, registeredUser)
        req.login(registeredUser, err => {
            if (err) return next(err)

            req.flash('success', 'Welcome to Yelp-Camp!');
            res.redirect('/campgrounds');
        })

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
});

module.exports.login = (req, res) => {
    console.log('this route hit')
    let redirectUrl = req.session.returnTo || '/campgrounds';
    console.log(`redirectUrl`, redirectUrl)
    delete req.session.returnTo;
    req.flash('success', "Welcome back!");
    res.redirect(redirectUrl);
};

module.exports.renderLoginPage = (req, res) => {
    res.render('users/login');
};

module.exports.renderRegisterPage = (req, res) => {
    res.render('users/register')
};

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Successfully loged out.')
    res.redirect('/campgrounds');
};