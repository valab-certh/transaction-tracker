const { Gateway, Wallets} = require('fabric-network');
const path = require('path');
const fs = require('fs');
const insertlog = require('../../MongoDB/controllers/logs/insertlog');

const channelName = process.env.CHANNEL_NAME;
const chaincodeName = process.env.DATASETS_CC_NAME;


const walletPath = path.join(__dirname,'..', '..', 'wallet');


const {ccps, msps, caClients, cas} = require('../../helpers/initalization');

// this service allows a user to get info about all datasets under an organization
const getAllDataOrg = async(req, res, next) => {

    //should be given by request or taken from a token (e.g. jwt)
    const identity = req.body.user;

    console.log(identity)

    try {

        //ccp = makeccp('incisive');
        let ccp = ccps['incisive'];

        const wallet = await Wallets.newFileSystemWallet(path.join(walletPath, 'incisive'));

        //check if the identity eixsts
        await wallet.get(identity);
        // if (exists) {
        //     console.log('OK! Registered user!!!');
        // }
        // else{

        //     console.log('User identity does not exist in wallet.... Not registered user');
        //     res.status(403).send('User identity does not exist in wallet.... Not registered user')
        //     return;
        // }


        const gateway = new Gateway();


        console.log("Trying to connect to gateway...")
        await gateway.connect(ccp, {
            wallet,
            identity: identity,
            discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
        });
        console.log("Connected!!!")

        // Build a network instance based on the channel where the smart contract is deployed
        const network = await gateway.getNetwork(channelName);

        // Get the contract from the network.
        console.log(chaincodeName)
        const datasetcontract = network.getContract(chaincodeName);

        console.log('\n--> Evaluate Transaction: GetDataset, function retieves info about a specific dataset');
        let result = await datasetcontract.evaluateTransaction('GetDatasetOrg');
        console.log('*** Result: committed');
        console.log(result)

        gateway.disconnect();
        let datasetarray = [];

        let resultJSON = JSON.parse(result);
        for (let i =0; i<resultJSON.length; i++){

            console.log(resultJSON[i].Record)
            datasetarray.push(resultJSON[i].Record)
        }


        res.status(200).send((datasetarray));
        
    }

    catch(error) {

        console.log('Get info about data failed with error: '+error);

        res.status(403).send('Get info about data failed with error: '+error)
        

    }
    
}
module.exports = getAllDataOrg;