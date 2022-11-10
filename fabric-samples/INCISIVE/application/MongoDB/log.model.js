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

    UserRegistered: {
        type:Object,
        required: false
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
        type:Object,
        required: true
    },

    Time: {
        type:Object,
        required: true
    },


    Action: {
        type:Object,
        required: true
    },

    Data: {
        type:Object,
        required: false
    },

    Query: {
        type:Object,
        required: false
    },

    ModelName: {
        type:Object,
        required: false
    },

    AIservice: {
        type:Object,
        required: false
    }

})

log = mongoose.model('Log', logSchema)

module.exports = log;