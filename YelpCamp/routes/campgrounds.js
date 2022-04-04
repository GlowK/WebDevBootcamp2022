const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const {campgroundSchema} = require('../schemas')

//***********************
//Middleware
//***********************

const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',') 
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

//***********************
//Routes
//***********************

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});

router.post('/', validateCampground, catchAsync(async (req, res) => {
    // if(!req.body.campground) throw new ExpressError("Niepoprwane informacje", 400)
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Sucessfuly made a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
}))


router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if(!campground){ //error handling kiedy podziemy do jakieogs ID ktore juz nie istnieje 
        req.flash('error', "Cannot find that campground");
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground){ //error handling kiedy podziemy do jakieogs ID ktore juz nie istnieje 
        req.flash('error', "Cannot find that campground");
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
}))

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }); //uzycie spreadu doczytac jak to wygladalo
    req.flash('success', 'Sucessfuly updated a campground');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campgrund deleted');
    res.redirect('/campgrounds')
}))

//***********************
//Export
//***********************

module.exports = router;