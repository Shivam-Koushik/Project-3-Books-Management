const mongoose = require('mongoose');

const newPublisher = new mongoose.Schema( {
    name: String,
    headQuarter: String,
    
}, { timestamps: true });

module.exports = mongoose.model('Publisher', newPublisher)