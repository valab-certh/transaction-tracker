const { Gateway, Wallets } = require('fabric-network');

const path = require('path');
const fs = require('fs');


const {ccps, msps, caClients, cas} = require('../../helpers/initalization');
const { revoke } = require('../../App Utils/CAUtil');
const insertlog = require('../../MongoDB/controllers/logs/insertlog');


const walletPath = path.join(__dirname, '..', '..', 'wallet');
const channelName = process.env.CHANNEL_NAME;
const chaincodeName = process.env.CC_NAME;
const secret = process.env.HASH_SECRET;

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}


const revokeuser  = async (req, res) => {


    let userid = req.body.user;


    let removepath;

    //get the right wallet according to the organization

    // let ca = cas['incisive'];
    // let msp = msps['incisive'];
    let ccp = ccps['incisive'];
    let caClient = caClients['incisive'];


    const wallet = await Wallets.newFileSystemWallet(path.join(walletPath, 'incisive'));

    // Create a new gateway instance for interacting with the fabric network.
    // In a real application this would be done as the backend server session is setup for
    // a user that has been verified.
    const gateway = new Gateway();


    try{

        console.log("Trying to connect to gateway...")
        await gateway.connect(ccp, {
            wallet,
            identity: userid,
            discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
        });
        console.log("Connected!!!")

        // Build a network instance based on the channel where the smart contract is deployed
        const network = await gateway.getNetwork(channelName);

        // Get the contract from the network.
        const contract = network.getContract(chaincodeName, 'UserContract');

        console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
        let result = await contract.submitTransaction('Revoke', userid, secret);
        console.log('*** Result: committed');
        let resultjson = JSON.parse(result.toString());
        console.log(`*** Result: ${prettyJSONString(result.toString())}`);
        // console.log("The result is:", action)

        //save log to mongodb
        let action = resultjson[0];
        console.log('action', action)
        let hash = resultjson[1];
        console.log('hash', hash)
        await insertlog(hash, action);

        let revokeidentity = await revoke(userid, wallet, caClient, channelName);

        console.log(revokeidentity);

        //delete user from wallet
        //fs.unlinkSync(walletPathOrg+'/'+userid+'.id');
        
    
        res.status(200).send(`OK! Successfully removed user ${userid}`);
    }

    catch (error){

        console.log(error);
        res.status(403).send(`Removal of user ${userid} failed...`);
    }

    finally {
        // Disconnect from the gateway when the application is closing
        // This will close all connections to the network
        gateway.disconnect();
    }

}

module.exports = revokeuser;