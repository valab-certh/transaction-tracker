const mongoose = require('mongoose');
const Log = require('../../models/log.model');
const writeFailedTx = require('./writeFailedTx');



const insertlog = async (hash, log) => {
    
    let newlog;
    console.log("Log is ", log)
    console.log("User ", log.User)
    console.log("Date ", log.Date)
    console.log(typeof(log))


    try{    


            newlog = new Log({

                _id: new mongoose.Types.ObjectId(),
                hash: hash,
                ID: log.ID,
                User:log.User,
                Date: log.Date,
                Organisation: log.Organisation,
                Role:log.Role,
                Action: log.Action,
                UserRegistered:log.UserRegistered,
                Data: log.Data,
                Query: log.Query,
                ModelName: log.ModelName,
                AIservice: log.AIservice
            });
        
 

        await newlog.save();

    }

    catch(err){

        let failedTx = await writeFailedTx(hash, log);
        throw new Error(`Mongo Error: ${err}... Log ${JSON.stringify(failedTx)} saved on ledger.`)

    }

    return newlog;

}

module.exports = insertlog;
