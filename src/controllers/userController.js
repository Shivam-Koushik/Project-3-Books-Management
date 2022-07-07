// const { validate } = require("../models/userModel")
const userModel = require("../models/userModel")
const Validator = require("../Validator/validation")
const jwt = require("jsonwebtoken")


const register = async function (req, res) {
  try {
    let data = req.body
    const { title, name, phone, email, password, address } = data
    if (!Validator.isValidBody(data)) return res.status(400).send({ status: false, message: "Please enter details" })

    if (!title) return res.status(400).send({ status: false, message: "Please enter title" })
    if (!Validator.isValid(title)) return res.status(400).send({ status: false, message: "Provide valid title" })
    if (title != ("Mr" || "Mrs" || "Miss")) return res.status(400).send({ status: false, message: "Provide enter Mr, Miss , Mrs only" })

    if (!name) return res.status(400).send({ status: false, message: "Please enter name" })
    if (!Validator.isValid(name)) return res.status(400).send({ status: false, message: "Provide valid name" })

    if (!phone) return res.status(400).send({ status: false, message: "Please enter phone" })
    if (!Validator.isValidMobile(phone)) return res.status(400).send({ status: false, message: "Provide valid phone" })
    const mobile = await userModel.findOne({ phone: phone })
    if (mobile) return res.status(400).send({ status: false, message: "Phone number already exist" })

    if (!email) return res.status(400).send({ status: false, message: "Please enter email" })
    if (!Validator.isValidEmail(email)) return res.status(400).send({ status: false, message: "Provide valid email" })
    const Email = await userModel.findOne({ email: email })
    if (Email) return res.status(400).send({ status: false, message: "email already exist" })

    if (!password) return res.status(400).send({ status: false, message: "Please enter password" })
    if (!Validator.isValidPassword(password)) return res.status(400).send({ status: false, message: "Use strong password ,  At least one upper case letter , lower case , number and  (min length Eight and max length Fifteen)" })
   
    if(address){
      if(!Validator.isValidBody(address)) return res.status(400).send({ status: false, message: "Provide your address" })
      if(!Validator.isValid(address.street)) return res.status(400).send({ status: false, message: "Provide valid street" })
      if(!Validator.isValid(address.city))  return res.status(400).send({ status: false, message: "Provide valid city" })
     
      if(!(/^[1-9][0-9]{5}$/.test(address.pincode)))  return res.status(400).send({ status: false, message: "Provide valid pincode" })
    }

    let saveData = await userModel.create(data)
    return res.status(201).send({ status: true, message: 'Success', data: saveData })

  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
}




const login = async function (req, res) {
  try {
    let data = req.body
    if (!Validator.isValidBody(data)) return res.status(400).send({ status: false, message: "Please enter details" })
    
    const{ email, password } = data

    if (!email) return res.status(400).send({ status: false, message: "Please enter email" })
    if (!Validator.isValidEmail(email)) return res.status(400).send({ status: false, message: "Provide valid email" })

    if (!password) return res.status(400).send({ status: false, message: "Please enter password" })
    if (!Validator.isValidPassword(password)) return res.status(400).send({ status: false, message: "Use strong password ,  At least one upper case letter , lower case , number and special character , min length Eight and max length Fifteen" })

    const user  = await userModel.findOne({$and: [{email:email},{password:password}]})
    if(!user) return res.status(400).send({ status: false, message: "enter correct email or password"})

    let token = jwt.sign({
      
      userId: user._id.toString(),
      email: user.email,
      password: user.password
    }, 
      "project_3" , {expiresIn: '24h'}
    );
 
      res.status(200).setHeader("x-api-key", token);
      res.status(200).send({status: true, message: 'Success', data:token}); 
        
  } 
  catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
}


module.exports.login = login
module.exports.register = register

