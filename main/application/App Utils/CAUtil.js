'use strict';

//these are the credentials for the ca admin!!!!!!!
const adminUserId = 'admin';
const adminUserPasswd = 'adminpw';

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
			attrs:[{name:'org', value:'Org1', ecert:true}, {name:'hf.Registrar.Roles', value:'client', ecert:true},
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

