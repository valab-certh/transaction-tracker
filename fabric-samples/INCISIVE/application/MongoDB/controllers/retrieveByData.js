const mongoose = require('mongoose');
const db = mongoose.connection;


const retrieveByData = async (data_id) => {

    console.log(data_id)
    console.log(data_id[0])

    var byData;

    if (data_id.length == 1){
        let query = "\""+data_id+"\"";
        console.log("The query is ", query)
    
        byData =  db.collection("logs").find({Data: {$exists:true}, $text:{$search: query}}).project({_id:0, __v:0});
    }

    else {

        //  amp the data array to regular expressions so they can be searched in the query
        let query = data_id.map(s => new RegExp(s));
        console.log("Query is ", query)
    
        byData =  db.collection("logs").find({Data: {$exists:true}, Data:{$in:query}}).project({_id:0, __v:0});
    
    }


    let logs = await byData.toArray();


    return logs
}

module.exports = retrieveByData;