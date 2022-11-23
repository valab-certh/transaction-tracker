const { Gateway, Wallets} = require('fabric-network');
const path = require('path');


const channelName = process.env.CHANNEL_NAME;
const chaincodeName = process.env.DATASETS_CC_NAME;
const walletPath = path.join(__dirname, '..', '..', 'wallet');

// const makeccp = require('../helpers/makeccp');
const {ccps, msps, caClients, cas} = require('../../helpers/initalization');
const retrieveByData= require('../../MongoDB/controllers/retrieveByData');

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}



// TODO: if need to also check user can only check about data he uploaded
// If the above check is required, what happens with data that have been deleted?
// TODO: what happens if data is given as array e.g., [dataset1, dataset 2, ...]
const getLogsByData = async(req, res, next) => {

    const data_id = req.body.data_id;
    const requestor = req.body.user;


    try {


        let ccp = ccps['incisive'];

        const wallet = await Wallets.newFileSystemWallet(path.join(walletPath, 'incisive'));

        //check if the identity eixsts
        const requestoridentity = await wallet.get(requestor);

        // if user exists, check if user is an admin and hence can check the logs
        if (requestoridentity) {
            console.log('OK! Registered user!!!');

            const gateway = new Gateway();


            console.log("Trying to connect to gateway...")
            await gateway.connect(ccp, {
                wallet,
                identity: requestoridentity,
                discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
            });
            console.log("Connected!!!")

            // Build a network instance based on the channel where the smart contract is deployed
            const network = await gateway.getNetwork(channelName);

            // Get the contract from the network.
            const contract = network.getContract(chaincodeName);


            // try {

                await contract.evaluateTransaction('CheckDataLogs', data_id);

            // }

            // catch(err){

            //     throw new Error (err)
            // }

            gateway.disconnect();
        }



        let logs = await retrieveByData(data_id);
        console.log(logs.toString())
        let logsjson = JSON.parse(JSON.stringify(logs));
        console.log(logsjson)
        res.status(200).send(logsjson);
        
        
    }

    catch(error) {

        console.log('Get logs by data failed with error: '+error);

        res.status(403).send('Get logs by data failed with : '+error)
        

    }
    
}
module.exports = getLogsByData;