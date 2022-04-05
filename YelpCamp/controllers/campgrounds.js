const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.createNewCampground = async (req, res) => {
    // if(!req.body.campground) throw new ExpressError("Niepoprwane informacje", 400)
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id; //req.user jest automatycznie dokladane przez passporta
    await campground.save();
    req.flash('success', 'Sucessfuly made a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => { //wycialem isLoggedIn tymczasowo
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) { //error handling kiedy podziemy do jakieogs ID ktore juz nie istnieje 
        req.flash('error', "Cannot find that campground");
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) { //error handling kiedy podziemy do jakieogs ID ktore juz nie istnieje 
        req.flash('error', "Cannot find that campground");
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
};

module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground }); //uzycie spreadu doczytac jak to wygladalo
    req.flash('success', 'Sucessfuly updated a campground');
    res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campgrund deleted');
    res.redirect('/campgrounds')
};