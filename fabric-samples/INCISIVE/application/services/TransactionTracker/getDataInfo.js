const { Gateway, Wallets} = require('fabric-network');
const path = require('path');
const fs = require('fs');
const insertlog = require('../../MongoDB/controllers/logs/insertlog');

const channelName = process.env.CHANNEL_NAME;
const chaincodeName = process.env.DATASETS_CC_NAME;

const secret = process.env.HASH_SECRET;
console.log(secret)
console.log(typeof secret);


const walletPath = path.join(__dirname,'..', '..', 'wallet');


const {ccps, msps, caClients, cas} = require('../../helpers/initalization');
function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

// this service allows a user to get info about a specific dataset
const getDataInfo = async(req, res, next) => {

    //should be given by request or taken from a token (e.g. jwt)
    const identity = req.body.user;
    const data = req.body.data;
    console.log(identity)

    try {

        //ccp = makeccp('incisive');
        let ccp = ccps['incisive'];

        const wallet = await Wallets.newFileSystemWallet(path.join(walletPath, 'incisive'));

        //check if the identity eixsts
        await wallet.get(identity);
        // if (exists) {
            // console.log('OK! Registered user!!!');
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
        const contract = network.getContract(chaincodeName);


        console.log('\n--> Evaluate Transaction: GetDataset, function retieves info about a specific dataset');
        let result = await contract.evaluateTransaction('GetDataset', data);
        console.log('*** Result: committed');
        console.log(`*** Result: ${prettyJSONString(result.toString())}`);
        // console.log("The result is:", action)

        gateway.disconnect();


        res.status(200).send(JSON.parse(result));
        
    }

    catch(error) {

        console.log('Get info about data failed with '+error);

        res.status(403).send('Get info about data failed with '+error)
        

    }
    
}
module.exports = getDataInfo;