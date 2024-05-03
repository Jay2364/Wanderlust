const Listing = require('../models/listing.js')

module.exports.getIndex = async (req,res) => {
    console.log(req.user);
    let allListings = await Listing.find();
    res.render('listings/index.ejs',{allListings});
}

module.exports.renderNewForm = (req,res) => {
    res.render('listings/new.ejs');
}

module.exports.showListing = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    // populate reviews, owner from DB
    .populate({
        path: 'reviews', 
        populate: {path: 'author'},
    })
    .populate('owner');
    if (!listing){
        req.flash('error','Listing you requested for does not exist!')
        res.redirect('/listings');
    }
    res.render('listings/show.ejs', {listing});
}

module.exports.postNewListing = async (req,res,next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();

    req.flash('success','registered');
    res.redirect('/listings');
}

module.exports.renderUpdate = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (!listing){
        req.flash('error','Listing you requested for does not exist!')
        res.redirect('/listings');
    }

    let originalUrl = listing.image.url;
    originalUrl = originalUrl.replace("/upload","/upload/h_250,w_300")

    res.render('listings/edit.ejs',{listing, originalUrl});
}

module.exports.putUpdate = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing})

    if (typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        listing.save();
    }
    req.flash('edited','Updation done.')
    return res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req,res) => {
    let {id} = req.params;
    let deleted = await Listing.findByIdAndDelete(id);

    req.flash('delete',"Listing deleted successfully.");
    res.redirect('/listings');
}