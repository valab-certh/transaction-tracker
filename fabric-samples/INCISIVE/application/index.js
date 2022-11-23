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
// const pseudonymize = require('./services/TransactionTracker/psudonymize');
const deidentify = require('./services/TransactionTracker/deidentify');
const annotate = require('./services/TransactionTracker/annotate');
const annotateAI = require('./services/TransactionTracker/annotateAI');
const qualitycheck = require('./services/TransactionTracker/qualitycheck');
const AIservice = require('./services/TransactionTracker/AIservice');
const uploaddata = require('./services/TransactionTracker/uploaddata');
const viewData = require('./services/TransactionTracker/viewData');


const getdata = require('./services/TransactionTracker/getdata');

const getLogsByUser = require('./services/TransactionTracker/getLogsByUser');
const getLogsByUserOrg = require('./services/TransactionTracker/getLogsByUserOrg');
const getLogsByData = require('./services/TransactionTracker/getLogsByData');


const {keyverification} = require('./services/verifykey/keyverification');


//configure cors for allowing specific origins
const corsOptions = {
  origin: ['http://localhost:3000']
  }


app.use(bodyparser.json());



//register an admin for each org (should be done once, only in the beginning of the app for each org (i guess))
regadmin1();

app.use(cors(corsOptions));

//use API key verification as middleware
app.use(keyverification);

//endpoint for registartion of a user
app.post('/tracker/register', regenrolluser1);

app.post('/tracker/removeuser', revokeuser);

app.post('/tracker/login', login);

app.post('/tracker/logout', logout);

app.post('/tracker/searchdata', searchdata);

app.post('/tracker/returneddata', returneddata);

app.post('/tracker/choosedata', choosedata);

app.post('/tracker/uploaddata', uploaddata);

app.post('/tracker/deidentify', deidentify);

app.post('/tracker/annotate', annotate);

app.post('/tracker/annotateai', annotateAI);

app.post('/tracker/qualitycheck', qualitycheck);

app.post('/tracker/viewdata', viewData)

app.post('/tracker/aiservice', AIservice);

app.post('/tracker/trainmodel', trainmodel);

app.get('/tracker/getlogsbyuser', getLogsByUser);

app.get('/tracker/getlogsbyuserorg', getLogsByUserOrg);

app.get('/tracker/getlogsbydata', getLogsByData);

app.post('/tracker/getdata', getdata);




app.listen(domain.SERVER_PORT, () => {
    console.log(`Example app listening at http://localhost:${domain.SERVER_PORT}`)
  })

mongodb.connect(domain.MONGODB_URL);