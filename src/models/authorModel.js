const mongoose = require('mongoose');

const newAuthor = new mongoose.Schema( {
    author_name: String,
    age:Number,
    address:String

}, { timestamps: true });

module.exports = mongoose.model('Author', newAuthor)
