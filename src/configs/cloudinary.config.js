'use strict'

// Require the cloudinary library
const cloudinary = require('cloudinary').v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
    cloud_name: 'shoplam',
    api_key: '669422866334237',
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Log the configuration
// console.log(cloudinary.config());

module.exports = cloudinary