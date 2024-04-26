const mongoose = require('mongoose');
const db = mongoose.connection;


const retrieveByDate = async (date) => {

    let bydate =  db.collection("logs").find({Date: date}).project({_id:0, __v:0});

    let logs = await bydate.toArray();

    return logs
}

module.exports = retrieveByDate;