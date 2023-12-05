const mongoose = require('mongoose');
const Comments = require('../../models/reputationComments.model');

async function deleteComment(comment){

    try {
        let id = comment._id;
        const deletedComment = await Comments.findOneAndDelete({ id });
        console.log(`deleted coment is ${deletedComment}`)
    
        if (deletedComment) {
          console.log('Comment deleted successfully');
        } else {
          console.log('Comment not found or not deleted');
        }
      } catch (error) {
        console.error('Error deleting comment:', error);
        throw error;
      }
    

}

module.exports = deleteComment;