const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const passportLocalStrategy = require('passport-local');
const User = require('./models/user');

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

const { date } = require('joi');



//***********************
//MOngoose and MongoDB
//***********************
mongoose.connect('mongodb://localhost:27017/yelp-camp');


const db = mongoose.connection; //skrocenie zapisu zeby nie pisac mongoose.connection caly czas
db.on("error", console.error.bind(
    console, "connection error:"
));
db.once("open", () => {
    console.log("Database connected");
});

//***********************
//Express, EJS, paths
//***********************
const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true })) // linia pozwaljaca na parsowanie danych ze strony do req.body
app.use(methodOverride('_method')); //string pozwalajacy na nadpisania POST/PUT na DELETE itp
app.use(express.static(path.join(__dirname, 'public'))); //przestawienie skryptow, stylesheetow na folder public

//***********************
//Sessions 
//***********************
const sessionConfig = {
    secret: "thisshoudbeabettersecret!",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 *24 * 7, // Miliseconds * seconds  *  minute * hours * days (i uplywa tydzien lol)
        maxAge: 1000 * 60 * 60 *24 * 7,
        httpOnly: true
    }
}
app.use(session(sessionConfig))

//***********************
//Authentication
//***********************
app.use(passport.initialize());
app.use(passport.session()); //musi byc po uzycciu session*

passport.use(new passportLocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//***********************
//flash + Middleware dla flasha + sprawdzenie zalogowania
//***********************
app.use(flash());

app.use((req, res, next) => {
    // console.log(req.session);
    // Przekorowywania z miejsca loginu
    if(!['/login', '/', '/register'].includes(req.originalUrl)){
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user; // req.user pochodzi z passposta
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


//***********************
//Routes w innych plikach
//***********************
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.send("Hello from YelpCamp")
});

//***********************
//404
//***********************
app.all('*', (req, res, next) => {
    next( new ExpressError("Nie ma takiej strony", 404))
})

//***********************
//ErrorHanling
//***********************

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Oh nol zesralos sie"
    res.status(statusCode).render('error', {err});
})

//***********************
//Odpalenie aplikacji
//***********************

app.listen(3000, () => {
    console.log("Serving localhost:3000")
});