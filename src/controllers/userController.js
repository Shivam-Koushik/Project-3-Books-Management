// const { validate } = require("../models/userModel")
const userModel = require("../models/userModel")
const Validator = require("../Validator/validation")
const jwt = require("jsonwebtoken")

// ===============> create user api 
const register = async function (req, res) {
  try {
    let data = req.body

    // destructing data here
    const { title, name, phone, email, password, address } = data

    // if the body is empty
    if (!Validator.isValidBody(data)) return res.status(400).send({ status: false, message: "Please enter details" })

    if (!title) return res.status(400).send({ status: false, message: "Please enter title" })
    if (!Validator.isValid(title)) return res.status(400).send({ status: false, message: "Provide valid title" })
    if (title != "Mr" && title!= "Mrs" && title!= "Miss") return res.status(400).send({ status: false, message: "Provide enter Mr, Miss , Mrs only" })

    if (!name) return res.status(400).send({ status: false, message: "Please enter name" })
    if (!Validator.isValid(name)) return res.status(400).send({ status: false, message: "Provide valid name" })

    if (!phone) return res.status(400).send({ status: false, message: "Please enter phone" })
    if (!Validator.isValidMobile(phone)) return res.status(400).send({ status: false, message: "Provide valid phone" })
    const mobile = await userModel.findOne({ phone: phone })  // <=====checking duplicate value
    if (mobile) return res.status(400).send({ status: false, message: "Phone number already exist" })

    if (!email) return res.status(400).send({ status: false, message: "Please enter email" })
    if (!Validator.isValidEmail(email)) return res.status(400).send({ status: false, message: "Provide valid email" })
    const Email = await userModel.findOne({ email: email }) // <=====checking duplicate value
    if (Email) return res.status(400).send({ status: false, message: "email already exist" })

    if (!password) return res.status(400).send({ status: false, message: "Please enter password" })
    if (!Validator.isValidPassword(password)) return res.status(400).send({ status: false, message: "Use strong password ,  At least one upper case letter , lower case , number and  (min length Eight and max length Fifteen)" })

    if (address) {
      if (!Validator.isValidBody(address)) return res.status(400).send({ status: false, message: "Provide your address" })
      if (!Validator.isValid(address.street)) return res.status(400).send({ status: false, message: "Provide valid street" })
      if (!Validator.isValid(address.city)) return res.status(400).send({ status: false, message: "Provide valid city" })
      if (!(/^[1-9][0-9]{5}$/.test(address.pincode))) return res.status(400).send({ status: false, message: "Provide valid pincode" })
    }

    let saveData = await userModel.create(data)
    return res.status(201).send({ status: true, message: 'Success', data: saveData })

  } catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }
}

// ==========> login api
const login = async function (req, res) {
  try {
    let data = req.body
    if (!Validator.isValidBody(data)) return res.status(400).send({ status: false, message: "Please enter details" })

    const { email, password } = data

    if (!email) return res.status(400).send({ status: false, message: "Please enter email" })
    if (!Validator.isValidEmail(email)) return res.status(400).send({ status: false, message: "Provide valid email" })

    if (!password) return res.status(400).send({ status: false, message: "Please enter password" })
    if (!Validator.isValidPassword(password)) return res.status(400).send({ status: false, message: "Use strong password ,  At least one upper case letter , lower case , number and special character , min length Eight and max length Fifteen" })

    const userEmail = await userModel.findOne({ email: email })
    if (!userEmail) return res.status(400).send({ status: false, message: "Email does not exist" })
    const userPassword = await userModel.findOne({ password: password })
    if (!userPassword) return res.status(400).send({ status: false, message: "Password does not exist" })


    let token = jwt.sign({

      userId: userEmail._id.toString(),
      email: userEmail.email,
      password: userPassword.password,
      at: Math.floor(Date.now() / 1000),                //issued date
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60  //expires in 24 hr 24 represent this

    },
      "project_3"
    );

    res.status(200).setHeader("x-api-key", token);
    res.status(200).send({ status: true, message: 'Success', data: {token} });

  }
  catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }
}


module.exports.login = login
module.exports.register = register  