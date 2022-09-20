const FabricCAServices = require('fabric-ca-client');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../../my-application/CAUtil.js');



function createcaclients(ccp, CA) {

    let caClient = buildCAClient(FabricCAServices, ccp, CA)
 
    // for (let i=0; i<CAs.length; i++ ){

    //     caClients[i] = buildCAClient(FabricCAServices, ccps[i], ca[i]);
    // }

    return caClient;

}

module.exports = createcaclients;