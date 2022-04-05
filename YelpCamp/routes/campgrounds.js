const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const campgroundController = require('../controllers/campgrounds');
// const { campgroundSchema } = require('../schemas')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');


//***********************
//Storowanie zdjec z formularza + cloudinary
//***********************
const multer = require('multer');
const {storage} = require('../cloudinary/'); //moze tez byec bez index, require bedzie automatycznie szukac index.js jesli nie wskazane inaczej
const upload = multer({storage});



//***********************
//Routes (w inny sposob z https://expressjs.com/en/guide/routing.html )
//***********************

router.route('/')
    .get(catchAsync(campgroundController.index))
    .post(isLoggedIn, upload.array('image'), validateCampground ,catchAsync( campgroundController.createNewCampground));
    

router.get('/new', isLoggedIn, campgroundController.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgroundController.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgroundController.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgroundController.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundController.renderEditForm));


//***********************
//Export
//***********************

module.exports = router;