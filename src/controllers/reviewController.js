const reviewModel = require("../models/reviewModel")
const bookModel = require("../models/bookModel")
const Validator = require("../Validator/validation")

const createReview = async function (req, res) {
  try {
    let body = req.body
    const newbookId = req.params.bookId

    if(!Validator.isValidObjectId(newbookId))  return res.status(400).send({ status: false, message: "Enter valid bookId" })

    if (!Validator.isValidBody(body)) return res.status(400).send({ status: false, message: "Please enter details" })
  
    let uniqueBookId = await bookModel.findOne({ _id: newbookId, isDeleted: false })
    if (!uniqueBookId) return res.status(404).send({ status: false, message: "Book is not present" })

    if (!body.reviewedBy) { body.reviewedBy = "Guest" }
    if (!Validator.isValid(body.reviewedBy)) return res.status(400).send({ status: false, message: "Please enter a valid name" })

    if (!body.rating) return res.status(400).send({ status: false, message: "Please enter rating" })
    if (!/[0-5]/.test(body.rating)) return res.status(400).send({ status: false, message: "Please enter valid rating (1-5)" })

    if (body.review) {
      if (!Validator.isValid(body.review)) return res.status(400).send({ status: false, message: "Please enter valid review" })
    }

    body.bookId = newbookId
    body.reviewedAt = new Date()
   let reviewsData =  await reviewModel.create(body)

    let inc = uniqueBookId.reviews + 1
    uniqueBookId.reviews = inc
   await uniqueBookId.save()

    let output = {
      _id: uniqueBookId._id,
      title: uniqueBookId.title,
      excerpt: uniqueBookId.excerpt,
      userId: uniqueBookId.userId,
      category: uniqueBookId.category,
      subcategory: uniqueBookId.subcategory,
      deleted: uniqueBookId.deleted,
      deletedAt: uniqueBookId.deletedAt,
      releasedAt: uniqueBookId.releasedAt,
      createdAt: uniqueBookId.createdAt,
      updatedAt: uniqueBookId.updatedAt,
      reviews: inc,
      reviewData:reviewsData
  }
 
    return res.status(201).send({ status: true, message: "success", data: output })

  } catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }
}



const updateReview = async function (req, res) {
  try {
    let data = req.body
    const { review, rating, reviewedBy } = data

    let bookId = req.params.bookId
    if (!Validator.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "bookId is not valid" })

    let eBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
    if (!eBook) { return res.status(404).send({ status: false, message: "book doesn't exist" }) }
    let reviewId = req.params.reviewId
    if (!Validator.isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: "reviewId is not valid" })

    let eReview = await reviewModel.findOne({ _id: reviewId , isDeleted:false })
    if (!eReview) { return res.status(404).send({ status: false, message: "Review doesn't exist" }) }

    if (review) {
      if (!Validator.isValid(review)) { return res.status(400).send({ status: false, message: "enter something in review" }) }
    }

    if (rating) {
      if (!/[0-5]/.test(rating)) { return res.status(400).send({ status: false, message: "use numbers only for rating (0-5)" }) }
    }

    if (reviewedBy) {
      if (!Validator.isValid(reviewedBy)) { return res.status(400).send({ status: false, message: "enter valid something in reviewedBy" }) }
    }

    const reviewsData = await reviewModel.findOneAndUpdate({ _id: reviewId }, data, { new: true })

    let book = await bookModel.findOne({ _id: bookId }).lean()
    book.reviewData = reviewsData
    return res.status(200).send({status: true , message: 'Success', data: book })
  }

  catch (err) {
    return res.status(500).send({ status: false, message: err.message })

  }
}


const deleteReview = async function (req, res) {
  try {
    const { reviewId, bookId } = req.params  

    if (!Validator.isValidObjectId(reviewId)) { return res.status(400).send({ status: false, message: "please enter Valid reviewId" }) }

    if (!Validator.isValidObjectId(bookId)) { return res.status(400).send({ status: false, message: "please enter Valid bookId" }) }

    const validBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
    if (!validBook) { return res.status(404).send({status: false, message: "bookId does not exist" }) }

    const validReviewId = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
    if (!validReviewId) { return res.status(404).send({status: false, message: "review does not exist" }) }

    if (bookId != validReviewId.bookId) { return res.status(400).send({ status: false, message: "this review is not for this book" }) }

    await reviewModel.findOneAndUpdate({ _id: reviewId }, { isDeleted: true }, { new: true })

    let dec = validBook.reviews - 1
    validBook.reviews = dec
    await validBook.save()  

    return res.status(200).send({ status: true, message: 'Success', data: validBook })

  } catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }
}


module.exports.createReview = createReview
module.exports.updateReview = updateReview
module.exports.deleteReview = deleteReview