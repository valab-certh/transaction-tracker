const { Gateway, Wallets} = require('fabric-network');
const path = require('path');

const channelName = process.env.CHANNEL_NAME;
const chaincodeName = process.env.REPUTATION_CC_NAME;

const walletPath = path.join(__dirname,'..', '..', 'wallet');

const {ccps, msps, caClients, cas} = require('../../helpers/initalization');


const getModelInfo = async (req, res) => {

    let user = req.body.user;
    let serviceID = req.body.serviceID;
    // let user = "admin@incisive-project.eu";
    // let serviceID = "model 10";
    try{

        let ccp = ccps['incisive'];

        const wallet = await Wallets.newFileSystemWallet(path.join(walletPath, 'incisive'));

        await wallet.get(user);

        const gateway = new Gateway();

        console.log("Trying to connect to gateway...")
        await gateway.connect(ccp, {
            wallet,
            identity: user,
            discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
        });
        console.log("Connected!!!")

        // Build a network instance based on the channel where the smart contract is deployed
        const network = await gateway.getNetwork(channelName);

        // Get the contract from the network.
        const contract = network.getContract(chaincodeName);

        console.log('\n--> Evaluate Transaction: GetModelModel, function retrieves information for an AI service from the ledger');
        let model = await contract.evaluateTransaction('GetModel', serviceID);
        // let model = await contract.evaluateTransaction('GetAllAssets');
		console.log('*** Result: committed')

        // Disconnect from the gateway when the application is closing
        // This will close all connections to the network
        gateway.disconnect();

        let modelJSON = JSON.parse(model);

        let jsonString = JSON.stringify(modelJSON);
        fs.writeFile('AImodeldata.json', jsonString, (err) => {
            if (err) {
              console.error('Error writing JSON to file:', err);
              return;
            }
            console.log('JSON data has been written to file');
          });
        

        console.log("AI service info: ", modelJSON);

        res.status(200).send({"AI service": modelJSON});

    }

    catch(error){

        console.log("Getting information about an AI service failed with error: "+error);

        res.status(500).send({"Error": "Getting information about an AI service failed with error: "+error});
    }
}

module.exports = getModelInfo;