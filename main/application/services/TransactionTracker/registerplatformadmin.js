'use strict';

//define the project's Platfrom admin(s) credentials in an .env file and make sure this file is securely stored
const PlatformAdminId = process.env.PLATFORM_ADMIN_ID;

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const {ccps, msps, caClients, cas} = require('../../helpers/initalization');
const { registerEnrollAdmin } = require('../../App Utils/CAUtil.js');
const walletPath = path.join(__dirname, '..', '..', 'wallet');


// This service
const registerplatformadmin = async ()=> {

	let caClient = caClients['Org1'];
	let msp = msps['Org1'];

	try{
		const wallet = await Wallets.newFileSystemWallet(path.join(walletPath));
		const useridentity = await wallet.get(PlatformAdminId);

		console.log(useridentity)

		if (useridentity) {

			let msg = `An identity for the user ${PlatformAdminId} already exists in the wallet`;
			console.log(msg);
			return ;
		}

		registerEnrollAdmin(caClient, wallet, msp, PlatformAdminId, "Org1", "ADMINISTRATOR");
		
	}

	catch(error){

		console.log('Admin registration failed with error: '+error);
	}
	
}

registerplatformadmin();

