const mongoose = require('mongoose');
const db = mongoose.connection;


const retrieveByUserOrg = async (username, org) => {
    console.log(org)
    console.log(username)

    var byuser ;


    if (username){
        console.log(username);
        byuser =  db.collection("logs").find({User: username, Organisation: org}).project({_id:0, __v:0});

    }

    else {

        byuser =  db.collection("logs").find({Organisation: org}).project({_id:0, __v:0});

    }

    let logs = await byuser.toArray();
    return logs
}

module.exports = retrieveByUserOrg;