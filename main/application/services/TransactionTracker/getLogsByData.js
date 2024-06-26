const { Gateway, Wallets} = require('fabric-network');
const path = require('path');


const channelName = process.env.CHANNEL_NAME;
const chaincodeName = process.env.DATASETS_CC_NAME;
const walletPath = path.join(__dirname, '..', '..', 'wallet');

// const makeccp = require('../helpers/makeccp');
const {ccps, msps, caClients, cas} = require('../../helpers/initalization');
const retrieveByData= require('../../MongoDB/controllers/logs/retrieveByData');


// This service returns all logs based on specific data
const getLogsByData = async(req, res, next) => {

    const data_id = req.body.data_id;
    const requestor = req.body.user;
    let fromDate = req.body.fromDate;
    let toDate = req.body.toDate;
    let pageLength = + req.body.pageLength;
    let currentPage = + req.body.currentPage;


    try {


        let ccp = ccps['Org1'];

        const wallet = await Wallets.newFileSystemWallet(path.join(walletPath));

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
            discovery: { enabled: true, asLocalhost: true }
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
        // 3) When no data is provided, it returns an error

        //  Case 1): data_id is provided
        //&& (data_id != "all" && data_id != "All" && data_id != "ALL")
        if (data_id ){

            try{
            let result  = await contract.evaluateTransaction('CheckDataPermissions', data_id);
            console.log(JSON.parse(result))
            console.log("HEYEYEYEYYEYE");

            }
            catch(err){
    
                throw new Error(err)
    
            }

            let logs = await retrieveByData([data_id], fromDate, toDate, pageLength, currentPage);
            let logsjson = JSON.parse(JSON.stringify(logs["logsPage"]));
            console.log(logsjson)
            res.status(200).send({"Logs":logsjson, "PageLength": pageLength, "TotalNumber": logs["Length"], "CurrentPage": currentPage});

        }

        // Case 2): data_id is All
        else {


            console.log('\n--> Evaluate Transaction: GetDatasetOrg, function retieves info about a specific dataset');
            let result = await contract.evaluateTransaction('GetDatasetOrg');
            console.log('*** Result: committed');
            console.log(result)


            let datasetarray = [];

            let resultJSON = JSON.parse(result);

            for (let i =0; i<resultJSON.length; i++){

                console.log(Object.keys(resultJSON[i]))
                datasetarray.push(resultJSON[i].Key)
            }

            let logs = await retrieveByData(datasetarray, fromDate, toDate, pageLength, currentPage);

            let logsjson = JSON.parse(JSON.stringify(logs["logsPage"]));
            console.log(logsjson)
            
            res.status(200).send({"Logs":logsjson, "PageLength": pageLength, "TotalNumber": logs["Length"], "CurrentPage": currentPage});


        }

        // // Case 3) no input is provided
        // else {

        //     // throw new Error("Please select a data to see the logs for.")
        // }


        

        gateway.disconnect();
        
    }

    catch(error) {

        console.log('Get logs by data failed with error: '+error);

        res.status(403).send({"Error":'Get logs by data failed with : '+error})
        

    }
    
}
module.exports = getLogsByData;