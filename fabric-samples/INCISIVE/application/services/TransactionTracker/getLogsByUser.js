const { Gateway, Wallets} = require('fabric-network');
const path = require('path');


const channelName = process.env.CHANNEL_NAME;
const chaincodeName = process.env.CC_NAME;
const walletPath = path.join(__dirname, '..', '..', 'wallet');

// const makeccp = require('../helpers/makeccp');
const {ccps, msps, caClients, cas} = require('../../helpers/initalization');
const retrieveByUser= require('../../MongoDB/controllers/retrieveByUser');


// TODO: check if user is admin (probably), and see about the middleware
const getLogsByUser = async(req, res, next) => {

    const identity = req.body.user;
    const requestor = req.body.requestor;


    try {


        let ccp = ccps['incisive'];

        const wallet = await Wallets.newFileSystemWallet(path.join(walletPath, 'incisive'));

        //check if the identity eixsts
        await wallet.get(requestor);

        // if user exists, check if user is an admin and hence can check the logs
        // if (requestoridentity) {
        //     console.log('OK! Registered user!!!');

        // }
        // else{

        //     console.log('User identity does not exist in wallet.... Not registered user');
        //     throw new Error('User identity does not exist in wallet.... Not registered user');

        // }

        //check if the identity eixsts
        // TODO: check if this is really needed
        if ((!identity && identity != "All")){
            // const exists = await wallet.get(identity);
            // if (exists) {
            //     console.log('OK! Registered user!!!');
            // }
            // else{
    
            //     console.log('User identity does not exist in wallet.... Not registered user');
            //     throw new Error('This user does not exist...')
            // }
            throw new Error('Please type a username')
        }



        const gateway = new Gateway();
        console.log("Trying to connect to gateway...")
        
        await gateway.connect(ccp, {
            wallet,
            identity: requestor,
            discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
        });
        console.log("Connected!!!")

        // Build a network instance based on the channel where the smart contract is deployed
        const network = await gateway.getNetwork(channelName);

        // Get the contract from the network.
        const contract = network.getContract(chaincodeName, 'UserContract');

        // try {
        await contract.evaluateTransaction('CheckRole', "ADMINISTRATOR");
        // }

        // catch(err){
        //     throw new Error("You don't have the necessary rights to perform this action")
        // }

        gateway.disconnect();



        let logs = await retrieveByUser(identity);

        if (!(Array.isArray(logs) && logs.length)){

            throw new Error('Non existent user or user has not yet performed any action.');
        }
        console.log(logs.toString())
        let logsjson =JSON.parse(JSON.stringify(logs));
        console.log(logsjson)
        res.status(200).send({"Logs":logsjson});
        
        
    }

    catch(error) {

        console.log('Get logs by user failed with error: '+error);

        res.status(403).send('Get logs by user failed with : '+error)
        

    }
    
}
module.exports = getLogsByUser;