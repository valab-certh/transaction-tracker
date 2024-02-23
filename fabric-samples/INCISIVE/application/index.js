//const { application } = require('express');
const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs')
const bodyparser = require("body-parser");

const domain = require('./config');
const mongodb = require('./MongoDB/db')



const regadmin1 = require('./services/TransactionTracker/registeradmin1');
const regenrolluser1 = require('./services/TransactionTracker/regenrolluser1'); 
const revokeuser = require('./services/TransactionTracker/revokeuser');
const login = require('./services/TransactionTracker/login');
const logout = require('./services/TransactionTracker/logout');
const trainmodel = require('./services/TransactionTracker/trainmodel');
const searchdata = require('./services/TransactionTracker/searchdata');
const returneddata = require('./services/TransactionTracker/accessdata');
const choosedata = require('./services/TransactionTracker/choosedata');
const deidentify = require('./services/TransactionTracker/deidentify');
const annotate = require('./services/TransactionTracker/annotate');
const annotateAI = require('./services/TransactionTracker/annotateAI');
const qualitycheck = require('./services/TransactionTracker/qualitycheck');
const AIservice = require('./services/TransactionTracker/AIservice');
const uploaddata = require('./services/TransactionTracker/uploaddata');
const viewData = require('./services/TransactionTracker/viewData');

const getDataInfo = require('./services/TransactionTracker/getDataInfo');
const getAllDataOrg = require('./services/TransactionTracker/getAllDataOrg');
const getLogsByUser = require('./services/TransactionTracker/getLogsByUser');
const getLogsByUserOrg = require('./services/TransactionTracker/getLogsByUserOrg');
const getLogsByData = require('./services/TransactionTracker/getLogsByData');
const getLogByHash = require('./services/TransactionTracker/getLogByHash');

const registerModel = require('./services/Reputation/registerModel');
const getModelInfo = require('./services/Reputation/getModelInfo');
const voteReputation = require('./services/Reputation/voteReputation');

// RESTORATION SERVICES
const reUpload = require('./services/Restore/reUploadData');
const reRegister = require('./services/Restore/reRegisterUsers');
const reRegisterModel = require('./services/Restore/reRegisterModel');

const {keyverification} = require('./services/verifykey/keyverification');

const {EtlKeyVerification} = require('./services/verifykey/ETLKeyVerification');

//configure cors for allowing specific origins
const corsOptions = {
  origin: ['http://localhost:3000']
  }


app.use(bodyparser.json());



//register an admin for each org (should be done once, only in the beginning of the app for each org (i guess))
regadmin1();

app.use(cors(corsOptions));

//use API key verification as middleware
// app.use(keyverification);

//endpoint for registartion of a user
app.post('/tracker/register', regenrolluser1); //integrated

app.post('/tracker/removeuser', keyverification, revokeuser);

app.post('/tracker/login',  keyverification, login); //integrated

app.post('/tracker/logout', keyverification, logout); //integrated

app.post('/tracker/searchdata', keyverification, searchdata); // to be integrated

app.post('/tracker/returneddata', keyverification, returneddata); // to be integrated

app.post('/tracker/choosedata', keyverification, choosedata); // to be integrated

app.post('/tracker/uploaddata', EtlKeyVerification, uploaddata); // to be integrated

app.post('/tracker/deidentify', keyverification, deidentify);

app.post('/tracker/annotate', keyverification, annotate);

// app.post('/tracker/annotateai', annotateAI);

app.post('/tracker/qualitycheck', keyverification, qualitycheck);

app.post('/tracker/viewdata', keyverification, viewData)

// app.post('/tracker/aiservice', keyverification, AIservice); // to be integrated
app.post('/tracker/aiservice',  keyverification, AIservice); // to be integrated

app.post('/tracker/trainmodel', keyverification, trainmodel); // to be integrated


// AUDITING MECHANISM

// app.get('/tracker/getlogsbyuser', keyverification, getLogsByUser);
app.get('/tracker/getlogsbyuser',  keyverification, getLogsByUser);

// app.get('/tracker/getlogsbyuserorg', keyverification, getLogsByUserOrg);

app.get('/tracker/getlogsbydata',  keyverification, getLogsByData);

app.get('/tracker/getlogbyhash', keyverification, getLogByHash);

app.get('/tracker/getdatainfo',  keyverification, getDataInfo);




// XAI MODEL REPUTATION keyverification,

app.post('/tracker/reputation/registerservice',  keyverification, registerModel)

app.get('/tracker/reputation/getserviceinfo',  keyverification, getModelInfo);

app.post('/tracker/reputation/votereputation', keyverification, voteReputation);


// RESTORATION SERVICES
app.get('/tracker/getalldataorg',  getAllDataOrg);
app.post ('/tracker/reupload', reUpload)
app.post ('/tracker/reregister', reRegister)
app.post ('/tracker/remodel', reRegisterModel)


app.listen(domain.SERVER_PORT, () => {
    console.log(`Example app listening at http://localhost:${domain.SERVER_PORT}`)
  })

mongodb.connect(domain.MONGODB_URL);