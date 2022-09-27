const mongoose = require('mongoose');
const Log = require('../log.model');



const insertlog = async (hash, log) => {
    
    let newlog;

    try{    
        
        newlog = new Log({

            _id: new mongoose.Types.ObjectId(),
            hash: hash,
            log:log
        
        })
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
