const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema( {
    fname: { type: String ,required:true},
    lname: {type:String , required: true}, 
    title: {type:String , required:true, enum:[ "Mr", "Mrs", "Miss"]}, 
    email: {type:String , unique:true }, 
    password: {type:String , required:true} 

}, { timestamps: true });

module.exports = mongoose.model('Author', AuthorSchema )


// password Regex validation
// At least one upper case English letter, (?=.*?[A-Z])
// At least one lower case English letter, (?=.*?[a-z])
// At least one digit, (?=.*?[0-9])
// At least one special character, (?=.*?[#?!@$%^&*-])
// Minimum eight in length .{8,} (with the anchors)