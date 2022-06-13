const express = require('express');
const router = express.Router();

const authorController = require("../controllers/authorController")
const bookController = require("../controllers/bookController")
const publisherController = require("../controllers/publisherController")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/createAuthor", authorController.createAuthor)

router.get("/getAuthorsData", authorController.getAuthorsData)

router.post("/createPublisher", publisherController.createPublisher)

router.get("/getPublisherData", publisherController.getPublisherData)

router.post("/createBook", bookController.createBook)

router.get("/getBooksData", bookController.getBooksData)

router.get("/getBooksWithAuthorDetails", bookController.getBooksWithAuthorDetails)

router.get("/getBooksWithPublisherDetails", bookController.getBooksWithPublisharDetails)

router.get("/getBooksWithPublisharAndAuthorDetails", bookController.getBooksWithPublisharAndAuthorDetails)

router.put("/updateBooleanKey", bookController.updateBooleanKey)

router.put("/updatePrice", bookController.updatePrice)

module.exports = router;