const FabricCAServices = require('fabric-ca-client');
const path = require('path');

const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../App Utils/CAUtil.js');


const makeccp = require('./makeccp');
const createCAs = require('./createCAs');
const createMSPs = require('./createMSPs');

const ccpOrg1 = makeccp();
const mspOrg1 = createMSPs();
const caOrg1 = createCAs();

const caClientOrg1 = buildCAClient(FabricCAServices, ccpOrg1, caOrg1);

const ccps ={'Org1':ccpOrg1};
const msps = {'Org1':mspOrg1};
const caClients = {'Org1':caClientOrg1};
const cas = {'Org1':caOrg1};



module.exports = {ccps, msps, caClients, cas}

