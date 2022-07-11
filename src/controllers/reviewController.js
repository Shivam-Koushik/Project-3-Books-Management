const reviewModel = require("../models/reviewModel")
const Validator = require("../Validator/validation")


const createReview = async function (req, res) {
    try {
     
    
  
    } catch (err) {
      return res.status(500).send({ status: false, msg: err.message })
    }
  }


const updateReview = async function (req, res) {
    try {
     
    
  
    } catch (err) {
      return res.status(500).send({ status: false, msg: err.message })
    }
  }


const deleteReview = async function (req, res) {
    try {
     
    
  
    } catch (err) {
      return res.status(500).send({ status: false, msg: err.message })
    }
  }


module.exports.createReview = createReview
module.exports.updateReview = updateReview
module.exports.deleteReview = deleteReview