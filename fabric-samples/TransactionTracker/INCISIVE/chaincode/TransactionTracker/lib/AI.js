//Example chaincode for INCISIVE needs

'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const { Contract } = require('fabric-contract-api');
const crypto = require('crypto');


class AIContract extends Contract {


    constructor(){

        super('AIContract');
    }



    // a new critical action regarding models will be recorded on the blockchain and saved to world state
    async TrainModel(ctx, actor, modelname, data, secret) {

        let id = ctx.stub.getTxID();
        // let timestamp = ctx.stub.getTxTimestamp();
        // let timestamp = new Date(ctx.stub.getTxTimestamp().seconds.low*1000).toISOString();
        let timestamp = ctx.stub.getDateTimestamp();
        let role = ctx.clientIdentity.getAttributeValue('role');
        let org = ctx.clientIdentity.getAttributeValue('org');
        

        const newaction = {

            DocType: "Action",
            ID: id,
            Actor:actor,
            Org:org,
            Role: role,
            Timestamp: timestamp,
            Action: 'Train Model',
            ModelName: modelname,
            Data: data

        }

        

        let stringdata = JSON.stringify(newaction);

        const sha256 = crypto.createHmac("sha256", secret);
        let hashlog = sha256.update(stringdata).digest('base64');
        ctx.stub.putState(id, Buffer.from(stringify(hashlog)));
        return JSON.stringify([newaction, hashlog.toString()]);

    }

    // a new critical action regarding data will be recorded on the blockchain and saved to world state
    async AIService(ctx, action, data, actor, secret) {

        let id = ctx.stub.getTxID();
        let role = ctx.clientIdentity.getAttributeValue('role');
        let org = ctx.clientIdentity.getAttributeValue('org');
        // let timestamp = ctx.stub.getTxTimestamp();
        // let timestamp = new Date(ctx.stub.getTxTimestamp().seconds.low*1000).toISOString();
        let timestamp = ctx.stub.getDateTimestamp();
        

        const newaction = {

            DocType: "Action",
            ID: id,
            Actor:actor,
            Org:org,
            Role: role,
            Timestamp: timestamp,
            Action: action,
            Data: data

        }

        
        let stringdata = JSON.stringify(newaction);

        const sha256 = crypto.createHmac("sha256", secret);
        let hashlog = sha256.update(stringdata).digest('base64');
        ctx.stub.putState(id, Buffer.from(stringify(hashlog)));
        return JSON.stringify([newaction, hashlog.toString()]);

    }
 

}

module.exports = AIContract;