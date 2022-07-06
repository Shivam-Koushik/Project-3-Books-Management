const bookModel = require("../models/bookModel")
const ObjectId = require('mongoose').Types.ObjectId;
const Validator = require("../Validator/validation")

const moment = require("moment")

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
  
    // // releasedAt = moment(releasedAt).format("YYYY-MM-DD")
    // let isValidDateFormat = function (date) {
    //   let dateFormatRegex = /((?:19|20)\\d\\d)-(0?[1-9]|1[012])-([12][0-9]|3[01]|0?[1-9])/
      
    //   return dateFormatRegex.test(data)

    // }
    // if (!isValidDateFormat(releasedAt)) return res.status(400).send({ status: false, message: " wrong date format" })

    const savedData = await bookModel.create(data)
    return res.status(201).send({ status: true, message: "success", data: savedData })

  }
  catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
}

const getBooks = async function (req, res) {
  try {let doc = req.query
    // if (!Validator.isValidBody(doc)) return res.status(400).send({ status: false, message: "provide filters" })
    if (doc.userId) {
      let id = doc.userId
      let user = await userModel.findById(id)
      if (!user) { return res.status(400).send({ status: false, msg: "No book of such user" }) }
    }
    
    if (doc.category) {
      const category = doc.category
      const book = await bookModel.find({ category: category })
      if (!book) { return res.status(400).send({ status: false, msg: "No book of this category" }) }
    }
    if (doc.subCategory) {
      const subcategory = doc.subCategory
      const book = await bookModel.find({ subcategory: subcategory })
      if (!book) { return res.status(400).send({ status: false, msg: "No book related to this sub-category" }) }
    }


     let Book =  await bookModel.find(doc).select({_id:1,title:1,excerpt:1,userId:1,category:1,releasedAt:1,reviews:1})

      Book.filter(x=>x.isDeleted===false)
      

    if (!Book || Book.length == 0) { res.status(400).send({ status: false, msg: "No such book exist" }) }

    

    return res.status(200).send({ status:true,data:Book.title.sort() })


  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
}





module.exports.postBooks = postBooks
module.exports.getBooks = getBooks
