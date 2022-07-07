const jwt = require("jsonwebtoken");
const bookModel = require("../models/bookModel")
const mongoose = require('mongoose');
// const userModel = require("../models/userModel");
// const Validator = require("../Validator/validation");


const Authenticate = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) return res.status(401).send({ status: false, msg: "token must be present in the request header" });
        jwt.verify(token, "project_3",function(err,decodedToken){
            if(err)  return res.status(401).send({ status: false, msg: "token is not valid" });
            req.newUser = decodedToken.userId 
        });
        next()
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}


const Authorisation = async function (req, res, next) {
    try {
        let userLoggedIn = req.newUser
        let bookId = req.params.bookId
        if (bookId) {
            // book update or delete 
            let isValid = mongoose.Types.ObjectId.isValid(bookId)
            if (!isValid) return res.status(400).send({ status: false, message: "bookId is not valid" })
            let userId = await bookModel.findOne({ _id: bookId }).select({ userId: 1, _id: 0 })
            if(!userId) return res.status(400).send({ status: false, msg: 'Please enter valid book ID' })
            let newAuth = userId.userId.valueOf()
            if (newAuth != userLoggedIn) return res.status(403).send({ status: false, msg: 'User logged is not allowed to modify the requested users data' })
        }
        else {
            // book creation
            let requestUser = req.body.userId
            let isValid = mongoose.Types.ObjectId.isValid(requestUser)
            if (!isValid) return res.status(400).send({ status: false, message: "bookId is not valid" })
            if (requestUser != userLoggedIn) return res.status(403).send({ status: false, msg: 'User logged is not allowed to modify the requested users data' })
        }
        next()
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports.Authorisation = Authorisation
module.exports.Authenticate = Authenticate
