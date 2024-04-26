const FabricCAServices = require('fabric-ca-client');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../App Utils/CAUtil.js');



function createcaclients(ccp, CA) {

    let caClient = buildCAClient(FabricCAServices, ccp, CA);

    return caClient;

}

module.exports = createcaclients;