const express = require('express');
const app = express();
const cors = require('cors');
const bodyparser = require("body-parser");
const domain = require('./config');
const mongodb = require('./MongoDB/db');



const regadmin1 = require('./services/TransactionTracker/registeradmin1');
const regenrolluser1 = require('./services/TransactionTracker/regenrolluser1'); 
const login = require('./services/TransactionTracker/login');
const logout = require('./services/TransactionTracker/logout');
const trainmodel = require('./services/TransactionTracker/trainmodel');
const searchdata = require('./services/TransactionTracker/searchdata');
const returneddata = require('./services/TransactionTracker/accessdata');
const choosedata = require('./services/TransactionTracker/choosedata');
const AIservice = require('./services/TransactionTracker/AIservice');
const uploaddata = require('./services/TransactionTracker/uploaddata');

const getLogsByUser = require('./services/TransactionTracker/getLogsByUser');
const getLogsByData = require('./services/TransactionTracker/getLogsByData');
const getLogByHash = require('./services/TransactionTracker/getLogByHash');

const registerModel = require('./services/Reputation/registerModel');
const getModelInfo = require('./services/Reputation/getModelInfo');
const voteReputation = require('./services/Reputation/voteReputation');

const {keyverification} = require('./services/verifykey/keyverification');

const {EtlKeyVerification} = require('./services/verifykey/ETLKeyVerification');

//configure cors for allowing specific origins
const corsOptions = {
  origin: ['http://localhost:3000']
  }


app.use(bodyparser.json());



//register the admin 
regadmin1();

app.use(cors(corsOptions));



app.post('/tracker/register', regenrolluser1); 

app.post('/tracker/login',  keyverification, login); 

app.post('/tracker/logout', keyverification, logout); 

app.post('/tracker/searchdata', keyverification, searchdata); 

app.post('/tracker/returneddata', keyverification, returneddata); 

app.post('/tracker/choosedata', keyverification, choosedata);

app.post('/tracker/uploaddata', EtlKeyVerification, uploaddata); 

app.post('/tracker/aiservice',  keyverification, AIservice); 

app.post('/tracker/trainmodel', keyverification, trainmodel); 


// AUDITING MECHANISM

app.get('/tracker/getlogsbyuser',  keyverification, getLogsByUser);

app.get('/tracker/getlogsbydata',  keyverification, getLogsByData);

app.get('/tracker/getlogbyhash', keyverification, getLogByHash);






// AI MODEL REPUTATION

app.post('/tracker/reputation/registerservice',  keyverification, registerModel)

app.get('/tracker/reputation/getserviceinfo',  keyverification, getModelInfo);

app.post('/tracker/reputation/votereputation', keyverification, voteReputation);


app.listen(domain.SERVER_PORT, () => {
    console.log(`Example app listening at http://localhost:${domain.SERVER_PORT}`)
  })

mongodb.connect(domain.MONGODB_URL);