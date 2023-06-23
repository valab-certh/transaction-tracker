const { Gateway, Wallets} = require('fabric-network');
const path = require('path');


const channelName = process.env.CHANNEL_NAME;
const chaincodeName = process.env.CC_NAME;
const walletPath = path.join(__dirname, '..', '..', 'wallet');

// const makeccp = require('../helpers/makeccp');
const {ccps, msps, caClients, cas} = require('../../helpers/initalization');
const retrieveByUser= require('../../MongoDB/controllers/retrieveByUser');
const retrieveByUserOrg = require('../../MongoDB/controllers/retrieveByUserOrg');


// TODO: check if user is admin (probably), and see about the middleware
const getLogsByUser = async(req, res, next) => {

    const identity = req.body.user;
    const requestor = req.body.requestor;
    let fromDate = req.body.fromDate;
    let toDate = req.body.toDate;
    let pageLength = + req.body.pageLength;
    let currentPage = + req.body.currentPage;

    let logs;



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

            await wallet.get(identity);

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


       let userInfo = await contract.evaluateTransaction('GetRoleOrg');

       gateway.disconnect();

       let userInfoJSON = JSON.parse(userInfo);
       console.log ("JSON is", userInfoJSON)

        if (userInfoJSON.Role == "ADMINISTRATOR") {

            logs = await retrieveByUser(identity, fromDate, toDate, pageLength, currentPage);
        }

        else if (userInfoJSON.Role == "ORGANIZATION_ADMINISTRATOR"){

            logs = await retrieveByUserOrg(identity, userInfoJSON.Organization, fromDate, toDate, pageLength, currentPage);
        }
        else {

            throw new Error ("Something went wrong...")
        }
        

        
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