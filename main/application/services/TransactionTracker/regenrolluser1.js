
require ('dotenv').config();
const { Gateway, Wallets } = require('fabric-network');

const path = require('path');
const { registerAndEnrollUser } = require('../../App Utils/CAUtil.js');
const insertlog = require('../../MongoDB/controllers/logs/insertlog.js');

const {ccps, msps, caClients, cas} = require('../../helpers/initalization');


const walletPath = path.join(__dirname, '..', '..', 'wallet');
const channelName = process.env.CHANNEL_NAME;
const chaincodeName = process.env.CC_NAME;
const secret = process.env.HASH_SECRET;

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

// This service registers and enrolls a user in the blockchain.
const regenrolluser1 = async (req, res, next) => {

    // admin accepts and register the user
    const admin = req.body.admin;
    const user = req.body.user;
    let org = req.body.org;
    let role = req.body.role;

    if (role == 'ADMINISTRATOR'){

        org = 'Org1'
    }

    
    let affiliation ;

    console.log("The org is:", org);

    try {   

        let msg;


        let ccp = ccps['Org1'];
        let ca = cas['Org1'];
        let msp = msps['Org1'];
        let caClient = caClients['Org1'];

        affiliation = 'Org1'.toLowerCase().concat(".",role);
        console.log("Affiliation is: ", affiliation)

        const wallet = await Wallets.newFileSystemWallet(path.join(walletPath));

        const useridentity = await wallet.get(user);

        console.log(useridentity)
        if (useridentity) {

            msg = `User ${user} has already registered.`;
			console.log(msg);
            res.send(msg);
			return ;
		}
        else {

                const gateway = new Gateway();

                console.log("Trying to connect to gateway...")
                await gateway.connect(ccp, {
                    wallet,
                    identity: admin,
                    discovery: { enabled: true, asLocalhost: true }
                });
                console.log("Connected!!!")


                // Build a network instance based on the channel where the smart contract is deployed
                const network = await gateway.getNetwork(channelName);

                // Get the contract from the network.
                const contract = network.getContract(chaincodeName, 'UserContract');

                try{                
                    await contract.evaluateTransaction('CheckRegistration', org);
                }
                catch(err){

                    throw new Error(err);
                }

                await registerAndEnrollUser(caClient, wallet, msp, user, org, role, admin);

                //call smart contract
                console.log('\n--> Submit Transaction: RegisterUser, ftracks the registration of a user');
                let result = await contract.submitTransaction('RegisterUser', user, admin, secret);
                console.log('*** Result: committed');

                let resultjson = JSON.parse(result.toString());
                console.log(`*** Result: ${prettyJSONString(result.toString())}`);

                gateway.disconnect();

                //save log to mongodb
                let action = resultjson[0];
                console.log('action', action)
                let hash = resultjson[1];
                console.log('hash', hash)
                await insertlog(hash, action);
                

                console.log(`Successfully registered and enrolled user ${user} and written log to ledger!!!`)
                res.status(200).send(`OK!`);
        }


    }

    catch(error){

        console.log('User registration failed with error: '+error);

        res.status(403).send('User registration failed with error: '+error)
    }


}

module.exports = regenrolluser1;