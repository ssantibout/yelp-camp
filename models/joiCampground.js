const Joi = require('joi');

const campgroundJoi = Joi.object({
    title: Joi.string()
        .trim()
        .min(4)
        .required(),
    location: Joi.string()
        .required(),
    price: Joi.number(),
    image: Joi.string(),
    description: Joi.string()
});

const reviewJoi = Joi.object({
    rating: Joi.number()
        .min(1)
        .required(),
    body: Joi.string()
        .required()
        .min(5)
})

module.exports = { campgroundJoi, reviewJoi }