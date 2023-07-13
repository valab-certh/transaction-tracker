const { Gateway, Wallets} = require('fabric-network');
const path = require('path');

const channelName = process.env.CHANNEL_NAME;
const chaincodeName = process.env.REPUTATION_CC_NAME;

const walletPath = path.join(__dirname,'..', '..', 'wallet');

const {ccps, msps, caClients, cas} = require('../../helpers/initalization');

const voteReputation = async (req,res) => {

    let user = req.body.user;
    let modelID = req.body.modelID;
    let vote = req.body.vote;

    try{

        // if (vote < 1 || vote > 5 ||(!Number.isInteger(vote))){

        //     let error = new Error("Insert a vote between 1 and 5.");

        //     throw error;
        // }

        let ccp = ccps['incisive'];

        const wallet = await Wallets.newFileSystemWallet(path.join(walletPath, 'incisive'));


        //check if the identity eixsts
        await wallet.get(user);

		const gateway = new Gateway();

        console.log("Trying to connect to gateway...")
        await gateway.connect(ccp, {
            wallet,
            identity: user,
            discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
        });
        console.log("Connected!!!")

        // Build a network instance based on the channel where the smart contract is deployed
        const network = await gateway.getNetwork(channelName);

        // Get the contract from the network.
        const contract = network.getContract(chaincodeName);

        console.log('\n--> Submit Transaction: VoteReputation, function records and computes reputation for an XAI model in the ledger');
        let model = await contract.submitTransaction('VoteReputation', modelID, JSON.stringify(vote));
		console.log('*** Result: committed')

        // Disconnect from the gateway when the application is closing
        // This will close all connections to the network
        gateway.disconnect();

		let modelJSON = JSON.parse(model);
        console.log("Updated Model:", modelJSON)

        res.status(200).send({"Model": modelJSON});

    }

    catch(error){

        console.log("Voting for model's reputation failed with error: "+error);

        res.status(500).send({"Error":"Voting for model's reputation failed with: "+error});
    }
}

module.exports = voteReputation;