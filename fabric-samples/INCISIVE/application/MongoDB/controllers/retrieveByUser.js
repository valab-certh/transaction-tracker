const mongoose = require('mongoose');
const db = mongoose.connection;


const retrieveByUser = async (username, fromDate, toDate) => {

    var byuser;

    fromDate = new Date (fromDate);
    toDate = new Date(toDate);

        //  if same day change time to include whole day
    if (fromDate == toDate){

        toDate.setUTCHours(23,59,59,999);
    }

    if (username && (username != "all" && username != "All" && username != "ALL")){

        byuser =  db.collection("logs").find({User: username, Date:{$gte: fromDate, $lt: toDate}}).project({_id:0, __v:0});
    }

    else {

        byuser =  db.collection("logs").find({ Date:{$gte: fromDate, $lte: toDate}}).project({_id:0, __v:0});
    }

   

    let logs = await byuser.toArray();

    return logs
}

module.exports = retrieveByUser;
