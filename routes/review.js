// post
// delete
const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {reviewSchema} = require('../schema.js');
const Review = require('../models/review.js');
const {isLoggedIn, validateReview, isAuthor} = require('../middleware.js');
const { wrap } = require('module');
const { deleteReview } = require('../controllers/review.js');
const Listing = require('../models/listing.js');

const reviewController = require('../controllers/review.js')

// create review
router.post('/',isLoggedIn, validateReview, wrapAsync(reviewController.postReview))

// delete review
router.delete('/:reviewId', isLoggedIn, isAuthor, wrapAsync(reviewController.deleteReview))

module.exports = router;