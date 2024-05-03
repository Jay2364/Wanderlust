// login: get,post
// signup: get,post
// logout: get
const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { savedRedirectUrl } = require('../middleware.js');
const { getSignup, postLogin } = require('../controllers/user.js');

const userController = require('../controllers/user.js')

router
    .route('/signup')
    .get(userController.getSignup)
    .post(wrapAsync(userController.postSignup))

router
    .route('/login')
    .get(userController.getLogin)
    .post(
        savedRedirectUrl, 
        passport.authenticate('local',
        {failureRedirect: '/login',
        failureFlash: true}),
        userController.postLogin
    )

router.get('/logout',userController.getLogout)

module.exports = router;