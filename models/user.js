const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
    }
});

// this will implement:
// username, hashing, salting, and hashed password
// we don't need to build these from scratch.
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);