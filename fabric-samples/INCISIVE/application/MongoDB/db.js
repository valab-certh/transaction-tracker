const mongoose = require('mongoose');
const user = process.env.MONGO_USER;
const pass = process.env.MONGO_PASS;


const connect = (uri) => {

    mongoose.connect(uri, {useNewUrlParser: true, auth:{username:user, password: pass}})


    //CONNECTION EVENTS
    //Successful connection
    mongoose.connection.on('connected', () => {
        console.info(`Mongoose default connection open to ${uri}`);
    })

    //Connection throws an error
    mongoose.connection.on('error', (error) => {
        console.log(error)
    })

    //Connection is disconnected
    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose default connection disconnected')
    })

    //Closse the connection if the node process is terminated
    mongoose.connection.on('SIGINT', () => {
        mongoose.connection.close(() => {
            console.info('Mongoose default connection disconnected through app termination')
            process.exit(0)
        })
    })

};


module.exports = {connect};