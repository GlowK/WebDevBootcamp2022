const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const {campgroundSchema} = require('./schemas')
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const { redirect } = require('express/lib/response');

const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { error } = require('console');

mongoose.connect('mongodb://localhost:27017/yelp-camp');


const db = mongoose.connection; //skrocenie zapisu zeby nie pisac mongoose.connection caly czas
db.on("error", console.error.bind(
    console, "connection error:"
));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true })) // linia pozwaljaca na parsowanie danych ze strony do req.body
app.use(methodOverride('_method'));

const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',') 
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

app.get('/', (req, res) => {
    res.send("Hello from YelpCamp")
});

app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

app.post('/campgrounds', validateCampground, catchAsync(async (req, res) => {
    // if(!req.body.campground) throw new ExpressError("Niepoprwane informacje", 400)
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))


app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
}));

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }); //uzycie spreadu doczytac jak to wygladalo
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
}))

//404
app.all('*', (req, res, next) => {
    next( new ExpressError("Nie ma takiej strony", 404))
})


//ErrorHanling
app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Oh nol zesralos sie"
    res.status(statusCode).render('error', {err});
})

app.listen(3000, () => {
    console.log("Serving localhost:3000")
});