const reviewModel = require("../models/reviewModel")
const bookModel = require("../models/bookModel")
const Validator = require("../Validator/validation")


const createReview = async function (req, res) {
    try {
        let body = req.body
        const newbookId  = req.params.bookId

        const{reviewedBy,rating,review} = body
        

        if (!Validator.isValidBody(body)) return res.status(400).send({ status: false, message: "Please enter details" })
        
        const uniqueBookId = await bookModel.findOne({$and:[{newbookId},{isDeleted:false}]})
        if(!uniqueBookId) return res.status(400).send({ status: false, message: "Book is not present" })

        if(reviewedBy){
        if(!Validator.isValid(reviewedBy)) return res.status(400).send({ status: false, message: "Please enter valid reviewedBy" })}

        if(!rating)  return res.status(400).send({ status: false, message: "Please enter rating" })
        if(!/[0-5]/.test(rating))  return res.status(400).send({ status: false, message: "Please enter valid rating" })

        if(review){
        if(!Validator.isValid(review))  return res.status(400).send({ status: false, message: "Please enter valid review" })}

        const bookData = await bookModel.findByIdAndUpdate({_id:newbookId}, {$inc:{reviews:1}}).lean()

        await reviewModel.create(body)
        const reviewData = await reviewModel.find({bookId:bookId}).lean()
        reviewData.bookId = newbookId
        reviewData.reviewedAt = bookData.reviewedAt

        bookData.reviewsData = reviewData

        return res.status(201).send({ status: true, message: "success", data:bookData})
  
    } catch (err) {
      return res.status(500).send({ status: false, message: err.message })
    }
  }


const updateReview = async function (req, res) {
    try {
     
    
  
    } catch (err) {
      return res.status(500).send({ status: false, message:err.message })
    }
  }


const deleteReview = async function (req, res) {
    try {
     
    
  
    } catch (err) {
      return res.status(500).send({ status: false, message: err.message })
    }
  }


module.exports.createReview = createReview
module.exports.updateReview = updateReview
module.exports.deleteReview = deleteReview