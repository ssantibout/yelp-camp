const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');

module.exports.getAll = catchAsync(async (req, res, next) => {
    let campgrounds = await Campground.find().populate('images');
    res.render('campgrounds/index', { campgrounds });
});

module.exports.getById = catchAsync(async (req, res) => {
    const { id } = req.params;
    let campground = await Campground
        .findOne({ _id: id })
        .populate('author')
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        });
    res.render('campgrounds/show', { campground });
});

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.renderEditForm = catchAsync(async (req, res) => {
    const { id } = req.params;
    let campground = await Campground.findOne({ _id: id });
    if (!campground) {
        req.flash('error', 'Sorry... We could not find that campground.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
});

module.exports.edit = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { title, image, price, location, description } = req.body.campground;
    const campground = await Campground.findOne({ _id: id });
    campground.title = title;
    campground.image = image;
    campground.price = price;
    campground.location = location;
    campground.description = description;
    campground.save();
    req.flash('success', 'Successfully updated campground.');
    res.redirect('/campgrounds');
});

module.exports.create = catchAsync(async (req, res) => {
    const newCampground = new Campground(req.body.campground);
    newCampground.images = req.files.map(f => ({ url: f.path, filename: f.file }));
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success', 'Successfully created a new campground.');
    res.redirect('/campgrounds');
});

module.exports.delete = catchAsync(async (req, res) => {
    const { id } = req.params;
    let campground = await Campground.findOne({ _id: id }).populate('author');
    campground.delete();
    req.flash('success', 'Successfully deleted campground.')
    res.redirect(`/campgrounds`);
})