const User = require('../models/user.js');

module.exports.getSignup = (req,res) => {
    res.render('users/signup.ejs');
}

module.exports.postSignup = async (req,res) => {
    try{
        let {username, email, password} = req.body;
        const fakeUser = new User({email,username});
        await User.register(fakeUser,password);
        req.login(fakeUser, (err) => {
            if (err){
                return next(err);
            }
            req.flash("signup","Welcome to Wanderlust");
            res.redirect('/listings');
        });
    }
    catch(err){
        req.flash('err',err.message);
        res.redirect('/signup');
    }
}

module.exports.getLogin = (req,res) => {
    res.render('users/login.ejs');
}

module.exports.postLogin = async (req,res) => {
    req.flash('login',"Welcome back");
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
}

module.exports.getLogout =  (req,res,next) => {
    req.logout((err) => {
        if (err){
            return next(err);
        }
        req.flash('success',"You are logged out successfully");
        res.redirect('/listings');
    })
}