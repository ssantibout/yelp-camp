const express = require('express');
const router = express.Router({ mergeParams: true });
const { isLoggedIn, isReviewAuthor, validateReview } = require('../middleware');
const reviewsController = require('../controllers/reviews');

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, reviewsController.delete);

router.post('/', isLoggedIn, validateReview, reviewsController.post);

module.exports = router;