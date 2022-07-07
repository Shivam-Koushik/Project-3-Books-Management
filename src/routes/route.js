const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')
const middleware = require('../Middleware/middleware')

router.post('/register',userController.register)
router.post('/login',userController.login)
router.post('/books',middleware.Authenticate,middleware.Authorisation, bookController.postBooks)
router.get('/books',middleware.Authenticate,bookController.getBooks)
router.get('/books/:bookId',middleware.Authenticate,bookController.getBooksByBookId)
router.put('/books/:bookId',middleware.Authenticate,middleware.Authorisation,bookController.updateBooksByBookId)
router.delete('/books/:bookId',middleware.Authenticate,middleware.Authorisation, bookController.deleteBooksByBookId)

module.exports = router;