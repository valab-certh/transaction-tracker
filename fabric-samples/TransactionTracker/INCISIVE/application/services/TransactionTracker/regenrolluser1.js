
require ('dotenv').config();
const { Gateway, Wallets } = require('fabric-network');

const path = require('path');
const fs = require('fs');
const { registerAndEnrollUser } = require('../../App Utils/CAUtil.js');
const insertlog = require('../../MongoDB/controllers/insertlog');

const {ccps, msps, caClients, cas} = require('../../helpers/initalization');

const walletPath = path.join(__dirname, '..', '..', 'wallet');
const channelName = process.env.CHANNEL_NAME;
const chaincodeName = process.env.CC_NAME;
const secret = process.env.HASH_SECRET;

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

const regenrolluser1 = async (req, res, next) => {

    // admin accepts and register the user
    const admin = req.body.admin;
    const user = req.body.user;
    //get org from request or some kind of token
    let org = req.body.org;
    let role = req.body.role;

    if (role == 'ADMINISTRATOR'){

        org = 'INCISIVE'
    }

    
    let affiliation ;


    org = org.toLowerCase();
    console.log("The org is:", org);

    try {   

        let msg;


        let ccp = ccps['incisive'];
        let ca = cas['incisive'];
        let msp = msps['incisive'];
        let caClient = caClients['incisive'];

        affiliation = 'incisive'.toLowerCase().concat(".",role);
        console.log("Affiliation is: ", affiliation)

        const wallet = await Wallets.newFileSystemWallet(path.join(walletPath, 'incisive'));


        const useridentity = await wallet.get(user);
        if (useridentity) {

            msg = `An identity for the user ${user} already exists in the wallet`;
			console.log(msg);
            res.send(msg);
			return ;
		}
        else {

            [success, X509Identity] = await registerAndEnrollUser(caClient, wallet, msp, user, org, role, admin);

            if(success){

                const gateway = new Gateway();

                console.log("Trying to connect to gateway...")
                await gateway.connect(ccp, {
                    wallet,
                    identity: admin,
                    discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
                });
                console.log("Connected!!!")


                // Build a network instance based on the channel where the smart contract is deployed
                const network = await gateway.getNetwork(channelName);

                // Get the contract from the network.
                const contract = network.getContract(chaincodeName, 'UserContract');
            
                    
                //call smart contract
                console.log('\n--> Submit Transaction: createData, function creates the initial set of assets on the ledger');
                let result = await contract.submitTransaction('RegisterUser', user, role, org, admin, secret);
                console.log('*** Result: committed');

                let resultjson = JSON.parse(result.toString());
                console.log(`*** Result: ${prettyJSONString(result.toString())}`);

                await wallet.put(user, X509Identity);

                gateway.disconnect();

                //save log to mongodb
                let action = resultjson[0];
                console.log('action', action)
                let hash = resultjson[1];
                console.log('hash', hash)
                await insertlog(hash, action);
                


                res.status(200).send(`Successfully registered and enrolled user ${user}!!!`);
            }

            else{

                res.status(403).send('User registration failed...')
                return;

            }
        }


    }

    catch(error){

        console.log('User registration failed with error: '+error);

        res.status(403).send('User registration failed...')
    }


}

module.exports = regenrolluser1;