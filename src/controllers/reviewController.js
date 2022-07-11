const reviewModel = require("../models/reviewModel")
const Validator = require("../Validator/validation")
const bookModel = require("../models/bookModel")

const createReview = async function (req, res) {
  try {
    let body = req.body
    const newbookId = req.params.bookId



    
    if (!Validator.isValidBody(body)) return res.status(400).send({ status: false, message: "Please enter details" })
    
    //const uniqueBookId = await bookModel.findOne({ $and: [{ newbookId }, { isDeleted: false }] })
    let uniqueBookId = await bookModel.findOne({ _id: newbookId, isDeleted: false })
    console.log(uniqueBookId)
    if (!uniqueBookId) return res.status(400).send({ status: false, message: "Book is not present" })

    if (!body.reviewedBy) { body.reviewedBy = "Guest" }
    if (!Validator.isValid(body.reviewedBy)) return res.status(400).send({ status: false, message: "Please enter a valid name" })



    if (!body.rating) return res.status(400).send({ status: false, message: "Please enter rating" })
    if (!/[0-5]/.test(body.rating)) return res.status(400).send({ status: false, message: "Please enter valid rating" })

    if (body.review) {
      if (!Validator.isValid(body.review)) return res.status(400).send({ status: false, message: "Please enter valid review" })
    }
    body.bookId = newbookId
    body.reviewedAt = new Date()
    await reviewModel.create(body)
    let allreview = await reviewModel.find({ bookId: newbookId }).select({ updatedAt: 0, createdAt: 0, __v: 0 })
    console.log(allreview)
    // const bookData = await bookModel.findByIdAndUpdate({ _id: newbookId }, { $inc: { reviews: 1 } }).lean()

    let inc = uniqueBookId.reviews + 1
    uniqueBookId.reviews = inc
   await  uniqueBookId.save()


    let output = {
      _id: uniqueBookId._id,
      title: uniqueBookId.title,
      excerpt: uniqueBookId.excerpt,
      userId: uniqueBookId.userId,
      category: uniqueBookId.category,
      subcategory: uniqueBookId.subcategory,
      deleted: uniqueBookId.deleted,
      reviews: inc,
      reviewData:allreview,
      deletedAt: uniqueBookId.deletedAt,
      releasedAt: uniqueBookId.releasedAt,
      createdAt: uniqueBookId.createdAt,
      updatedAt: uniqueBookId.updatedAt
  }
 

    



    return res.status(201).send({ status: true, message: "success", data: output })


  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
}



const updateReview = async function (req, res) {
  try {
    let data = req.body
    const { review, rating, reviewedBy } = data

    // ______________________________________bookId validation____________________________________________________//
    let bookId = req.params.bookId
    if (!Validator.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "userId is not valid" })

    let eBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
    if (!eBook) { return res.status(400).send({ status: false, message: "book doesn't exist" }) }
    //____________________________________________reviewId validations____________________________________________________//
    let reviewId = req.params.reviewId
    if (!Validator.isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: "reviewId is not valid" })

    let eReview = await reviewModel.findOne({ _id: reviewId })
    if (!eReview) { return res.status(400).send({ status: false, message: "Review doesn't exist" }) }
    //__________________________________________review validation_________________________________________________________//
    if (review) {
      if (!Validator.isValid(review)) { return res.status(400).send({ status: false, message: "enter something in review" }) }
    }
    //_____________________________________rating validation__________________________________________________________//
    // if (rating) {
    //   if (rating !== Number) { return res.status(400).send({ status: false, message: "use numbers only for rating" }) }
    // }

    //___________________________________________reviewedBy validations__________________________________________________//
    if (reviewedBy) {
      if (!Validator.isValid(reviewedBy)) { return res.status(400).send({ status: false, message: "enter something in reviewedBy" }) }
    }
    //__________________________________________________________________________________________________________________//


    await reviewModel.findOneAndUpdate({ _id: reviewId }, data, { new: true })

    let allReview = await reviewModel.find({ bookId: bookId })
    let book = await bookModel.findOne({ _id: bookId }).lean()
    book.reviewData = allReview
    res.status(200).send({ status: false, data: book })
  }


  catch (err) {
    return res.status(500).send({ status: false, msg: err.message })

  }
}


const deleteReview = async function (req, res) {
  try {
    const { reviewId, bookId } = req.params   // destructuring the params here 

    if (!Validator.isValidObjectId(reviewId)) { return res.status(400).send({ status: false, msg: "please enter Valid Id" }) }

    if (!Validator.isValidObjectId(bookId)) { return res.status(400).send({ status: false, msg: "please enter Valid Id" }) }



    const validReviewId = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
    if (!validReviewId) { return res.status(400).send({ status: false, msg: "review does not exist" }) }

    const validBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
    if (!validBook) { return res.status(400).send({ status: false, msg: "please enter Valid Id" }) }



    if (bookId != validReviewId.bookId) { return res.status(400).send({ status: false, msg: "this review is not for this book" }) }

    await reviewModel.findOneAndUpdate({ _id: reviewId }, { isDeleted: true }, { new: true })

    //const Book = await bookModel.findOneAndUpdate({_id:bookId}, {$inc:{review: -1}}).lean()

    let dec = validBook.reviews - 1
    validBook.reviews = dec
    validBook.save()  //mongoose save() method which insert the object in the DB

    console.log(validBook)
    return res.status(200).send({ status: true, msg: "Book's review deleted successfully", data: validBook })


  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
}


module.exports.createReview = createReview
module.exports.updateReview = updateReview
module.exports.deleteReview = deleteReview