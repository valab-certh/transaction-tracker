const { Gateway, Wallets} = require('fabric-network');
const path = require('path');


const channelName = process.env.CHANNEL_NAME;
const chaincodeName = process.env.CC_NAME;
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
const getData = async(req, res, next) => {

    const data_id = req.body.data_id;
    const user = req.body.user;



    try {


        let ccp = ccps['incisive'];

        const wallet = await Wallets.newFileSystemWallet(path.join(walletPath, 'incisive'));

        //check if the identity eixsts
        const identity = await wallet.get(user);

        // if user exists, check if user is an admin and hence can check the logs



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
            const contract = network.getContract(chaincodeName, 'DatasetsContract');

            // let data = await contract.evaluateTransaction('ReadData', data_id);
            let data = await contract.evaluateTransaction('ReadData', data_id);
            console.log(data)
            console.log(prettyJSONString(data.toString()));

            gateway.disconnect();

            res.status(200).send(data);

        
    }

    catch(error) {

        console.log('Get logs by data failed with error: '+error);

        res.status(403).send('Get logs by data failed with error: '+error)
        

    }
    
}
module.exports = getData;