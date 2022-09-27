const mongoose = require('mongoose');
const db = mongoose.connection;


const retrieveByUser = async (username) => {

    // var dbo = db.db("logdb");

    let byuser =  db.collection("logs").find({User: username}).project({_id:0, __v:0});

    console.log(byuser.forEach(console.dir))

    let logs = byuser.toArray;

    return logs
}

module.exports = retrieveByUser;