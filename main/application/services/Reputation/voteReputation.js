const { Gateway, Wallets} = require('fabric-network');
const path = require('path');

const channelName = process.env.CHANNEL_NAME;
const chaincodeName = process.env.REPUTATION_CC_NAME;

const walletPath = path.join(__dirname,'..', '..', 'wallet');

const {ccps, msps, caClients, cas} = require('../../helpers/initalization');
const saveNewComment = require('../../MongoDB/controllers/repComments/insertComments')
const deleteComment = require('../../MongoDB/controllers/repComments/deleteComment');

// This function is used to calculate the reputation score of an AI service/model and store it on the ledger.
const voteReputation = async (req,res) => {

    let user = req.body.user;
    let serviceID = req.body.serviceID;
    let vote = req.body.vote;

    try{

        if (vote.hasOwnProperty('q7') && vote['q7']!==null && (vote['q7'].length!==0 && vote['q7'].trim().length !== 0 )){
            var savedComment = await saveNewComment(serviceID, vote['q7']);
            console.log('I saved the comment!!!', savedComment)
        }


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

        console.log('\n--> Submit Transaction: VoteReputation, function records and computes reputation for an AI service in the ledger');
        let model = await contract.submitTransaction('VoteReputation', serviceID, JSON.stringify(vote));
		console.log('*** Result: committed')

        // Disconnect from the gateway when the application is closing
        // This will close all connections to the network
        gateway.disconnect();

		let modelJSON = JSON.parse(model);
        console.log("Updated AI Service:", modelJSON)

        res.status(200).send({"Service": modelJSON});

    }

    catch(error){

        try{
            await deleteComment(savedComment);
        }
        catch(error){
            console.log("Voting for AI service's reputation failed with error: "+error);
        }
        
        console.log("Voting for AI service's reputation failed with error: "+error);

        res.status(500).send({"Error":"Voting for AI service's reputation failed with: "+error});
    }
}

module.exports = voteReputation;