const mongoose = require('mongoose');
const db = mongoose.connection;


const retrieveByUserOrg = async (username, org) => {
    console.log(org)
    console.log(username)

    var byuser ;

    if (username){
        console.log(username);
        byuser =  db.collection("logs").find({User: username, Org: org}).project({_id:0, __v:0});
        console.log("1",await byuser.toArray())
    }

    else {

        byuser =  db.collection("logs").find({Org: org}).project({_id:0, __v:0});
        console.log("2", await byuser.toArray())

    }

    // console.log(byuser)
    let logs = await byuser.toArray();
    console.log(logs)

    return logs
}

module.exports = retrieveByUserOrg;