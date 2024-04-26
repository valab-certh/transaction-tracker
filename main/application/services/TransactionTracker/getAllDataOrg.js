const { Gateway, Wallets} = require('fabric-network');
const path = require('path');
const fs = require('fs');

const channelName = process.env.CHANNEL_NAME;
const chaincodeName = process.env.DATASETS_CC_NAME;


const walletPath = path.join(__dirname,'..', '..', 'wallet');


const {ccps, msps, caClients, cas} = require('../../helpers/initalization');

// This service allows a user to get info about all datasets under an organization
const getAllDataOrg = async(req, res, next) => {

    const identity = req.body.user;

    console.log(identity)

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
            discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
        });
        console.log("Connected!!!")

        // Build a network instance based on the channel where the smart contract is deployed
        const network = await gateway.getNetwork(channelName);

        // Get the contract from the network.
        console.log(chaincodeName)
        const datasetcontract = network.getContract(chaincodeName);

        console.log('\n--> Evaluate Transaction: GetDataset, function retieves info about a specific dataset');
        let result = await datasetcontract.evaluateTransaction('GetAllAssets');
        console.log('*** Result: committed');
        console.log(result)

        gateway.disconnect();
        let datasetarray = [];

        let resultJSON = JSON.parse(result);
        for (let i =0; i<resultJSON.length; i++){

            console.log(resultJSON[i].Record)
            datasetarray.push(resultJSON[i].Record)
        }

        let jsonString = JSON.stringify(resultJSON);
        fs.writeFile('data.json', jsonString, (err) => {
            if (err) {
              console.error('Error writing JSON to file:', err);
              return;
            }
            console.log('JSON data has been written to file');
          });


        res.status(200).send((datasetarray));
        
    }

    catch(error) {

        console.log('Get info about data failed with error: '+error);

        res.status(403).send('Get info about data failed with error: '+error)
        

    }
    
}
module.exports = getAllDataOrg;