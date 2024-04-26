const mongoose = require('mongoose');

let log;

var logSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,

    hash: {
        type: String,
        required: true,
        unique: false
    },

    ID: {
        type:Object,
        required: true
    },

    User: {
        type:Object,
        required: true
    },

    Organisation: {
        type:Object,
        required: true
    },

    Role: {
        type:Object,
        required: true
    },

    Date: {
        type:Date,
        required: true
    },

    Action: {
        type:Object,
        required: true
    },


    UserRegistered: {
        type:Object,
        required: true
    },

    Data: {
        type:Object,
        required: true
    },

    Query: {
        type:Object,
        required: true
    },

    ModelName: {
        type:Object,
        required: true
    },

    AIservice: {
        type:Object,
        required: true
    }

})

log = mongoose.model('Log', logSchema)

module.exports = log;