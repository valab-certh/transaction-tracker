const { Gateway, Wallets} = require('fabric-network');
const path = require('path');
const fs = require('fs');

const channelName = process.env.CHANNEL_NAME;
const chaincodeName = process.env.CC_NAME;
const secret = process.env.HASH_SECRET;
const walletPath = path.join(__dirname,'..', '..', 'wallet');


const {ccps, msps, caClients, cas} = require('../../helpers/initalization');
const insertlog = require('../../MongoDB/controllers/logs/insertlog');


function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

// This service tracks the training of an AI model in the platform
const trainmodel = async(req, res, next) => {

    const identity = req.body.user;
    let modelname = req.body.modelname;
    let data = req.body.data;


    try {

        let ccp = ccps['Org1'];


        const wallet = await Wallets.newFileSystemWallet(path.join(walletPath));


        //check if the identity eixsts
        await wallet.get(identity);

        const gateway = new Gateway();


            console.log("Trying to connect to gateway...")
            await gateway.connect(ccp, {
                wallet,
                identity: identity,
                discovery: { enabled: true, asLocalhost: true }
            });
            console.log("Connected!!!")

            // Build a network instance based on the channel where the smart contract is deployed
            const network = await gateway.getNetwork(channelName);

            // Get the contract from the network.
            const contract = network.getContract(chaincodeName, 'AIContract');

            //let timestamp = Date.now();

            console.log('\n--> Submit Transaction: TrainModel, function tracks the training of an AI model in the platform');
            let result = await contract.submitTransaction('TrainModel', identity,  modelname, data, secret);
            console.log('*** Result: committed');
            let resultjson = JSON.parse(result.toString());
            console.log(`*** Result: ${prettyJSONString(result.toString())}`);

            //save log to mongodb
            let action = resultjson[0];
            console.log('action', action)
            let hash = resultjson[1];
            console.log('hash', hash)
            await insertlog(hash, action);
        
            // Disconnect from the gateway when the application is closing
            // This will close all connections to the network
            gateway.disconnect();

            res.status(200).send("OK!");

        
    }

    catch(error) {

        console.log('Training a model action submission failed with error: '+error);

        res.status(403).send('Training a model  action submission failed with '+error)
        

    }
    
}
module.exports = trainmodel;