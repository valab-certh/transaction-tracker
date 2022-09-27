
function createCAs(org) {

    // if( !(org == org.toUpperCase())){

    //     org = org.toUpperCase();
    //     console.log("The org is:", org);
    // }

    let ca = 'ca.'.concat(org);
    
    return ca;
}


module.exports = createCAs;