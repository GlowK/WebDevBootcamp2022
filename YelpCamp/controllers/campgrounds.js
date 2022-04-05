const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary/index')

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
    // poprzez dodanie wczesniejszego middleware upload mamy dostep do req.files
    // teraz mozemy wyciagnac z niego informacje na temat wrzuconych zdjec
    campground.images = req.files.map(file => ({url: file.path, filename: file.filename}));
    campground.author = req.user._id; //req.user jest automatycznie dokladane przez passporta
    await campground.save();
    // console.log(campground);
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
    // console.log(req.body);
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground }); //uzycie spreadu doczytac jak to wygladalo
    const imgs = req.files.map(file => ({url: file.path, filename: file.filename}));
    camp.images.push(...imgs); // spread, tablica zapisana wcesniej, rozbijamy na pojedycnze obiekty i pushujemy
    
    //kawalek odpowiedzialny za kasowanie obrazkow z wczesniej przeslanej tablicy deleteImages w req.body
    if(req.body.deleteImages){
        //Usuwanie lementow z cloudinary
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        //uswanie linkow z mongo
        await camp.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
        // console.log(camp);
    }
    
    await camp.save();
    req.flash('success', 'Sucessfuly updated a campground');
    res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campgrund deleted');
    res.redirect('/campgrounds')
};