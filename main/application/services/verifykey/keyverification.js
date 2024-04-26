const crypto = require('crypto');
const propertiesReader = require('properties-reader');
const properties = propertiesReader(`${__dirname}/keys.ini`);
const fs = require('fs');
console.log(__dirname);
console.log(process.cwd());

// middleware for authenticating requests based on a generated API key. Both API_KEY and SECRET_KEY should be defined in a file called keys.ini
// The API_KEY and SECRET_KEY values should be defined in the keys.ini file by the developer.
var keyverification= function(req, res, next){

    var apikey = properties.get('security.API_KEY');
    var secret = properties.get('security.SECRET_KEY');
    
    // Incoming raw message must be a stringified JSON
    try{
        var header_key = req.header('x-api-key');
        console.log("HEADER", header_key)
        let splits = header_key.split('_');
        var key = splits[0];
        var hmac = splits[1];
    }
    catch(err){

        return res.status(403).send("Header is missing API key")
        
    }


    var body = JSON.stringify(req.body);
    console.log("APIKEY",key)
    console.log("HMAC",hmac)
    console.log(body)
    console.log(req.body)


    if (apikey != key) {
        return res.status(403).send("Invalid public key.");
    }

    var compute_hmac = crypto.createHmac('sha256', secret).update(body).digest('hex');
    console.log(compute_hmac)

    if (compute_hmac != hmac){

        return res.status(403).send('Authentication failed...');
    }
     next()
}

module.exports = {keyverification}