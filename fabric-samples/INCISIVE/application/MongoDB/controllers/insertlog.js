const mongoose = require('mongoose');
const Log = require('../log.model');



const insertlog = async (hash, log) => {
    
    let newlog;
    console.log("Log is ", log)
    console.log("User ", log.User)
    console.log(typeof(log))


    try{    


            newlog = new Log({

                _id: new mongoose.Types.ObjectId(),
                hash: hash,
                ID: log.ID,
                User:log.User,
                Date: log.Date,
                // Time: log.Time,
                Organisation: log.Organisation,
                Role:log.Role,
                Action: log.Action,
                UserRegistered:log.UserRegistered,
                Data: log.Data,
                Query: log.Query,
                ModelName: log.ModelName,
                AIservice: log.AIservice
            });
        
 
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
