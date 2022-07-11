const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')
const reviewController = require('../controllers/reviewController')
const middleware = require('../Middleware/middleware')

router.post('/register',userController.register)
router.post('/login',userController.login)
router.post('/books',middleware.Authenticate,middleware.Authorisation, bookController.postBooks)
router.get('/books',middleware.Authenticate,bookController.getBooks)
router.get('/books/:bookId',middleware.Authenticate,bookController.getBooksByBookId)
router.put('/books/:bookId',middleware.Authenticate,middleware.Authorisation,bookController.updateBooksByBookId)
router.delete('/books/:bookId',middleware.Authenticate,middleware.Authorisation, bookController.deleteBooksByBookId)
router.post('/books/:bookId/review',middleware.Authenticate, reviewController.createReview)
router.put('/books/:bookId/review/:reviewId',middleware.Authenticate, reviewController.updateReview)
router.delete('/books/:bookId/review/:reviewId', reviewController.deleteReview)

module.exports = router;