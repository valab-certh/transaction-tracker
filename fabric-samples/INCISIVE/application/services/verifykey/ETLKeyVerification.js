const crypto = require('crypto');
const propertiesReader = require('properties-reader');
const properties = propertiesReader(`${__dirname}/keys.ini`);
const fs = require('fs');
// const file = fs.readFileSync('./HI.txt', 'utf-8');
console.log(__dirname);
console.log(process.cwd());


// This module checks the incoming API key to verify if it comes from a valid data provider
var EtlKeyVerification= function(req, res, next){

    var etlkey = properties.get('security.ETL_KEYS');
    etlkey = JSON.parse(etlkey);


    try{

        var api_key = req.header('x-api-key');
        if (!api_key){

            console.log('Key is missing...')

            throw new Error ('Key is missing...')
        }

        if (!etlkey.hasOwnProperty(api_key)){

            throw new Error('Unknown key...');
        }

        var org = etlkey[api_key];

        res.locals.org = org
        console.log(res.locals.org)

    }
    catch(error){

        return res.status(403).send(""+error);
    }

   
     next()
}

module.exports = {EtlKeyVerification}