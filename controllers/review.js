const Review = require('../models/review.js');
const Listing = require('../models/listing.js');

module.exports.postReview = async (req,res) => {
    let listing = await Listing.findById(req.params.id);

    // review to Review DB
    const newReview = new Review(req.body.review);
    // review to Listing DB
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("added","Successfully added a review!");
    res.redirect(`/listings/${listing._id}`)
}

module.exports.deleteReview = async (req,res) => {
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});    
    await Review.findByIdAndDelete(reviewId);

    req.flash("delete-review","Successfully deleted a review!");
    res.redirect(`/listings/${id}`)
}