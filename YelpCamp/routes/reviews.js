const express = require('express');
const router = express.Router({mergeParams: true}); //mergeParams po to by miec dostep do prametrow :id
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const Review = require('../models/review');
const Campground = require('../models/campground');
const reviewsController = require('../controllers/reviews');

//***********************
//Routes
//***********************

router.post('/', isLoggedIn, validateReview, catchAsync(reviewsController.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewsController.deleteReview));

//***********************
//Export
//***********************

module.exports = router;