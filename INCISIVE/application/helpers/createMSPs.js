
function createMSPs (org) {  

    // if( !(org == org.toUpperCase())){

    //     org.toUpperCase();
    //     console.log("The org is:", org);
    // }

    let msps = org.concat("MSP");
    
    return msps;
};

module.exports = createMSPs ;