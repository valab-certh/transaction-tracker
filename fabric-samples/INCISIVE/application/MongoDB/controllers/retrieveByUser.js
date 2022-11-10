const mongoose = require('mongoose');
const db = mongoose.connection;


const retrieveByUser = async (username) => {

    let byuser =  db.collection("logs").find({User: username}).project({_id:0, __v:0});

    let logs = await byuser.toArray();

    return logs
}

module.exports = retrieveByUser;