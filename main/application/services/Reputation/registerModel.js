const { Gateway, Wallets} = require('fabric-network');
const path = require('path');

const channelName = process.env.CHANNEL_NAME;
const chaincodeName = process.env.REPUTATION_CC_NAME;

const walletPath = path.join(__dirname,'..', '..', 'wallet');

const {ccps, msps, caClients, cas} = require('../../helpers/initalization');

// This function registers the AI service/model on the ledger
const  registerModel = async (req, res, next) => {

	let user = req.body.user; // may not be needed if admin is the one executing it
	let serviceID = req.body.serviceID;


	try {

        let ccp = ccps['Org1'];

        const wallet = await Wallets.newFileSystemWallet(path.join(walletPath));


        //check if the identity eixsts
        await wallet.get(user);

		const gateway = new Gateway();

        console.log("Trying to connect to gateway...")
        await gateway.connect(ccp, {
            wallet,
            identity: user,
            discovery: { enabled: true, asLocalhost: true }
        });
        console.log("Connected!!!")

        // Build a network instance based on the channel where the smart contract is deployed
        const network = await gateway.getNetwork(channelName);

        // Get the contract from the network.
        const contract = network.getContract(chaincodeName);

		console.log('\n--> Submit Transaction: RegisterModel, function registers the AI service on the ledger');
        let model = await contract.submitTransaction('RegisterModel', serviceID);
		console.log('*** Result: committed')

		// Disconnect from the gateway when the application is closing
        // This will close all connections to the network
        gateway.disconnect();

		let modelJSON = JSON.parse(model);

		console.log("Registered AI Service: ", modelJSON)

		res.status(200).send({"Service": modelJSON});
    

	}


	catch(error){

		console.log('Registering an AI service failed with error:'+error);

        res.status(500).send({"Error": "Registrering an AI service failed with: "+error});

	}
}

module.exports = registerModel;