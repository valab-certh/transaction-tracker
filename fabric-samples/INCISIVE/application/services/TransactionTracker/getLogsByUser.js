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
    let fromDate = req.body.fromDate;
    let toDate = req.body.toDate;
    let pageLength = + req.body.pageLength;
    let currentPage = + req.body.currentPage;



    try {


        let ccp = ccps['incisive'];

        const wallet = await Wallets.newFileSystemWallet(path.join(walletPath, 'incisive'));

        //check if the identity eixsts
        await wallet.get(requestor);

        //check if the identity eixsts
        // TODO: check if this is really needed
        if ((!identity && (identity != "all" || identity != "All" || identity != "ALL"))){

            throw new Error('Please type a username')
        }

        if ((identity != "all" && identity != "All" && identity != "ALL")) {

        //     try {
                

                await wallet.get(identity);
        //         console.log("IDEINTITY is", identity)
        //     }

        //     catch(error){

        //         throw new Error('User does not exist');
        //     }
        }

        if(new Date(fromDate) > new Date(toDate)){

            throw new Error ("Please pick a correct date");
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


        await contract.evaluateTransaction('CheckRole', "ADMINISTRATOR");

        gateway.disconnect();


        //PAGINATION
        // let logs = await retrieveByUser(identity, fromDate, toDate, pageSize, currentPage);

        let logs = await retrieveByUser(identity, fromDate, toDate, pageLength, currentPage);
        // if (!(Array.isArray(logs) && logs.length)){

        //     throw new Error('User has not yet performed any action.');
        // }
        
        let logsjson = JSON.parse(JSON.stringify(logs["logsPage"]));
        console.log(logsjson)


        res.status(200).send({"Logs":logsjson, "PageLength": pageLength, "TotalNumber": logs["Length"], "CurrentPage": currentPage });
        
        
    }

    catch(error) {

        console.log('Get logs by user failed with error: '+error);

        res.status(403).send({"Error":'Get logs by user failed with : '+error})
        

    }
    
}
module.exports = getLogsByUser;