
const express = require('express');
const router = express.Router();

const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")
const middleWare = require("../Middleware/middleware")


router.post("/createAuthor", authorController.createAuthor)

router.post("/createBlog",middleWare.Authenticate,middleWare.Authorisation, blogController.createBlog)

router.get("/filterBlogs",middleWare.Authenticate, blogController.filterBlogs)

router.put("/updateBlog/:blogId",middleWare.Authenticate,middleWare.Authorisation, blogController.updateBlog)

router.delete("/deleteBlogs/:blogId",middleWare.Authenticate,middleWare.Authorisation, blogController.deleteBlogs)
    
router.delete("/deleteByQuery/:blogId",middleWare.Authenticate,middleWare.Authorisation, blogController.deleteByQuery)

router.post("/login", blogController.login)

module.exports = router;