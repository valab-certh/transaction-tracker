const mongoose = require('mongoose');

let log;

var logSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,

    hash: {
        type: String,
        required: true,
        unique: false
    },

    User: {
        type:Object,
        required: true
    },

    Timestamp: {
        type:Object,
        required: true
    },

    Org: {
        type:Object,
        required: true
    },

    Role: {
        type:Object,
        required: true
    },

    Action: {
        type:Object,
        required: true
    },

    Data: {
        type:Object,
        required: true
    }

})

log = mongoose.model('Log', logSchema)

module.exports = log;