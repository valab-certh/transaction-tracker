
const { buildCCP } = require('../../../my-application/AppUtil.js');



function makeccp (org){

    // if( !(org == org.toUpperCase())){

    //     org = org.toUpperCase();
    //     console.log("The org is:", org);
    // }

    let ccp = buildCCP(org);

    return ccp;

};


module.exports = makeccp