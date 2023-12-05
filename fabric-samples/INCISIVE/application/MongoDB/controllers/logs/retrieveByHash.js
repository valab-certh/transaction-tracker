
const mongoose = require('mongoose');
const db = mongoose.connection;


const retrieveByHash = async (hash) => {
    
    console.log("Requested hash is ",hash)
    

    let byHash =  db.collection("logs").find({hash: hash}).project({_id:0, __v:0});

    let log = await byHash.toArray();
    log = log[0];
    
    return {"Log":log}
}

module.exports = retrieveByHash;