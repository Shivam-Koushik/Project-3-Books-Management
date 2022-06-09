const publisherModel= require("../models/publisherModel")

const createPublisher= async function (req, res) {
    let publisher = req.body
    let publisherCreated = await publisherModel.create(publisher)
    res.send({data: publisherCreated})
}

const getPublisherData= async function (req, res) {
    let publisher = await publisherModel.find()
    res.send({data: publisher})
}

module.exports.createPublisher= createPublisher
module.exports.getPublisherData= getPublisherData