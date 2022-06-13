const authorModel = require("../models/authorModel")
const bookModel = require("../models/bookModel")
const publisherModel = require("../models/publisherModel")

const createBook = async function (req, res) {
    let body = req.body
    if (body.author_id) {
        if (body.publisher_id) {
            if (await authorModel.findOne({ _id: body.author_id })) {
                if (await publisherModel.findOne({ _id: body.publisher_id })) {
                    let bookCreated = await bookModel.create(body)
                    res.send({ bookCreated })
                } else {
                    res.send("Publisher is not present")
                }
            } else {
                res.send("author is not present")
            }
        } else {
            res.send("Valid detail is required")
        }
    } else {
        res.send("Valid detail is required")
    }
}

const getBooksData = async function (req, res) {
    let books = await bookModel.find()
    res.send({ data: books })
}

const getBooksWithAuthorDetails = async function (req, res) {
    let specificBook = await bookModel.find().populate('author_id')
    res.send({ data: specificBook })
}

const getBooksWithPublisharDetails = async function (req, res) {
    let specificBook = await bookModel.find().populate('publisher_id')
    res.send({ data: specificBook })
}

const getBooksWithPublisharAndAuthorDetails = async function (req, res) {
    let specificBook = await bookModel.find().populate('author_id').populate('publisher_id')
    res.send({ data: specificBook })
}

const updateBooleanKey = async function (req, res) {
    let publisherId = await publisherModel.find({ name: "Penguin" }).select("_id")
    let book = await bookModel.find({ publisher_id: publisherId }).update({ $set: { isHardCover: true } })
    res.send({ data:book })
}
const updatePrice= async function (req, res) {
    let authorId = await authorModel.find({ rating:{$gt:3.5} }).select({_id:1})
    let book = await bookModel.updateMany({ author_id:authorId }, { $inc: { price:10 } },{new:true})
    res.send({ data:book })
}

module.exports.createBook = createBook
module.exports.getBooksData = getBooksData
module.exports.getBooksWithAuthorDetails = getBooksWithAuthorDetails
module.exports.getBooksWithPublisharDetails = getBooksWithPublisharDetails
module.exports.getBooksWithPublisharAndAuthorDetails = getBooksWithPublisharAndAuthorDetails
module.exports.updateBooleanKey = updateBooleanKey
module.exports.updatePrice = updatePrice