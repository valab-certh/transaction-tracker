const propertiesReader = require('properties-reader');
const properties = propertiesReader(`${__dirname}/keys.ini`);
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output:process.stdout
});

// This function is used to generate a random API key for any new data provider that joins the platform.It generates the ETL key. Atre generating the keys, 
// you should include them in the keys.ini file, inthe following format: ETL = {API_KEY_value: Data_Provider_name}
const genAPIKey = () => {

    rl.question("Provide the organization name:", org => {

        console.log(`${org}`)
        let key = Math.random().toString(36).substring(2,15)+Math.random().toString(36).substring(2,15);
    
        console.log("API KEY is: ", key)
        console.log("Data Provider is: ", org)

        rl.close();
    });
    


};

genAPIKey();