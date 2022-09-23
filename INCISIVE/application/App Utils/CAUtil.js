'use strict';

const {execFileSync} = require('child_process');
const { cwd } = require('process');
//const revoke_cli = require('../../../test-network/scripts/configUpdate.sh')

//these are the credentials for the ca admin!!!!!!!
const adminUserId = 'admin';
const adminUserPasswd = 'adminpw';

//define the INCISIVE Platfrom admin(s) credentials
const INCISIVEadminId = 'INCISIVEadmin';
const INCISIVEadminPasswd = '!ncisisve';

/**
 *
 * @param {*} FabricCAServices
 * @param {*} ccp
 */
exports.buildCAClient = (FabricCAServices, ccp, caHostName) => {
	// Create a new CA client for interacting with the CA.
	const caInfo = ccp.certificateAuthorities[caHostName+'.iti.gr']; //lookup CA details from config
	const caTLSCACerts = caInfo.tlsCACerts.pem;
	const caClient = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

	console.log(`Built a CA Client named ${caInfo.caName}`);
	return caClient;
};

exports.enrollAdmin = async (caClient, wallet, orgMspId) => {
	try {
		// Check to see if we've already enrolled the admin user.
		const identity = await wallet.get(adminUserId);
		if (identity) {
			console.log('An identity for the admin user already exists in the wallet');
			return;
		}

		// Enroll the admin user, and import the new identity into the wallet.
		const enrollment = await caClient.enroll({ enrollmentID: adminUserId, enrollmentSecret: adminUserPasswd });
		const x509Identity = {
			credentials: {
				certificate: enrollment.certificate,
				privateKey: enrollment.key.toBytes(),
			},
			mspId: orgMspId,
			type: 'X.509',
		};
		await wallet.put(adminUserId, x509Identity);
		console.log('Successfully enrolled admin user and imported it into the wallet');
	} catch (error) {
		console.error(`Failed to enroll admin user : ${error}`);
	}
};

//register and enroll admin of the platform
exports.registerEnrollAdmin = async (caClient, wallet, orgMspId, userId, org, role) => {

	try {
		const adminIdentity = await wallet.get(adminUserId);
		if (!adminIdentity) {
			console.log('An identity for the admin user does not exist in the wallet');
			console.log('Enroll the admin user before retrying');
			return ('An identity for the admin user does not exist in the wallet');
		}

		// build a user object for authenticating with the CA
		const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
		const adminUser = await provider.getUserContext(adminIdentity, adminUserId);

		// Register the user, enroll the user, and import the new identity into the wallet.
		// if affiliation is specified by client, the affiliation value must be configured in CA
		const secret = await caClient.register({

			enrollmentID: userId,
			role: 'client',
			attrs:[{name:'org', value:org, ecert:true}, {name:'hf.Registrar.Roles', value:'client', ecert:true},
					{name:'hf.Revoker', value:'true', ecert:true}, {name:'role', value:role, ecert:true}, {name:'hf.Registrar.Attributes', value:'hf.Registrar.Roles, hf.Revoker, hf.Registrar.Attributes, org, role'}]
		}, adminUser);



		const enrollment = await caClient.enroll({
			enrollmentID: userId,
			enrollmentSecret: secret
		});

		const x509Identity = {
			credentials: {
				certificate: enrollment.certificate,
				privateKey: enrollment.key.toBytes(),
			},
			mspId: orgMspId,
			type: 'X.509',
		};

		await wallet.put(userId, x509Identity);


		console.log(`Successfully registered and enrolled user ${userId} and imported it into the wallet`);
	}
	catch (error) {

		console.error(`Failed to register user : ${error}`);

	}
}


// exports.registerAndEnrollUser = async (caClient, wallet, orgMspId, userId, org, role, adminUserId) => {

// 	let success;

// 	try {

// 		// Must use an admin to register a new user
// 		const adminIdentity = await wallet.get(adminUserId);
// 		if (!adminIdentity) {
// 			console.log('An identity for the platform admin user does not exist in the wallet');
// 			console.log('Enroll the platform admin user before retrying');
// 			return ('An identity for the platform admin user does not exist in the wallet');
// 		}


// 		// build a user object for authenticating with the CA
// 		const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
// 		const adminUser = await provider.getUserContext(adminIdentity, adminUserId);


// 		// Register the user, enroll the user, and import the new identity into the wallet.
// 		// if affiliation is specified by client, the affiliation value must be configured in CA
// 		let secret;

// 		if (role == 'ADMINISTRATOR'){		
			
// 			secret = await caClient.register({

// 			enrollmentID: userId,
// 			role: 'client',
// 			attrs:[{name:'org', value:'INCISIVE', ecert:true}, {name:'hf.Registrar.Roles', value:'client', ecert:true},
// 			{name:'hf.Revoker', value:'true', ecert:true},{name:'role', value:'ADMINISTRATOR', ecert:true}, {name:'hf.Registrar.Attributes', value:'hf.Registrar.Roles, hf.Revoker, hf.Registrar.Attributes, org, role',ecert:true}]
// 		}, adminUser);
// 	}

// 	else if (role == 'ORGANIZATION_ADMINISTRATOR'){

// 		secret = await caClient.register({

// 			enrollmentID: userId,
// 			role: 'client',
// 			attrs:[{name:'org', value:org, ecert:true}, {name:'hf.Registrar.Roles', value:'client', ecert:true},
// 			{name:'hf.Revoker', value:'true', ecert:true},{name:'role', value:'ORGANIZATION_ADMINISTRATOR', ecert:true}, {name:'hf.Registrar.Attributes', value:'hf.Registrar.Roles, hf.Revoker, hf.Registrar.Attributes, org, role',ecert:true}]
// 		}, adminUser);

// 	}

// 	else {

// 		secret = await caClient.register({
			
// 			enrollmentID: userId,
// 			role: 'client',
// 			attrs:[{name:'org', value:org, ecert:true},{name:'role', value:role, ecert:true}]
// 		}, adminUser);
// 	}


// 		console.log("The secret is", secret)

// 		const enrollment = await caClient.enroll({
// 			enrollmentID: userId,
// 			enrollmentSecret: secret
// 		});

// 		const x509Identity = {
// 			credentials: {
// 				certificate: enrollment.certificate,
// 				privateKey: enrollment.key.toBytes(),
// 			},
// 			mspId: orgMspId,
// 			type: 'X.509',
// 		};

// 		// console.log("Certificate is ",enrollment.certificate)

// 		// await wallet.put(userId, x509Identity);


// 		console.log(`Successfully registered and enrolled user ${userId} and imported it into the wallet`);
// 		success = true;
// 		// const idservice = caClient.newIdentityService();

// 		// const retrieveIdentity = await idservice.getOne(userId, adminUser);
// 		// console.log('userattributes', retrieveIdentity.result.attrs);
// 		return [success, x509Identity];
// 		//return (`Successfully registered and enrolled user ${userId} `);
// 	}
// 	catch (error) {

// 		console.error(`Failed to register user : ${error}`);
// 		success = false;
// 		return [success, null];
// 		//return (`Failed to register user ${userId}...`);
// 	}
// };


exports.registerAndEnrollUser = async (caClient, wallet, orgMspId, userId, org, role, adminUserId) => {


	try {

		// Must use an admin to register a new user
		const adminIdentity = await wallet.get(adminUserId);
		if (!adminIdentity) {
			console.log('An identity for the platform admin user does not exist in the wallet');
			console.log('Enroll the platform admin user before retrying');
			return ('An identity for the platform admin user does not exist in the wallet');
		}


		// build a user object for authenticating with the CA
		const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
		const adminUser = await provider.getUserContext(adminIdentity, adminUserId);


		// Register the user, enroll the user, and import the new identity into the wallet.
		// if affiliation is specified by client, the affiliation value must be configured in CA
		let secret;

		if (role == 'ADMINISTRATOR'){		
			
			secret = await caClient.register({

			enrollmentID: userId,
			role: 'client',
			attrs:[{name:'org', value:'INCISIVE', ecert:true}, {name:'hf.Registrar.Roles', value:'client', ecert:true},
			{name:'hf.Revoker', value:'true', ecert:true},{name:'role', value:'ADMINISTRATOR', ecert:true}, {name:'hf.Registrar.Attributes', value:'hf.Registrar.Roles, hf.Revoker, hf.Registrar.Attributes, org, role',ecert:true}]
		}, adminUser);
	}

	else if (role == 'ORGANIZATION_ADMINISTRATOR'){

		secret = await caClient.register({

			enrollmentID: userId,
			role: 'client',
			attrs:[{name:'org', value:org, ecert:true}, {name:'hf.Registrar.Roles', value:'client', ecert:true},
			{name:'hf.Revoker', value:'true', ecert:true},{name:'role', value:'ORGANIZATION_ADMINISTRATOR', ecert:true}, {name:'hf.Registrar.Attributes', value:'hf.Registrar.Roles, hf.Revoker, hf.Registrar.Attributes, org, role',ecert:true}]
		}, adminUser);

	}

	else {

		secret = await caClient.register({
			
			enrollmentID: userId,
			role: 'client',
			attrs:[{name:'org', value:org, ecert:true},{name:'role', value:role, ecert:true}]
		}, adminUser);
	}


		console.log("The secret is", secret)

		const enrollment = await caClient.enroll({
			enrollmentID: userId,
			enrollmentSecret: secret
		});

		const x509Identity = {
			credentials: {
				certificate: enrollment.certificate,
				privateKey: enrollment.key.toBytes(),
			},
			mspId: orgMspId,
			type: 'X.509',
		};

		// console.log("Certificate is ",enrollment.certificate)

		await wallet.put(userId, x509Identity);


		console.log(`Successfully registered and enrolled user ${userId} and imported it into the wallet`);

	}
	catch (error) {

		console.error(`Failed to register user : ${error}`);
		throw new Error(`Failed to register user ${userId}`);

	}
};


exports.revoke = async(userid, wallet, caClient, channelName) => {

	// try{		
		const user = await wallet.get(userid);
		const org = 'incisive';

		// maybe this check is unnecessary.....
		if (user) {
			console.log('OK! Registered user!!!');
		}
		else{

			console.log(`User ${user} does not exist in wallet.... Not registered user`);
			res.status(403).send(`User ${user} does not exist in wallet.... Not registered user`);
			return;
		}


		// // build a user object for authenticating with the CA
		// const provider = wallet.getProviderRegistry().getProvider(user.type);
		// const user_obj = await provider.getUserContext(user, userid);

		const adminIdentity = await wallet.get(adminUserId);
		if (!adminIdentity) {
			console.log('An identity for the admin user does not exist in the wallet');
			console.log('Enroll the admin user before retrying');
			return ('An identity for the admin user does not exist in the wallet');
		}

		// build a user object for authenticating with the CA
		const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
		const adminUser = await provider.getUserContext(adminIdentity, adminUserId);


		//let revoke = await caClient.revoke({enrollmentID:userid}, adminUser, true);// true is the gencrl but it doesn't seem to work...
		let revoke = caClient.revoke({enrollmentID:userid, gencrl:true}, adminUser)
		console.log("Revocation results: ", JSON.stringify(revoke));

		let crl = await caClient.generateCRL({}, adminUser);
		console.log("CRL is", crl)

		console.log(`${cwd()}`+'../../test-network');

		// const revokecli = exec(`'"../../test-network/scripts/revoke.sh" ${org} ${channelName} ${crl}'`);
		const revokecli = execFileSync('../../test-network/scripts/revoke.sh',[`${org.toUpperCase()}`, `${channelName}`, `${crl}`], {},
																					(error, stdout, stderr) => {
																						if (error){
																							console.log(stderr);
																							throw error;
																							
																						}
																						console.log(stdout);
																					});

		console.log(`Successfully revoked user ${userid}!`);
	// }

	// catch (error) {

	// 	console.error(`Failed to revoke user ${userid} with error: ${error}`);
	// 	return (`Failed to revoke user ${userid}...`);
	// }

};
