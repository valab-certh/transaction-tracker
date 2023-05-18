const mongoose = require('mongoose');
const db = mongoose.connection;


const retrieveByData = async (data_id, fromDate, toDate, pageSize, currentPage) => {

    console.log(data_id)
    console.log(data_id[0])

    var byDataPage;
    var logsLength;

    fromDate = new Date (fromDate);
    toDate = new Date(toDate);

        //  if same day change time to include whole day
    toDate.setUTCHours(23,59,59,999);

    if (data_id.length == 1){
        let query = "\""+data_id+"\"";
        console.log("The query is ", query)
    
        logsLength = db.collection("logs").countDocuments({Data: {$exists:true}, $text:{$search: query}, Date:{$gte: fromDate, $lt: toDate}});  
        byDataPage =  db.collection("logs").find({Data: {$exists:true}, $text:{$search: query}, Date:{$gte: fromDate, $lt: toDate}}).project({_id:0, __v:0}).skip(pageSize * (currentPage-1)).limit(pageSize);
    }

    else {

        //  amp the data array to regular expressions so they can be searched in the query
        let query = data_id.map(s => new RegExp(s));
        console.log("Query is ", query)
    
        logsLength =  db.collection("logs").countDocuments({Data: {$exists:true}, Data:{$in:query}, Date:{$gte: fromDate, $lt: toDate}});
        byDataPage =  db.collection("logs").find({Data: {$exists:true}, Data:{$in:query}, Date:{$gte: fromDate, $lt: toDate}}).project({_id:0, __v:0}).skip(pageSize * (currentPage-1)).limit(pageSize);
    
    }


    byDataPage = await byDataPage.toArray();
    logsLength = + (await logsLength).toString();


    return {"Length":logsLength, "logsPage": byDataPage}
}

module.exports = retrieveByData;