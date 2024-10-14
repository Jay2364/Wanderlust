// 2 phases: development, production(Deployment)
// we use env in dev phase.
// NEVER UPLOAD these ENV files in production phase. As is contains our credentials
if (process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
console.log(process.env.KEY)

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 9090;
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

const listingRouter = require('./routes/listing.js')
const reviewRouter = require('./routes/review.js')
const userRouter = require('./routes/user.js')

// views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// delete/put
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// js/css
app.use(express.static(path.join(__dirname, 'public')));

// boilerplate
app.engine('ejs',ejsMate);

// mongoDB connection
const dbUrl = process.env.ATLASDB_URL;
main()
    .then(() => {
        console.log("Connected to mongoDB");
    })
    .catch((err) => {
        console.log(err);
    });
async function main(){
    await mongoose.connect(dbUrl);
}

app.listen(PORT, () => 
    console.log(`Server started on port ${PORT}`
));

// --------------- sessions ------------------
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get('/',(req,res) => {
//     let fakeUser = new User({
//         email: "Hin@gmail.com",
//         username: "Jiavani",
//     })
//     User.register(fakeUser,"Password");
// })

app.use((req,res,next) => {
    res.locals.success = req.flash('success');
    res.locals.deleted = req.flash('delete');
    res.locals.added = req.flash('added');
    res.locals.delete_review = req.flash('delete-review');
    res.locals.edited = req.flash('edited');
    res.locals.error = req.flash('error');
    res.locals.signup = req.flash('signup')
    res.locals.signuperr = req.flash('err')
    res.locals.login = req.flash('login')

    // for login check
    res.locals.currUser = req.user;

    next();
})

// ------------- listing route --------------
app.use('/listings',listingRouter);
// ------------- Reviews route --------------
app.use('/listings/:id/reviews/',reviewRouter);
// ------------- Users route --------------
app.use('/',userRouter);


// -------------- error handling middleware ------------
app.all('*', (req,res,next) => {
    next(new ExpressError(404, "Page not found"));
})

app.use((err,req,res,next) =>{
    let {statusCode=500, message="Default error message"} = err;
    // res.status(statusCode).send(message);
    res.render('error.ejs',{message});
})