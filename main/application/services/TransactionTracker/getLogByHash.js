const { Gateway, Wallets} = require('fabric-network');
const path = require('path');
const walletPath = path.join(__dirname, '..', '..', 'wallet');
const retrieveByHash =  require('../../MongoDB/controllers/logs/retrieveByHash');


// This service acts as helper and returns a log searched by hash
const getLogByHash = async(req, res, next) => {

    const requestor = req.body.user;
    let hash = req.body.hash;

    try {

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


        let log = await retrieveByHash(hash);

        let logJSON = JSON.parse(JSON.stringify(log));

        console.log(logJSON);

        res.status(200).send(logJSON)

    }

    catch(error) {

        console.log('Get log by hash failed with error: '+error);

        res.status(403).send({"Error":'Get log by hsah failed with : '+error})
        

    }
    
}
module.exports = getLogByHash;
