const propertiesReader = require('properties-reader');
const properties = propertiesReader(`${__dirname}/keys.ini`);
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output:process.stdout
});
// const args = process.argv;

const genAPIKey = () => {

    rl.question("Provide the organization name:", org => {

        console.log(`${org}`)

        // let key = [Array(30)]
        // .map((e) => ((Math.random()*36) | 0).toString(36))
        // .join('');
        let key = Math.random().toString(36).substring(2,15)+Math.random().toString(36).substring(2,15);
    
        console.log("API KEY is: ", key)
        console.log("Data Provider is: ", org)

        rl.close();
    });
    


};

genAPIKey();