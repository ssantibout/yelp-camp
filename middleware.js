const Campground = require('./models/campground');
const AppError = require('./utils/appError');
const { campgroundJoi, reviewJoi } = require('./models/joiCampground');
const Review = require('./models/review');

const isLoggedIn = (req, res, next) => {
    // console.log('we are in isLoggedIn')
    req.session.returnTo = req.originalUrl;
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in.');
        return res.redirect('/login');
    }
    // console.log('logged in confirmed')
    next();
};

const isAuthorized = async (req, res, next) => {
    // console.log('we are isAuthorized');
    const { id } = req.params;
    let campground = await Campground.findOne({ _id: id });
    // console.log('campground: ', campground)
    if (!campground.author._id.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to perform this action.')
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

const validateCampground = async (req, res, next) => {
    let { title, image, price, description, location } = req.body.campground;
    // console.log(`req.body`, req.body)
    try {
        if (!price) price = req.body.campground.price = 0;
        price = Number(price);
        if (price % 1 === 0) {
            req.body.campground.price = price.toFixed(2);
        }
        // console.log('BEFORE')
        await campgroundJoi.validateAsync({ title, image, price, description, location })
        // console.log("AFTER")
        next()
    } catch (e) {
        next(new AppError(500, e, "Joi"))
    }
}

const validateReview = async (req, res, next) => {
    const reviewOb = { body: req.body.review.body, rating: req.body.rating }
    const { error } = reviewJoi.validate(reviewOb);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        req.flash('error', msg);
        // next(new AppError(400, msg, 'reviewJoi Error'));
        res.redirect(`/campgrounds/${req.params.id}`)
    } else {
        next()
    }
}

const isReviewAuthor = async (req, res, next) => {
    // console.log('we are in isReviewAuthor')
    const { id, reviewId } = req.params;
    try {
        const review = await Review.findById(reviewId);
        if (review.author._id.toString() !== req.user._id.toString()) {
            // console.log('isReviewAuthor = false')
            // return next(new AppError(403, 'You are not authorized to modify this review.'));
            req.flash("error", "You are unauthorized to delete this review.")
            res.redirect(`/campgrounds/${id}`);
        }
        // console.log('isReviewAuthor = true')
        next()
    } catch (e) {
        // console.log('we are in catch of isReviewAuthor')
        // console.log(e)
        next(new AppError(404, e, 'In Catch isReviewAuthor'));
    }
}
module.exports = { isLoggedIn, isAuthorized, validateCampground, validateReview, isReviewAuthor }