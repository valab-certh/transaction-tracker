const { Gateway, Wallets} = require('fabric-network');
const path = require('path');


const channelName = process.env.CHANNEL_NAME;
const chaincodeName = process.env.DATASETS_CC_NAME;

const walletPath = path.join(__dirname,'..', '..', 'wallet');

const {ccps, msps, caClients, cas} = require('../../helpers/initalization');
function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

// This service allows a user to get info about a specific dataset
const getDataInfo = async(req, res, next) => {

    const identity = req.body.user;
    const data = req.body.data;
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
            discovery: { enabled: true, asLocalhost: true }
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

        gateway.disconnect();


        res.status(200).send(JSON.parse(result));
        
    }

    catch(error) {

        console.log('Get info about data failed with '+error);

        res.status(403).send('Get info about data failed with '+error)
        

    }
    
}
module.exports = getDataInfo;