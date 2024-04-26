# Transaction Tracker 

Transaction Tracker is an application that is responsible for tracking important actions performed in a platform for sharing of medical data and executing AI pipelines. It includes the necessary Smart Contracts and Chaincodes, and an API. The application also offers a reputation system, based on user feedback, for any AI services that are offered in the platform. It relies on Hyperledger Fabric 2.3 as the underlying network and it is configured to work with the default setting of the Fabric test-network, run on Ubutu OS.

# Pre-requisites

Before running this application you need to download and install Hyperledger Fabric v2.3. Please refer to the official Fabric docs on how todo so:https://hyperledger-fabric.readthedocs.io/en/release-2.3/getting_started.html

# Installation

1. Clone the current repository and place it inside the /fabric-sample directory. 
2. Next, bring up the network, using Certificate Authorities, and create the channel. Please refer to the official Fabric docs: https://hyperledger-fabric.readthedocs.io/en/release-2.3/test_network.html. 
3. Next, deploy the necessary chaincodes on the network's peers, following the instructionsfrom official Fabric docs: https://hyperledger-fabric.readthedocs.io/en/release-2.3/test_network.html#starting-a-chaincode-on-the-channel. 
For your convenience, instead, you can deploy the chaincodes of Transaction Tracker, as follows.
From the /fabric-samples/test-network directory, run in your CLI the following commands:

`./network.sh deployCC -ccn transactiontracker -ccp ../main/chaincode/TransactionTracker -ccl javascript`

The above command deploys the Transaction Tracker chaincode. This chaincode is responsible for recordnig on the ledger all the defined actions of users. It is mandatory to be deployed for the Tracker to work properly.

`./network.sh deployCC -ccn datasets -ccp ../main/chaincode/Datasets -ccl javascript`

The above command deploys the Datasets chaincode. This chaincode is responsible for recordnig on the ledger the metadata of the shared data. It is mandatory to be deployed for the Tracker to work properly.

`./network.sh deployCC -ccn reputation -ccp ../main/chaincode/Reputation -ccl javascript`

The above command deploys the Reputation chaincode. This chaincode is responsible for calculating the reputation score of the AI services, based on user feedback from answering a set of weighted questions. The questions can be found in the /main/application/services/Reputation directory, while the weights are included in the Reputation chaincode. The deployment of this chaincode is optional.

4. You need to create an .env file including the following:

| Key | Value | 
| --- | ----- |
| CHANNEL_NAME | mychannel |
| CC_NAME | transactiontracker |
| DATASETS_CC_NAME | datasets |
| REPUTATION_CC_NAME | reputation |
| NODE_ENV | developement/production |
| HASH_SECRET | your own value |
| MONGO_USER | your own MongoDB user |
| MONGO_PASS | the MongoDB user's password |

These variables are essential for the application to work. You should define a hash secret to create the encrypted action that will be stored in the ledger, and a user for your MongoDB instance.

5. Finally, from the CLI move on to /main directory, and run: `nodemon index.js`, to start running the app. 
6. In a separate CLI panel, move on to the /main/application/servces/TransactionTracker directory and run `node registerplatformadmin.js`, to register the administrator of your platform.

# API Documentation

#### Logging mechanism 

* */tracker/register*: This service is responsible for registering users in the Fabric network, and records this action on the ledger and in MongoDB.
* */tracker/login*: This service is responsible for recording the log ins of the user in the platform. It stores the action on the ledger and in MongoDB.
* */tracker/logout*: This service is responsible for recording the log outs of the user in the platform. It stores the action on the ledger and in MongoDB.
* */tracker/searchdata*: This service is responsible for recording the queries of users, when they search for data in the platform. It stores the action on the ledger and in MongoDB.
* */tracker/returneddata*: This service is responsible for recording the results returned from the user queries for data. It stores the action on the ledger and in MongoDB.
* */tracker/choosedata*: This service is responsible for recording the data that user selects and wants to use (from the pool of the returned results). It stores the action on the ledger and in MongoDB.
* */tracker/uploaddata*: This service is responsible for recording the uploading of data in the platform. It stores the action on the ledger and in MongoDB. It also stores metadata about the uploaded data n the ledger.
* */tracker/aiservice*: This service is responsible for recording the use of an AI service by the user. It stores the action on the ledger and in MongoDB.
* */tracker/trainmodel*: This service is responsible for recording the training of an AI model by the user in the platform. It stores the action on the ledger and in MongoDB.

#### Auditing mechanism

* */tracker/getlogsbyuser*: This service is responsible for fetching all the recorded logs performed by a specific user.
* */tracker/getlogsbydata*: This service is responsible for fetching all the recorded logs that were performed using a specific dataset from a data provider.
* */tracker/getlogbyhash*: This service is a utility service, responsible for fetching a log based on its hash.

#### AI services reputation

* */tracker/reputation/registerservice*: This service records a new AI service on the ledger.
* */tracker/reputation/getserviceinfo*: This service retrieves the information for an AI service, including its reputation, from the ledger.
* */tracker/reputation/votereputation*: This service receives as input the user's answers on the questions, calculates the reputation score for the AI service and then stores it on the ledger.


# License
The Transaction Tracker source code files are made available under the MIT License, located in the LICENSE file
