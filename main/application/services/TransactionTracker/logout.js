const { Gateway, Wallets} = require('fabric-network');
const path = require('path');

const channelName = process.env.CHANNEL_NAME;
const chaincodeName = process.env.CC_NAME;
const secret = process.env.HASH_SECRET;
const walletPath = path.join(__dirname, '..', '..', 'wallet');


const {ccps, msps, caClients, cas} = require('../../helpers/initalization');
const insertlog = require('../../MongoDB/controllers/logs/insertlog');

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

// This service tracks the log out of a user
const logout = async(req, res, next) => {

    const identity = req.body.user;


    try {

        let ccp = ccps['Org1'];

        const wallet = await Wallets.newFileSystemWallet(path.join(walletPath));

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
            const contract = network.getContract(chaincodeName, 'UserContract');

            console.log('\n--> Submit Transaction: Logout, function tracks the logout of a user');
            let result = await contract.submitTransaction('Logout', identity, secret);
            console.log('*** Result: committed');
            let resultjson = JSON.parse(result.toString());
            console.log(`*** Result: ${prettyJSONString(result.toString())}`);


            gateway.disconnect();

            //save log to mongodb
            let action = resultjson[0];
            console.log('action', action)
            let hash = resultjson[1];
            console.log('hash', hash)
            await insertlog(hash, action);

            res.status(200).send("OK!");
        
        
    }

    catch(error) {

        console.log('Logout submition failed with error: '+error);

        res.status(403).send('Logout submition failed with error: '+error)
        

    }
    
}
module.exports = logout;