const mongoose = require('mongoose');

var commentsSchema = new mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,

    serviceID: {
        type: String,
        required: true,
        unique: false
    },

    comment: {
        type: String,
        required: true
    }
});


let AdditionalComments = mongoose.model('AdditionalComments', commentsSchema);

module.exports = AdditionalComments;
