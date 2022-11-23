const crypto = require('crypto');
const propertiesReader = require('properties-reader');
const properties = propertiesReader(`${__dirname}/keys.ini`);
const fs = require('fs');
// const file = fs.readFileSync('./HI.txt', 'utf-8');
console.log(__dirname);
console.log(process.cwd());

var keyverification= function(req, res, next){

    var apikey = properties.get('security.API_KEY');
    var secret = properties.get('security.SECRET_KEY');

    // header_key = "API_KEY"_hmac
    // hmac = hash(raw_message, secretkey)
    
    // Incoming raw message must be a stringified JSON
<<<<<<< HEAD
    
    try{

        var header_key = req.header('x-api-key');
        console.log("HEADER", header_key)

        let splits = header_key.split('_');

        var key = splits[0];
        var hmac = splits[1];
    }
    catch(err){

        return res.status(403).send('Header missing...');
=======
    let splits;
    try{
        var header_key = req.header('x-api-key');
        console.log("HEADER", header_key)
        splits = header_key.split('_');
    }
    catch(err){

        throw new Error ("Missing api key")
        
>>>>>>> 085660a7dc497473f38193d67279324ed5c2b328
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
     //return res.status(200).send('OK');
     next()
}

module.exports = {keyverification}