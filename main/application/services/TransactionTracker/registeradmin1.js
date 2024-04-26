const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../App Utils/CAUtil.js');
const { buildCCPAUTH, buildCCPUNS, buildWallet } = require('../../App Utils/AppUtil.js');


const {ccps, msps, caClients, cas} = require('../../helpers/initalization');

const walletPath = path.join(__dirname, '..', '..', 'wallet');

// This service runs once in the beginning of the app to register the admin of the whole network
const registeradmin1 = async() => {


    // setup the wallet to hold the credentials of the application user
    let walletpathOrg1 = path.join(walletPath);

    const walletOrg1 = await buildWallet(Wallets, walletpathOrg1);

    await enrollAdmin(caClients['Org1'], walletOrg1, msps['Org1']);

}

module.exports = registeradmin1