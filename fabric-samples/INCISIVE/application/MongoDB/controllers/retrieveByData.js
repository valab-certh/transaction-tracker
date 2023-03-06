const mongoose = require('mongoose');
const db = mongoose.connection;


const retrieveByData = async (data_id, fromDate, toDate) => {

    console.log(data_id)
    console.log(data_id[0])

    var byData;

    fromDate = new Date (fromDate);
    toDate = new Date(toDate);

        //  if same day change time to include whole day
    if (fromDate == toDate){

        toDate.setUTCHours(23,59,59,999);
    }

    if (data_id.length == 1){
        let query = "\""+data_id+"\"";
        console.log("The query is ", query)
    
        byData =  db.collection("logs").find({Data: {$exists:true}, $text:{$search: query}, Date:{$gte: fromDate, $lt: toDate}}).project({_id:0, __v:0});
    }

    else {

        //  amp the data array to regular expressions so they can be searched in the query
        let query = data_id.map(s => new RegExp(s));
        console.log("Query is ", query)
    
        byData =  db.collection("logs").find({Data: {$exists:true}, Data:{$in:query}, Date:{$gte: fromDate, $lt: toDate}}).project({_id:0, __v:0});
    
    }


    let logs = await byData.toArray();


    return logs
}

module.exports = retrieveByData;