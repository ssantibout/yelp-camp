const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const CampgroundSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Schema.Types.Decimal128,
        default: 0
    },
    description: String,
    location: {
        type: String,
        required: true
    },
    images: [
        {
            url: String,
            filename: String
        }
    ],
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

CampgroundSchema.post("remove", async function (doc) {
    if (doc) {
        await Review.remove({ _id: { $in: doc.reviews } })
    }
})

module.exports = mongoose.model("Campground", CampgroundSchema);