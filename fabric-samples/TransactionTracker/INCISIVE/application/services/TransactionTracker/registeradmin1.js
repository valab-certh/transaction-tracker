const { Gateway, Wallets } = require('fabric-network');
// const FabricCAServices = require('fabric-ca-client');

const path = require('path');
// const fs = require('fs');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../App Utils/CAUtil.js');
const { buildCCPAUTH, buildCCPUNS, buildWallet } = require('../../App Utils/AppUtil.js');

// const makeccp = require('../helpers/makeccp');
// const createCAs = require('../helpers/createCAs');
// const createMSPs = require('../helpers/createMSPs');
const {ccps, msps, caClients, cas} = require('../../helpers/initalization');

const walletPath = path.join(__dirname, '..', '..', 'wallet');


const registeradmin1 = async() => {


    // setup the wallet to hold the credentials of the application user
    let walletpathincisive = path.join(walletPath,'incisive');

    const walletincisive = await buildWallet(Wallets, walletpathincisive);

    await enrollAdmin(caClients['incisive'], walletincisive, msps['incisive']);


    //return res.send("OK!")
}

module.exports = registeradmin1