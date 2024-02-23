const { Gateway, Wallets} = require('fabric-network');
const path = require('path');
const fs = require('fs');


const channelName = process.env.CHANNEL_NAME;
const chaincodeName = process.env.DATASETS_CC_NAME;
const secret = process.env.HASH_SECRET;
const walletPath = path.join(__dirname, '..', '..', 'wallet');

const {ccps, msps, caClients, cas} = require('../../helpers/initalization');
const insertlog = require('../../MongoDB/controllers/logs/insertlog');

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}



const REuploaddata = async (req, res) => {

    //should be given by request or taken from a token (e.g. jwt)
    // const identity = req.body.user;
    // let identity = res.locals.org;
    // let identity = "admin@incisve-project.eu";
    // console.log(identity);
    // let data = req.body.data;
    console.log(req.body)

    const filePath = path.join(__dirname, 'data.json');
    let jsonData;
    try {


        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
              console.error('Error reading file:', err);
              return;
            }
            
            try {
              // Parse the JSON data
             jsonData = JSON.parse(data);
              
              // Now you can work with jsonData
              console.log('Read JSON data:', jsonData);
            } catch (parseError) {
              console.error('Error parsing JSON data:', parseError);
            }
          });


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
        const contract = network.getContract(chaincodeName);

        jsonData.forEach(async item => {
          const record = item.Record;
          console.log(record);
          console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
          let result= await contract.submitTransaction('ReStoreData', JSON.stringify(record));
          console.log(`*** Result: ${prettyJSONString(result.toString())}` );

        });



        gateway.disconnect();


        // let resultjson = JSON.parse(result.toString());


        res.status(200).send("OK!");

        
    }

    catch(error) {

        console.log('Upload data action submission failed with error: '+error);

        res.status(403).send('Upload data action submission failed with '+error)

    }
 
}

module.exports = REuploaddata;