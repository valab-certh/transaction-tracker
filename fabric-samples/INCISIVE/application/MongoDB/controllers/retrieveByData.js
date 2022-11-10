const mongoose = require('mongoose');
const db = mongoose.connection;


const retrieveByData = async (data_id) => {

    let byData =  db.collection("logs").find({Data: data_id}).project({_id:0, __v:0});

    let logs = await byData.toArray();


    return logs
}

module.exports = retrieveByData;