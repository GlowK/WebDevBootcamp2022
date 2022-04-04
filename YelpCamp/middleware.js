const { campgroundSchema, reviewSchema } = require('./schemas')
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');


//***********************
//Middleware from User
//***********************
// Tylko do bronienia sie przed dodawaniem elementow np przez postman
const isLoggedIn = (req, res, next) => {
    // console.log(req.user);
    if(!req.isAuthenticated()){
        // console.log(req.path, req.originalUrl);
        // req.session.returnTo = req.originalUrl; //dodajemy dodatkowy atrybut returnTo do sesji, niepotrzebne powoduje problemy, rozwiazane w app.js
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
};

//***********************
//Middleware from Campgrounds
//***********************

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

const isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', "You dont have permission to do that");
        res.redirect(`/campgrounds/${id}`);
    } else {
        next();
    }
}

//***********************
//Middleware from Reviews
//***********************

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',') 
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', "You dont have permission to do that");
        res.redirect(`/campgrounds/${id}`);
    } else {
        next();
    }
}



module.exports.isLoggedIn = isLoggedIn;
module.exports.validateCampground = validateCampground;
module.exports.isAuthor = isAuthor;
module.exports.validateReview = validateReview;
module.exports.isReviewAuthor = isReviewAuthor;