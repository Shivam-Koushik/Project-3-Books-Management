const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const newBook = new mongoose.Schema( {
    name: String,
    author_id: {
        type: ObjectId,
        ref: "Author"
    },
    publisher_id: {
        type: ObjectId,
        ref: "Publisher"
    },
    isHardCover:{
        type : Boolean,
        default:false
    },
    price: Number,
    ratings: Number


}, { timestamps: true });


module.exports = mongoose.model('LibraryBook', newBook)
