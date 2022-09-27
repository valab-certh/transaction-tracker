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
	console.log('ca info is:', caInfo)
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
		console.log("HI!!!!")
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

exports.registerAndEnrollUser = async (caClient, wallet, orgMspId, userId, affiliation) => {

	let success;

	try {
		// Check to see if we've already enrolled the user
		// const userIdentity = await wallet.get(userId);
		// if (userIdentity) {
		// 	console.log(`An identity for the user ${userId} already exists in the wallet`);
		// 	return (`An identity for the user ${userId} already exists in the wallet`);
		// }

		// Must use an admin to register a new user
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
			affiliation: affiliation,
			enrollmentID: userId,
			role: 'client'
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
		success = true;
		return success
		//return (`Successfully registered and enrolled user ${userId} `);
	} catch (error) {
		console.error(`Failed to register user : ${error}`);
		success = false;
		return success;
		//return (`Failed to register user ${userId}...`);
	}
};


exports.revoke = async(userid, wallet, caClient) => {

	try{		
		const user = await wallet.get(userid);

		// maybe this check is unnecessary.....
		if (user) {
			console.log('OK! Registered user!!!');
		}
		else{

			console.log(`User ${user} does not exist in wallet.... Not registered user`);
			res.status(403).send(`User ${user} does not exist in wallet.... Not registered user`);
			return;
		}


		// build a user object for authenticating with the CA
		const provider = wallet.getProviderRegistry().getProvider(user.type);
		const user_obj = await provider.getUserContext(user, userid);

		let revoke = await caClient.revoke({enrollmentID:userid}, user_obj);
		console.log("Revocation results: ", revoke);


		return (`Successfully revoked user ${userid}!`);
	}

	catch (error) {

		console.error(`Failed to revoke user ${userid} with error: ${error}`);
		return (`Failed to revoke user ${userid}...`);
	}

};
