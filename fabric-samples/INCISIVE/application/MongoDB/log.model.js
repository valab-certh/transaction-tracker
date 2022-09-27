const mongoose = require('mongoose');

let log;

var logSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,

    hash: {
        type: String,
        required: true,
        unique: false
    },

    log: {
        type:Object,
        required: true
    }
})

log = mongoose.model('Log', logSchema)

module.exports = log;