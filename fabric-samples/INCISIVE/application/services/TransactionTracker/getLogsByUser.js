const { Gateway, Wallets} = require('fabric-network');
const path = require('path');


const channelName = process.env.CHANNEL_NAME;
const chaincodeName = process.env.CC_NAME;
const walletPath = path.join(__dirname, '..', '..', 'wallet');

// const makeccp = require('../helpers/makeccp');
const {ccps, msps, caClients, cas} = require('../../helpers/initalization');
const retrieveByUser= require('../../MongoDB/controllers/retrieveByUser');

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}



// TODO: check if user is admin (probably), and see about the middleware
const getLogsByUser = async(req, res, next) => {

    const identity = req.body.user;
    const requestor = req.body.requestor;


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
            throw new Error('User identity does not exist in wallet.... Not registered user');

        }

        //check if the identity eixsts
        // TODO: check if this is really needed
        if (identity){
            const exists = await wallet.get(identity);
            if (exists) {
                console.log('OK! Registered user!!!');
            }
            else{
    
                console.log('User identity does not exist in wallet.... Not registered user');
                throw new Error('User identity does not exist in wallet.... Not registered user')
            }
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
        const contract = network.getContract(chaincodeName, 'UserContract');

        try {
            await contract.evaluateTransaction('CheckRole', "ADMINISTRATOR");
        }

        catch(err){
            throw new Error(err)
        }

        gateway.disconnect();



        let logs = await retrieveByUser(req.body.user);
        console.log(logs.toString())
        let logsjson =JSON.parse(JSON.stringify(logs));
        console.log(logsjson)
        res.status(200).send(logsjson);
        
        
    }

    catch(error) {

        console.log('Get logs by user failed with error: '+error);

        res.status(403).send('Get logs by user failed with error: '+error)
        

    }
    
}
module.exports = getLogsByUser;