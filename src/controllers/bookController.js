const bookModel = require("../models/bookModel")
const  ObjectId = require('mongoose').Types.ObjectId;
const Validator = require("../Validator/validation")
const moment = require("moment")

const postBooks = async function (req, res) {
    try{
       let data = req.body
 
      const {title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt} = data

      if (!Validator.isValidBody(data)) return res.status(400).send({ status: false, message: "Please enter details" })

      if(!title) return res.status(400).send({status: false,  message: "please enter title"})
      if (!Validator.isValid(title)) return res.status(400).send({ status: false, message: "Provide valid title" }) 
      const dup = await bookModel.findOne({title:title})
      if(dup) return res.status(400).send({ status: false, message: "title already exist" }) 

      if(!excerpt) return res.status(400).send({status: false,  message: "please enter excerpt"})
      if (Validator.isValid(excerpt)) return res.status(400).send({ status: false, message: "Provide valid excerpt" }) 
      
      if(!userId) return res.status(400).send({status: false,  message: "please enter userId"})
      if(!ObjectId.isValid(userId)) return res.status(400).send({status: false,  message: "please enter valid userId"})

      if(!ISBN) return res.status(400).send({status: false,  message: "please enter ISBN"})
      if (ISBN.length !== 13) return res.status(400).send({ status: false, message: "Provide valid ISBN" }) 
      const dupISBN = await bookModel.findOne({ISBN:ISBN})
      if(dupISBN) return res.status(400).send({ status: false, message: "ISBN already exist" }) 

      if(!category) return res.status(400).send({status: false,  message: "please enter category"})
      if (!Validator.isValid(category)) return res.status(400).send({ status: false, message: "Provide valid category" }) 

      if(!subcategory) return res.status(400).send({status: false,  message: "please enter subcategory"})
      if(subcategory.length == 0) return res.status(400).send({status: false,  message: "please enter atleast one subcategory"})
      if(subcategory == 0) return res.status(400).send({status: false,  message: "please enter atleast String one subcategory"})
      
      if(reviews) {
      if (typeof reviews === 'string') return res.status(400).send({ status: false, message: "Provide valid reviews"})
      }
      
      if(!releasedAt) return res.status(400).send({status: false, message: "please enter date of realease"})
      if(moment (releasedAt, 'YYYY-MM-DD').isValid(), false) 
      return res.status(400).send({status: false, message: "please enter date in valid format ('YYYY-MM-DD') "})
      
      const  savedData =  await bookModel.create(data)
      return res.status(201).send({ status: true , message: "success", data: savedData})

    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
  }

  const getBooks = async function (req, res) {
    try {
       
  
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
  }
  
  
  module.exports. postBooks= postBooks
  module.exports. getBooks= getBooks
  