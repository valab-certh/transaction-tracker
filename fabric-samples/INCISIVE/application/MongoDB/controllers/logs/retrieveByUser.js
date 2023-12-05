const mongoose = require('mongoose');
const db = mongoose.connection;


// const retrieveByUser = async (username, fromDate, toDate, pageSize, currentPage) => {
    const retrieveByUser = async (username, fromDate, toDate, pageSize, currentPage) => {

    var byuserPage;
    var logsLength;

    fromDate = new Date (fromDate);
    toDate = new Date(toDate);

    toDate.setUTCHours(23,59,59,999);

    if (username && (username != "all" && username != "All" && username != "ALL")){

        logsLength = db.collection("logs").countDocuments({User: username, Date:{$gte: fromDate, $lt: toDate}});  
        byuserPage = db.collection("logs").find({User: username, Date:{$gte: fromDate, $lt: toDate}}).project({_id:0, __v:0}).skip(pageSize * (currentPage-1)) .limit(pageSize);

    }

    else {
        logsLength = db.collection("logs").countDocuments({ Date:{$gte: fromDate, $lte: toDate}});
        byuserPage = db.collection("logs").find({ Date:{$gte: fromDate, $lte: toDate}}).project({_id:0, __v:0}).skip(pageSize * (currentPage-1)).limit(pageSize);

    }


    byuserPage = await byuserPage.toArray();
    logsLength = + (await logsLength).toString();
    
    return {"Length":logsLength, "logsPage": byuserPage}
}

module.exports = retrieveByUser;
