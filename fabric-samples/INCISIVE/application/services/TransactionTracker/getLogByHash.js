const { Gateway, Wallets} = require('fabric-network');
const path = require('path');


const channelName = process.env.CHANNEL_NAME;
const chaincodeName = process.env.DATASETS_CC_NAME;
const walletPath = path.join(__dirname, '..', '..', 'wallet');

// const makeccp = require('../helpers/makeccp');
const {ccps, msps, caClients, cas} = require('../../helpers/initalization');
const retrieveByHash =  require('../../MongoDB/controllers/retrieveByHash');


// TODO: check if user is admin (probably), and see about the middleware
const getLogByHash = async(req, res, next) => {

    const requestor = req.body.user;
    let hash = req.body.hash;
    const data_id = req.body.data_id;


    try {


        let ccp = ccps['incisive'];

        const wallet = await Wallets.newFileSystemWallet(path.join(walletPath, 'incisive'));

        //check if the identity eixsts
        const requestoridentity = await wallet.get(requestor);

        // if user exists, check if user is an admin and hence can check the logs
        if (requestoridentity) {
            console.log('OK! Registered user!!!');

        }
        else{

            console.log('User identity does not exist in wallet.... Not registered user');
            throw new Error('Not registered user');

        }

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

       let result  = await contract.evaluateTransaction('CheckDataPermissions', data_id);
        console.log(JSON.parse(result))

       gateway.disconnect();

        let log = await retrieveByHash(hash);

        let logJSON = JSON.parse(JSON.stringify(log));

        console.log(logJSON);


        res.status(200).send(logJSON)



        
       


    }

    catch(error) {

        console.log('Get log by hash failed with error: '+error);

        res.status(403).send({"Error":'Get log by hsah failed with : '+error})
        

    }
    
}
module.exports = getLogByHash;
