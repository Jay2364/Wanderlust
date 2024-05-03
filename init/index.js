const mongoose = require('mongoose');
const initData = require('./data.js'); // Check the path to data.js
const Listing = require('../models/listing.js'); // Check the path to Listing model

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main()
    .then(() => {
        console.log("Connected to MongoDB");
        initDB();
    })
    .catch((err) => {
        console.log("Error connecting to MongoDB:", err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

// to insert data initially
const initDB = async () => {
    try {
        await Listing.deleteMany({});
        // initial data's owner. Not in schema
        initData.data = initData.data.map((obj) => ({
            ...obj,
            owner: "6603d2511b20db66d86f2aec",
        }))
        await Listing.insertMany(initData.data);
        console.log("Data inserted");
    } catch (error) {
        console.error("Error initializing database:", error);
    }
}




