const bookModel = require("../models/bookModel")
const ObjectId = require('mongoose').Types.ObjectId;
const Validator = require("../Validator/validation")
const userModel = require("../models/userModel.js");
const { default: mongoose } = require("mongoose");

// ========> create books
const postBooks = async function (req, res) {
  try {
    let data = req.body
    const { title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt } = data

    if (!Validator.isValidBody(data)) return res.status(400).send({ status: false, message: "Please enter details" })

    if (!title) return res.status(400).send({ status: false, message: "please enter title" })
    if (!Validator.isValid(title)) return res.status(400).send({ status: false, message: "Provide valid title" })
    const dup = await bookModel.findOne({ title: title }) // <=====checking duplicate value
    if (dup) return res.status(400).send({ status: false, message: "title already exist" })

    if (!excerpt) return res.status(400).send({ status: false, message: "please enter excerpt" })
    if (!Validator.isValid(excerpt)) return res.status(400).send({ status: false, message: "Provide valid excerpt" })

    if (!userId) return res.status(400).send({ status: false, message: "please enter userId" })
    if (!ObjectId.isValid(userId)) return res.status(400).send({ status: false, message: "please enter valid userId" })

    if (!ISBN) return res.status(400).send({ status: false, message: "please enter ISBN" })
    if (ISBN.length !== 13 ) return res.status(400).send({ status: false, message: "Provide valid ISBN" })
    const dupISBN = await bookModel.findOne({ ISBN: ISBN }) // <=====checking duplicate value
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

// ==========> get books 
const getBooks = async function (req, res) {
  try {

    let query = req.query

    if (!query) {
      let allBook = await bookModel.find({ isDeleted: false }).sort("title")
      if (allBook.length == 0) return res.status(400).send({ status: false, message: "Book Not Found" })
      return res.status(200).send({ status: true, message: "Books List", data: allBook })
    }

    if (query.userId) {
      let id = query.userId
      let user = await userModel.findById(id)
      if (!user) { return res.status(400).send({ status: false, msg: "No book of such user" }) }
    }

    if (query.category) {
      const category = query.category
      const book = await bookModel.find({ category: category })
      if (!book) { return res.status(400).send({ status: false, msg: "No book related to this category" }) }
    }

    if (query.subcategory) {
      const subcategory = query.subCategory
      const book = await bookModel.find({ subcategory: subcategory })
      if (!book) { return res.status(400).send({ status: false, msg: "No book related to this sub-category" }) }
    }

    let getAllBook = await bookModel.find(query).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort("title")

    if (getAllBook.length == 0) return res.status(400).send({ status: false, message: "Book Not Found" })

    return res.status(200).send({ status: true, message: "Books List", data: getAllBook })

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


// =============>  Update books
const updateBooksByBookId = async function (req, res) {
  try {
    let data = req.body
    let bookId = req.params.bookId;
    if (!Validator.isValidBody(data)) return res.status(400).send({ status: false, message: "Please enter details" })

    const { title, excerpt, releasedAt, ISBN} = data

    if (!Validator.isValid(title)) return res.status(400).send({ status: false, message: "Provide valid title" })
    const duptitle = await bookModel.findOne({ title: title })
    if (duptitle) { return res.status(400).send({ status: false, message: "this title is already in use" }) }
    
    if(excerpt) {
    if (!Validator.isValid(excerpt)) return res.status(400).send({ status: false, message: "Provide valid excerpt" })
    }

    // if (!Validator.isValid(ISBN)) return res.status(400).send({ status: false, message: "Provide valid ISBN" })
    // // if (ISBN.length != 13 ) return res.status(400).send({ status: false, message: "Provide valid ISBN" })
    if (ISBN.length !== 13) return res.status(400).send({ status: false, message: "Provide valid ISBN" })


    const dupISBN = await bookModel.findOne({ ISBN: ISBN })
    if (dupISBN) { return res.status(400).send({ status: false, message: "this ISBN is already in use" }) }


    const updatedBlog = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false },
      { title: title, excerpt: excerpt, releasedAt: releasedAt, ISBN: ISBN } , { new: true });

    // const afterUpdate = updatedBlog ?? "BLog not found"
    res.status(200).send({ status: true, message: "success", data: updatedBlog })

  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
}



const deleteBooksByBookId = async function (req, res) {
  try {
    let BookId = req.params.bookId
    let date = new Date()
    let Book = await bookModel.findById(BookId)

    // WHEN WE PROVIDE WRONG ID
    const isValidObjectId = mongoose.Types.ObjectId.isValid(Book)
    if(!isValidObjectId) { return res.status(400).send({ status: false, msg: "Book Not Exist In DB" }) }

    let check = await bookModel.findOneAndUpdate(
      { _id: BookId }, { $set: { isDeleted: true, deletedAt: date } }, { new: true })

    //IF THE BOOK IS ALREADY DELETED  
    const alreadyDeleted = await bookModel.findOne({isDeleted:true}) 
    if(alreadyDeleted) { return res.status(400).send({ status: false, msg: "ALREADY DELETED" }) }

    return res.status(200).send({ status: true, msg: " BOOK IS DELETED ", data: check })
  }

  catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
}


module.exports.postBooks = postBooks
module.exports.getBooks = getBooks
module.exports.getBooksByBookId = getBooksByBookId
module.exports.updateBooksByBookId = updateBooksByBookId
module.exports.deleteBooksByBookId = deleteBooksByBookId
