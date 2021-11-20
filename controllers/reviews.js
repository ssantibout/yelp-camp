const { reviewJoi } = require('../models/joiCampground');
const Campground = require('../models/campground');
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

module.exports.delete = catchAsync(async (req, res) => {
    // console.log('we are in here in delete')
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Campground.findOneAndUpdate(
        { _id: id },
        { $pull: { reviews: reviewId } }
    )
    req.flash('success', 'Successfully deleted review.')
    res.redirect(`/campgrounds/${id}`)
});

module.exports.post = catchAsync(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { body } = req.body.review;
        const { rating } = req.body;
        const review = new Review({ body, rating, author: req.user })
        const campground = await Campground.findOne({ _id: id });
        campground.reviews.push((review));
        await review.save();
        await campground.save();
        req.flash('success', 'Your review has been saved.');
        res.redirect(`/campgrounds/${id}`)
    } catch (e) {
        next(new AppError(404, e.message))
    }
});