const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
// const ExpressError = require('../utils/ExpressError');
const User = require('../models/user');
const passport = require('passport');
const usersController = require('../controllers/users');


//***********************
//Routes (w inny sposob z https://expressjs.com/en/guide/routing.html )
//***********************

router.route('/register')
    .get(usersController.renderRegisterForm)
    .post(catchAsync(usersController.registerUser));

router.get('/login', usersController.renderLoginForm);

// ++ middleware z passporta odpowiedzialny za uwiezytelnienie
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), usersController.login);

router.get('/logout', usersController.logout);

//***********************
//Export
//***********************

module.exports = router;