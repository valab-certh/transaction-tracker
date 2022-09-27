const { Gateway, Wallets} = require('fabric-network');
const path = require('path');
const fs = require('fs');
const insertlog = require('../../MongoDB/controllers/insertlog');

const channelName = process.env.CHANNEL_NAME;
const chaincodeName = process.env.CC_NAME;

const secret = process.env.HASH_SECRET;
console.log(secret)
console.log(typeof secret);


const walletPath = path.join(__dirname,'..', '..', 'wallet');


const {ccps, msps, caClients, cas} = require('../../helpers/initalization');
function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}


const login = async(req, res, next) => {

    //should be given by request or taken from a token (e.g. jwt)
    const identity = req.body.user;

    try {

        //ccp = makeccp('incisive');
        let ccp = ccps['incisive'];

        const wallet = await Wallets.newFileSystemWallet(path.join(walletPath, 'incisive'));

        //check if the identity eixsts
        const exists = await wallet.get(identity);
        if (exists) {
            console.log('OK! Registered user!!!');
        }
        else{

            console.log('User identity does not exist in wallet.... Not registered user');
            res.status(403).send('User identity does not exist in wallet.... Not registered user')
            return;
        }

        // Create a new gateway instance for interacting with the fabric network.
        // In a real application this would be done as the backend server session is setup for
        // a user that has been verified.
        const gateway = new Gateway();

        // setup the gateway instance
        // The user will now be able to create connections to the fabric network and be able to
        // submit transactions and query. All transactions submitted by this gateway will be
        // signed by this user using the credentials stored in the wallet.

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
            const contract = network.getContract(chaincodeName, 'UserContract');


            console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
            let result = await contract.submitTransaction('Login', identity, secret);
            console.log('*** Result: committed');

            let resultjson = JSON.parse(result.toString());
            console.log(`*** Result: ${prettyJSONString(result.toString())}`);
            // console.log("The result is:", action)

            gateway.disconnect();

            //save log to mongodb
            let action = resultjson[0];
            console.log('acyion', action)
            let hash = resultjson[1];
            console.log('hash', hash)
            await insertlog(hash, action);


            res.status(200).send("OK!");
        
    }

    catch(error) {

        console.log('Login submition failed with error: '+error);

        res.status(403).send('Login submition failed ...')
        

    }
    
}
module.exports = login;