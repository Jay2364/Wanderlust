// index.ejs: get
// new.ejs: get, post
// show.ejs: get
// edit.ejs: get, put
// delete
const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const {listingSchema, reviewSchema} = require('../schema.js');
const ExpressError = require('../utils/ExpressError.js');
const Listing = require('../models/listing.js');
const {isLoggedIn, isOwner, validateListing} = require('../middleware.js')
// image
const multer = require('multer')
const {storage} = require('../cloudConfig.js')
// const upload = multer({dest: 'uploads/'})
const upload = multer({storage})

const listingController = require('../controllers/listing.js')

// Router.route()
router
    .route('/')
    .get(wrapAsync(listingController.getIndex))
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.postNewListing));

// create new route
router.get('/new', isLoggedIn, listingController.renderNewForm)

// always keep id route below, as it will search other routes in DB as id
router
    .route('/:id')
    .get(wrapAsync(listingController.showListing)) // show a listing
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.putUpdate)) // update listing
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing)) // delete

// update route
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.renderUpdate))


module.exports = router;