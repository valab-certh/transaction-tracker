'use strict';

//these are the credentials for the ca admin!!!!!!!
const adminUserId = 'admin';

//define the INCISIVE Platfrom admin(s) credentials
const INCISIVEadminId = 'admin@incisive-project.eu';
const INCISIVEadminPasswd = '!ncisive';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const {ccps, msps, caClients, cas} = require('../../helpers/initalization');
const { registerEnrollAdmin } = require('../../App Utils/CAUtil.js');
const walletPath = path.join(__dirname, '..', '..', 'wallet');



const registerplatformadmin = async ()=> {

	let caClient = caClients['incisive'];
	let msp = msps['incisive'];

	try{
		const wallet = await Wallets.newFileSystemWallet(path.join(walletPath, 'incisive'));
		const useridentity = await wallet.get(INCISIVEadminId);

		console.log(useridentity)

		if (useridentity) {

			msg = `An identity for the user ${INCISIVEadminId} already exists in the wallet`;
			console.log(msg);
			return ;
		}

		registerEnrollAdmin(caClient, wallet, msp, INCISIVEadminId, "INCISIVE", "ADMINISTRATOR");
		
	}

	catch(error){

		console.log('Admin registration failed with error: '+error);
	}
	
}

registerplatformadmin();

