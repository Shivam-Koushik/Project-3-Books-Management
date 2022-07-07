const bookModel = require("../models/bookModel")
const ObjectId = require('mongoose').Types.ObjectId;
const Validator = require("../Validator/validation")

const userModel = require("../models/userModel.js")
const postBooks = async function (req, res) {
  try {
    let data = req.body
    const { title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt } = data


    if (!Validator.isValidBody(data)) return res.status(400).send({ status: false, message: "Please enter details" })

    if (!title) return res.status(400).send({ status: false, message: "please enter title" })
    if (!Validator.isValid(title)) return res.status(400).send({ status: false, message: "Provide valid title" })
    const dup = await bookModel.findOne({ title: title })
    if (dup) return res.status(400).send({ status: false, message: "title already exist" })

    if (!excerpt) return res.status(400).send({ status: false, message: "please enter excerpt" })
    if (Validator.isValid(excerpt)) return res.status(400).send({ status: false, message: "Provide valid excerpt" })

    if (!userId) return res.status(400).send({ status: false, message: "please enter userId" })
    if (!ObjectId.isValid(userId)) return res.status(400).send({ status: false, message: "please enter valid userId" })

    if (!ISBN) return res.status(400).send({ status: false, message: "please enter ISBN" })
    if (ISBN.length !== 13) return res.status(400).send({ status: false, message: "Provide valid ISBN" })
    const dupISBN = await bookModel.findOne({ ISBN: ISBN })
    if (dupISBN) return res.status(400).send({ status: false, message: "ISBN already exist" })

    if (!category) return res.status(400).send({ status: false, message: "please enter category" })
    if (!Validator.isValid(category)) return res.status(400).send({ status: false, message: "Provide valid category" })

    if (!subcategory) return res.status(400).send({ status: false, message: "please enter subcategory" })
    if (subcategory.length == 0) return res.status(400).send({ status: false, message: "please enter atleast one subcategory" })
    if (subcategory == 0) return res.status(400).send({ status: false, message: "please enter atleast String one subcategory" })

    if (reviews) {
      if (typeof reviews === 'string') return res.status(400).send({ status: false, message: "Provide valid reviews" })
    }

    if (!releasedAt) return res.status(400).send({ status: false, message: "please enter date of release" })
    let dateFormatRegex = /^([0-9]{4}[-/]?((0[13-9]|1[012])[-/]?(0[1-9]|[12][0-9]|30)|(0[13578]|1[02])[-/]?31|02[-/]?(0[1-9]|1[0-9]|2[0-8]))|([0-9]{2}(([2468][048]|[02468][48])|[13579][26])|([13579][26]|[02468][048]|0[0-9]|1[0-6])00)[-/]?02[-/]?29)$/
    if (!dateFormatRegex.test(releasedAt)) return res.status(400).send({ status: false, message: " wrong date format" })

    const savedData = await bookModel.create(data)
    return res.status(201).send({ status: true, message: "success", data: savedData })

  }
  catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
}



const getBooks = async function (req, res) {
  try {

    let query = req.query

    if (!query) {
      let allBook = await bookModel.find({ isDeleted: false }).sort("title")
      if (allBook.length == 0) return res.status(400).send({ status: false, message: "Book Not Found" })
      return res.status(200).send({ status: true, message: "success", data: allBook })
    }

    if (query.userId) {
      let id = query.userId
      let user = await userModel.findById(id)
      if (!user) { return res.status(400).send({ status: false, msg: "No book of such user" }) }
    }

    if (query.category) {
      const category = query.category
      const book = await bookModel.find( {category: category} )
      if (!book) { return res.status(400).send({ status: false, msg: "No book related to this category" }) }
    }

    if (query.subcategory) {
      const subcategory = query.subCategory
      const book = await bookModel.find({ subcategory: subcategory })
      if (!book) { return res.status(400).send({ status: false, msg: "No book related to this sub-category" }) }
    }

    let getAllBook = await bookModel.find(query).select({_id:1, title:1, excerpt:1, userId:1, category:1, releasedAt:1, reviews:1}).sort("title")

    if (getAllBook.length == 0) return res.status(400).send({ status: false, message: "Book Not Found" })

    return res.status(200).send({ status: true, message: "success", data: getAllBook })

  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
}



const getBooksByBookId = async function (req, res) {
  try {


  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
}



const updateBooksByBookId = async function (req, res) {
  try {


  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
}



const deleteBooksByBookId = async function (req, res) {
  try {


  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
}


module.exports.postBooks = postBooks
module.exports.getBooks = getBooks
module.exports.getBooksByBookId = getBooksByBookId
module.exports.updateBooksByBookId = updateBooksByBookId
module.exports.deleteBooksByBookId = deleteBooksByBookId
