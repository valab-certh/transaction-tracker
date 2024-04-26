const mongoose = require('mongoose');
const db = mongoose.connection;


const retrieveByUserOrg = async (username, org, fromDate, toDate, pageSize, currentPage) => {
    console.log(org)
    console.log(username)

    var byuserPage;
    var logsLength;

    fromDate = new Date (fromDate);
    toDate = new Date(toDate);

    toDate.setUTCHours(23,59,59,999);


    if (username && (username != "all" && username != "All" && username != "ALL")){
        console.log(username);

        logsLength =  db.collection("logs").countDocuments({User: username, Organisation: org, Date:{$gte: fromDate, $lt: toDate}});
        byuserPage =  db.collection("logs").find({User: username, Organisation: org, Date:{$gte: fromDate, $lt: toDate}}).project({_id:0, __v:0});

    }

    else {

        logsLength = db.collection("logs").countDocuments({Organisation: org, Date:{$gte: fromDate, $lt: toDate}});
        byuserPage = db.collection("logs").find({Organisation: org, Date:{$gte: fromDate, $lt: toDate}}).project({_id:0, __v:0});

    }

    byuserPage = await byuserPage.toArray();
    logsLength = + (await logsLength).toString();
    
    return {"Length":logsLength, "logsPage": byuserPage}
}

module.exports = retrieveByUserOrg;