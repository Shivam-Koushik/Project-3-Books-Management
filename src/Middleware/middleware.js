const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel")


const Authenticate = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) return res.status(400).send({ status: false, msg: "token must be present in the request header" });
        let decodedToken = jwt.verify(token, "Room-8-Radon");
        if (!decodedToken) return res.status(401).send({ status: false, msg: "token is not valid" });
        req.authIdNew = decodedToken.authorId      //attribute
        next()
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}


const Authorisation = async function (req, res, next) {
    try {
        let userLoggedIn = req.authIdNew
        let blogId = req.params.blogId
        if (blogId) {
            //blog update or delete 
            if (blogId.length != 24) return res.status(400).send({ status: false, msg: 'Please enter valid ID' })
            let authId = await blogModel.findOne({ _id: blogId }).select({ authorId: 1, _id: 0 })
            if(!authId) return res.status(400).send({ status: false, msg: 'Please enter valid blog ID' })
            let newAuth = authId.authorId.valueOf()
            if (newAuth != userLoggedIn) return res.status(403).send({ status: false, msg: 'User logged is not allowed to modify the requested users data' })
        }
        else {
            // blog creation
            let requestUser = req.body.authorId
            if(!requestUser) return res.status(400).send({ status: false, msg: 'Please enter details for creation' })
            if(requestUser.length !=24) return res.status(400).send({ status: false, msg: 'Please enter valid ID' })
            if (requestUser != userLoggedIn) return res.status(403).send({ status: false, msg: 'User logged is not allowed to modify the requested users data' })
        }
        next()
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports.Authorisation = Authorisation
module.exports.Authenticate = Authenticate
