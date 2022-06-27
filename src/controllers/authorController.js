const AuthorModel = require("../models/authorModel")

const createAuthor = async function (req, res) {
    try {
        let author = req.body
        let strRegex = /^\w[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/
        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        let passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&-]*).{8,}$/

        if (Object.keys(author).length === 0) return res.status(400).send({ status: true, msg: "Please enter details for creation" })

        if (typeof (author.fname) != 'string' || !author.fname || !strRegex.test(author.fname)) return res.status(400).send({ status: false, msg: "fname is must in the valid formate" })

        if (typeof (author.lname) != 'string' || !author.lname || !strRegex.test(author.lname)) return res.status(400).send({ status: false, msg: "lname is must in the valid formate" })

        if (author.title != ("Mr" || "Mrs" || "Miss") || !author.title) return res.status(400).send({ status: false, msg: "title is must in the valid formate" })

        let mail = await AuthorModel.findOne({ email: author.email})
        if (mail) return res.status(400).send({ status: false, msg: "this email id already used" })

        if (!(emailRegex.test(author.email)) || !author.email) return res.status(400).send({ status: false, msg: "email is must in the valid formate" })

        if (!AuthorModel.findOne({ email: author.email })) return res.send({ status: false, msg: "this email is already used" })
 
        if (!(passwordRegex.test(author.password)) || !author.password) return res.status(400).send({ status: false, msg: " password is must in the valid formate   REQUIREMENTS :  At least one upper case English letter , At least one lower case English letter , least one digit , At least one special character , Minimum eight in length" })

        let authorCreated = await AuthorModel.create(author)
       return res.status(201).send({ status: true, data: authorCreated })

    } catch (err) {
      return res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports.createAuthor = createAuthor