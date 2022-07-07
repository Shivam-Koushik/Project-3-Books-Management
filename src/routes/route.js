
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')

router.post('/register',userController.register)
router.post('/login',userController.login)
router.post('/books',bookController.postBooks)
router.get('/books',bookController.getBooks)
router.get('/books/:bookId',bookController.getBooksByBookId)
router.put('/books/:bookId',bookController.getBooksByBookId)
router.delete('/books/:bookId',bookController.deleteBooksByBookId)


module.exports = router;