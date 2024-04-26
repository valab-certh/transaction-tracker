const { Gateway, Wallets} = require('fabric-network');
const path = require('path');


const channelName = process.env.CHANNEL_NAME;
const chaincodeName = process.env.CC_NAME;
const secret = process.env.HASH_SECRET;
const PlatformAdminId = process.env.PLATFORM_ADMIN_ID;
const walletPath = path.join(__dirname, '..', '..', 'wallet');

const {ccps, msps, caClients, cas} = require('../../helpers/initalization');
const insertlog = require('../../MongoDB/controllers/logs/insertlog');

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}


// This service is used to track the uploading of data and record metadata about it on the ledger
const uploaddata = async (req, res) => {

    let identity = req.body.org;
    console.log(identity);
    let data = req.body.data;
    console.log(req.body)


    try {


        if (!(Array.isArray(data) && data.length)){

            throw new Error("No data have been selected!");
        }

        let ccp = ccps['Org1'];

        const wallet = await Wallets.newFileSystemWallet(path.join(walletPath));

        const gateway = new Gateway();

        console.log("Trying to connect to gateway...")
        await gateway.connect(ccp, {
            wallet,
            identity: PlatformAdminId, // it is called by the etl tool
            discovery: { enabled: true, asLocalhost: true } 
        });
        console.log("Connected!!!")

        // Build a network instance based on the channel where the smart contract is deployed
        const network = await gateway.getNetwork(channelName);

        // Get the contract from the network.
        const contract = network.getContract(chaincodeName, 'DataContract');


        console.log('\n--> Submit Transaction: UploadData, function tracks the uploading of data and record metadata about it on the ledger');
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