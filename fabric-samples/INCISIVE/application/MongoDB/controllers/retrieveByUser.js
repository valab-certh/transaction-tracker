const mongoose = require('mongoose');
const db = mongoose.connection;


const retrieveByUser = async (username) => {

    var byuser;

    if (username && username != "All"){

        byuser =  db.collection("logs").find({User: username}).project({_id:0, __v:0});
    }

    else {

        byuser =  db.collection("logs").find({ }).project({_id:0, __v:0});
    }

   

    let logs = await byuser.toArray();

    return logs
}

module.exports = retrieveByUser;
