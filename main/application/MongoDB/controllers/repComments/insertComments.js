const mongoose = require('mongoose');
const Comments = require('../../models/reputationComments.model');

async function saveNewComment(service, newComment){

    console.log(`The comment for service  ${service} is ${newComment}!`)

    try {

        const newComments = new Comments({

            _id: new mongoose.Types.ObjectId(),
            serviceID: service,
            comment: newComment
        });

        const savedComment = await newComments.save();
        console.log('New comment saved!');

        return savedComment;
    }
    catch(error){

        console.log('Error saving new comment: ', error)
        throw error;
    }
}

module.exports = saveNewComment;