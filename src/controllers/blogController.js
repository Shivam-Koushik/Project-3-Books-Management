const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken");
let strRegex = /^\w[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/


const isValid = function (x) {
    if (typeof x === 'undefined' || x === null) return false
    if (typeof x === 'string' && x.trim().length === 0) return false
    if (x.authorId && x.authorId.length == 24) return false
    return true
}
const isValidBody = function (y) {
    return Object.keys(y).length > 0
}

const createBlog = async function (req, res) {
    try {
        let body = req.body

        if (!body.title || !strRegex.test(body.title)) return res.status(400).send({ status: false, msg: "title is must in the valid formate" })

        if (!body.body) return res.status(400).send({ status: false, msg: "body is must in the valid formate" })

        if (!body.authorId || ! await authorModel.findById({ _id: body.authorId })) { return res.status(404).send({ status: false, msg: " authorId is must in the valid formate" }) }

        if (!body.category || typeof (body.category) != 'string') return res.status(400).send({ status: false, msg: "category is must in the valid formate" })

        let blogCreated = await blogModel.create(body)

        return res.status(201).send({ status: true, data: blogCreated })

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}



const filterBlogs = async function (req, res) {
    try {

        let query = req.query

        if (!query) {
            let allBlog = await blogModel.find({ isDeleted: false, isPublished: true })
            if (allBlog.length == 0) return res.status(400).send({ status: "false", msg: "Blog Not Found" })
            return res.status(200).send({ status: true, msg: allBlog })
        }
        let getAllBlog = await blogModel.find({ $and: [{ isDeleted: false }, { isPublished: true }], $or: [query] })

        if (getAllBlog.length == 0) return res.status(400).send({ status: "false", msg: "Blog Not Found" })

        return res.status(200).send({ status: true, msg: getAllBlog })

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

}



const updateBlog = async function (req, res) {
    try {
        let id = req.params.blogId;
        let data = req.body
        if (!isValidBody(data)) return res.status(400).send({ status: false, msg: "Please enter details for updation" })
        if(!strRegex.test(data.title) || !strRegex.test(data.body)) return res.status(400).send({ status: false, msg: "Please Enter valid details for updation" })
        let user = await blogModel.findById({ _id: id }).select({ tags: 1, subCategory: 1,isDeleted:1, _id: 0 });
        if (user.isDeleted === true) return res.status(400).send({ status: false, err: "user is not present" })

        if (data.tags) data.tags.push(...user.tags)
        if (data.subCategory) data.subCategory.push(...user.subCategory)
        data[`isPublished`] = true
        data[`publishedAt`] = new Date();
    
        let newData = await blogModel.findByIdAndUpdate({ _id: id }, data, { new: true })
        return res.status(200).send({ status: true, msg: newData })
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

}



const deleteBlogs = async function (req, res) {
    try {
        let id = req.params.blogId;

        let user = await blogModel.findById({ _id: id });
        if (!user) {
            return res.status(400).send({ status: false, msg: "No such user exists" });
        }
        if (user.isDeleted === true) {
            return res.status(400).send({ status: false, err: "user is not present" })
        }
        await blogModel.findByIdAndUpdate({ _id: id }, { isDeleted: true }, { new: true })
        return res.status(200).send();
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}




const deleteByQuery = async function (req, res) {
    try {
        let queryParam = req.query
        if (!isValidBody(queryParam)) return res.status(400).send({ status: false, msg: "Please enter details." })

        if (isValid(queryParam)) return res.status(400).send({ status: false, msg: " Details not match" })
        let data = await blogModel.updateMany({ $and: [queryParam, { isDeleted: false }] }, { $set: { isDeleted: true } }, { new: true })
        if (data.modifiedCount == 0) return res.status(400).send({ status: false, msg: "Not valid for deletion" })
        return res.status(200).send({ data: data })

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

}


const login = async function (req, res) {
    try {
        let body = req.body

        if (Object.keys(body).length === 0) return res.status(400).send({ status: false, msg: "Please enter details." })

        if (!body.email) return res.status(400).send({ status: false, msg: "Please enter emial" })

        if (!body.password) return res.status(400).send({ status: false, msg: "please enter password" })

        let author = await authorModel.findOne({ email: body.email, password: body.password });
        if (!author) return res.status(401).send({ status: false, msg: "userEmail or the password is not corerct" });

        let token = jwt.sign(
            {
                authorId: author._id.toString(),
                authorEmail: author.email,
                authorPassword: author.password
            },
            "Room-8-Radon"
        );
        res.status(200).setHeader("x-api-key", token);
        res.status(200).send({ status: true, data: token });

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}


module.exports.createBlog = createBlog
module.exports.filterBlogs = filterBlogs
module.exports.updateBlog = updateBlog
module.exports.deleteBlogs = deleteBlogs
module.exports.deleteByQuery = deleteByQuery
module.exports.login = login
