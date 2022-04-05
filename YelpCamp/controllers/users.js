const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
};

module.exports.registerUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            } else {
                req.flash('success', `Welcome to yelp camp ${username}`);
                res.redirect('/campgrounds');
            }
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
};

//ale tak na prawde to passport zalatwia sprawe logowania juz wczesniej
module.exports.login = async (req, res) => {
    req.flash('success', "welcome back");
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

//W przypadku zmiany jezyka bledow sprawdzi: 
//\node_modules\passport-local-mongoose\index.js

module.exports.logout =  (req, res) => {
    req.logOut();
    req.flash('success', "Goodbye")
    res.redirect('/campgrounds')
};