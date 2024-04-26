const { Gateway, Wallets} = require('fabric-network');
const path = require('path');
const channelName = process.env.CHANNEL_NAME;
const chaincodeName = process.env.CC_NAME;

const secret = process.env.HASH_SECRET;
console.log(secret)
console.log(typeof secret);


const walletPath = path.join(__dirname,'..', '..', 'wallet');


const {ccps, msps, caClients, cas} = require('../../../helpers/initalization');
function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}


const writeFailedTx = async(hash, log) => {

    console.log ("LOG IS ", log)
    console.log("HASH is", hash)

    try {
        const identity = log.User;
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
            discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
        });
        console.log("Connected!!!")

        // Build a network instance based on the channel where the smart contract is deployed
        const network = await gateway.getNetwork(channelName);

        // Get the contract from the network.
        const contract = network.getContract(chaincodeName, 'UserContract');

        console.log('\n--> Submit Transaction: WriteFailedTx, function writes the failed transaction to the ledger');
        let result = await contract.submitTransaction('WriteFailedTx', hash, JSON.stringify(log));
        console.log('*** Result: committed');

        let resultjson = JSON.parse(result.toString());
        console.log(`*** Result: ${prettyJSONString(result.toString())}`);
 

        gateway.disconnect();
        return resultjson;
    }
    catch(error) {

        console.log('Write failed tx failed with error: '+error);

        return ('Write failed tx failed with error: '+error)
        

    }
}

module.exports = writeFailedTx;