const mongoose = require('mongoose');
const Log = require('../log.model');



const insertlog = async (hash, log) => {
    
    let newlog;
    console.log("Log is ", log)
    console.log("User ", log.Actor)
    console.log(typeof(log))

    if (log.hasOwnProperty('Data')) {}

    try{    
        
        if (log.hasOwnProperty('Data')) {        
            
            
            newlog = new Log({

                _id: new mongoose.Types.ObjectId(),
                hash: hash,
                User:log.Actor,
                Timestamp: log.Timestamp,
                Org: log.Org,
                Role:log.Role,
                Action: log.Action,
                Data: log.Data
        })

        
        }


        else{

            newlog = new Log({

                _id: new mongoose.Types.ObjectId(),
                hash: hash,
                User:log.Actor,
                Timestamp: log.Timestamp,
                Org: log.Org,
                Role:log.Role,
                Action: log.Action,
                Data: []
            })
    
        }
    }
    catch(err){

        console.log(err);

        return err;
    }

    try {
        await newlog.save();

    }

    catch(err){

        console.log(err);
        return err;

    }

    return newlog;

}

module.exports = insertlog;
