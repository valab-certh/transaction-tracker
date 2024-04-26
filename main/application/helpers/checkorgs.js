const orgs = process.env.ORGS

function checkorg(org) {

    if (orgs.includes (org,0)) {

        return true;
    }
    else {

        return false;
    }
}

module.exports = checkorg;