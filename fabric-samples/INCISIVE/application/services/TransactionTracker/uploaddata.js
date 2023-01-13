const { Gateway, Wallets} = require('fabric-network');
const path = require('path');


const channelName = process.env.CHANNEL_NAME;
const chaincodeName = process.env.CC_NAME;
const secret = process.env.HASH_SECRET;
const walletPath = path.join(__dirname, '..', '..', 'wallet');

const {ccps, msps, caClients, cas} = require('../../helpers/initalization');
const insertlog = require('../../MongoDB/controllers/insertlog');

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}



const uploaddata = async (req, res) => {

    //should be given by request or taken from a token (e.g. jwt)
    // const identity = req.body.user;
    let identity = res.locals.org;
    console.log(identity);
    let data = req.body.data;
    console.log(req.body)


    try {


        if (!(Array.isArray(data) && data.length)){

            throw new Error("No data have been selected!");
        }


        let ccp = ccps['incisive'];

        const wallet = await Wallets.newFileSystemWallet(path.join(walletPath, 'incisive'));


        //check if the identity eixsts
        // TODO: if identity is not registered in the blockchain, then the admin of the system should open the gateway
        // DONE: only the DP organization is needed, it will be taken from the API key
        // await wallet.get(identity);


        const gateway = new Gateway();

        console.log("Trying to connect to gateway...")
        await gateway.connect(ccp, {
            wallet,
            // identity: identity,
            identity: "admin@incisive-project.eu", // this is in case the user is not registered in the bc/platform
            discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
        });
        console.log("Connected!!!")

        // Build a network instance based on the channel where the smart contract is deployed
        const network = await gateway.getNetwork(channelName);

        // Get the contract from the network.
        const contract = network.getContract(chaincodeName, 'DataContract');


        console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
        let result= await contract.submitTransaction('UploadData', data, identity, secret);

        console.log('*** Result: committed');
        console.log(`*** Result: ${prettyJSONString(result.toString())}`);


        gateway.disconnect();


        let resultjson = JSON.parse(result.toString());


        //save log to mongodb
        let action = resultjson[0];
        console.log('action', action)
        let hash = resultjson[1];
        console.log('hash', hash)
        await insertlog(hash, action);

        res.status(200).send("OK!");

        
    }

    catch(error) {

        console.log('Upload data action submission failed with error: '+error);

        res.status(403).send('Upload data action submission failed with '+error)

    }
 
}

module.exports = uploaddata;