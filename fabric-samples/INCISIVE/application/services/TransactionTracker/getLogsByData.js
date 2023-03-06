const { Gateway, Wallets} = require('fabric-network');
const path = require('path');


const channelName = process.env.CHANNEL_NAME;
const chaincodeName = process.env.DATASETS_CC_NAME;
const walletPath = path.join(__dirname, '..', '..', 'wallet');

// const makeccp = require('../helpers/makeccp');
const {ccps, msps, caClients, cas} = require('../../helpers/initalization');
const retrieveByData= require('../../MongoDB/controllers/retrieveByData');

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}



// TODO: if need to also check user can only check about data he uploaded
// If the above check is required, what happens with data that have been deleted?
// TODO: what happens if data is given as array e.g., [dataset1, dataset 2, ...]
const getLogsByData = async(req, res, next) => {

    const data_id = req.body.data_id;
    const requestor = req.body.user;
    let fromDate = req.body.fromDate;
    let toDate = req.body.toDate;
    let pageLength = req.body.pageLength;


    try {


        let ccp = ccps['incisive'];

        const wallet = await Wallets.newFileSystemWallet(path.join(walletPath, 'incisive'));

        //check if the identity eixsts
        const requestoridentity = await wallet.get(requestor);

        // if user exists, check if user is an admin and hence can check the logs
        if (requestoridentity) {
            console.log('OK! Registered user!!!');

        }
        else{

            console.log('User identity does not exist in wallet.... Not registered user');
            throw new Error('Not registered user');

        }

        const gateway = new Gateway();


        console.log("Trying to connect to gateway...")
        await gateway.connect(ccp, {
            wallet,
            identity: requestoridentity,
            discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
        });
        console.log("Connected!!!")

        // Build a network instance based on the channel where the smart contract is deployed
        const network = await gateway.getNetwork(channelName);

        // Get the contract from the network.
        const contract = network.getContract(chaincodeName);


        // There are three cases:
        // 1) When data is provided as an argument, then the logs containing the specific dataset are returned
        // 2) When the "All" argument is provided, we consider that the user wants all data, so the logs containg either one of the data
        // belonging to this organization are returned
        // 3) When no data is provided, it returnes an error

        //  Case 1): data_id is provided
        if (data_id && (data_id != "all" && data_id != "All" && data_id != "ALL")){

            try{
            await contract.evaluateTransaction('CheckDataLogs', data_id);

            }
            catch(err){
    
                throw new Error("You are not allowed to perform this action or data don't belong to your organization")
    
            }

            let logs = await retrieveByData([data_id], fromDate, toDate);

            // if (!(Array.isArray(logs) && logs.length)){

            //     throw new Error('Non existent data or data has not yet performed any action.');
            // }
            console.log(logs.toString())
            let logsjson = JSON.parse(JSON.stringify(logs));
            console.log(logsjson)
            res.status(200).send({"Logs":logsjson, "PageLength": pageLength, "TotalNumber": logs.length});

        }

        // Case 2): data_id is All
        else if ((data_id == "all" || data_id == "All" || data_id == "ALL")){

            console.log('\n--> Evaluate Transaction: GetDataset, function retieves info about a specific dataset');
            let result = await contract.evaluateTransaction('GetDatasetOrg');
            console.log('*** Result: committed');
            console.log(result)


            let datasetarray = [];

            let resultJSON = JSON.parse(result);

            for (let i =0; i<resultJSON.length; i++){

                console.log(Object.keys(resultJSON[i]))
                datasetarray.push(resultJSON[i].Key)
            }

            let logs = await retrieveByData(datasetarray, fromDate, toDate);
            // if (!(Array.isArray(logs) && logs.length)){

            //     throw new Error('Non existent data or data has not yet performed any action.');
            // }
            console.log(logs.toString())
            let logsjson = JSON.parse(JSON.stringify(logs));
            console.log(logsjson)
            res.status(200).send({"Logs":logsjson, "PageLength": pageLength, "TotalNumber": logs.length});


        }

        // Case 3) no input is provided
        else {

            throw new Error("Please select a data to see the logs for.")
        }


        

        gateway.disconnect();
        
    }

    catch(error) {

        console.log('Get logs by data failed with error: '+error);

        res.status(403).send({"Error":'Get logs by data failed with : '+error})
        

    }
    
}
module.exports = getLogsByData;