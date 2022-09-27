const FabricCAServices = require('fabric-ca-client');
const { Gateway, Walconsts } = require('fabric-network');
const path = require('path');

const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../App Utils/CAUtil.js');
const { buildCCPAUTH, buildCCPUNS, buildWallet } = require('../App Utils/AppUtil.js');

const makeccp = require('./makeccp');
const createCAs = require('./createCAs');
const createMSPs = require('./createMSPs');

const walletPath = path.join(__dirname, '..', 'wallet');


//incisiveenal orgs section
const ccpincisive = makeccp("incisive");
const mspincisive = createMSPs("incisive");
const caincisive = createCAs("incisive");



const caClientincisive = buildCAClient(FabricCAServices, ccpincisive, caincisive);



const ccps ={'incisive':ccpincisive};
const msps = {'incisive':mspincisive};
const caClients = {'incisive':caClientincisive};
const cas = {'incisive':caincisive};
// const wallets = {'AUTH':walletauth, 'UNS':walletuns, 'incisive':walletincisive, 'HCS':wallethcs, 'UNITOV':walletunitov, 'UOA':walletuoa, 'GOC':walletgoc, 'IDIBAPS':walletidibaps, 'VIS':walletvis, 'DISBA':walletdisba};


module.exports = {ccps, msps, caClients, cas}

