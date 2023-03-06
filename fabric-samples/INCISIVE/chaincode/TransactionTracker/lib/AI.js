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
        let timestamp = ctx.stub.getDateTimestamp();
        let role = ctx.clientIdentity.getAttributeValue('role');
        let org = ctx.clientIdentity.getAttributeValue('org');
        

        const newaction = {

            ID: id,
            User:actor,
            Organisation:org,
            Role: role,
            Date: new Date(timestamp),
            Action: 'Train Model',
            UserRegistered: '-',
            Data: data,
            Query: '-',
            ModelName: modelname,
            AIservice: '-'

        }

        

        let stringdata = JSON.stringify(newaction);

        const sha256 = crypto.createHmac("sha256", secret);
        let hashlog = sha256.update(stringdata).digest('base64');
        ctx.stub.putState(hashlog, Buffer.from(stringify(hashlog)));
        return JSON.stringify([newaction, hashlog.toString()]);

    }

    // a new critical action regarding data will be recorded on the blockchain and saved to world state
    async AIService(ctx, service, data, actor, secret) {

        let id = ctx.stub.getTxID();
        let role = ctx.clientIdentity.getAttributeValue('role');
        let org = ctx.clientIdentity.getAttributeValue('org');
        let timestamp = ctx.stub.getDateTimestamp();
        

        const newaction = {

            ID: id,
            User:actor,
            Organisation:org,
            Role: role,
            Date: new Date(timestamp),
            Action: "Use AI service",
            UserRegistered: '-',
            Data: data,
            Query: '-',
            ModelName: '-',
            AIservice:service,
 

        }

        
        let stringdata = JSON.stringify(newaction);

        const sha256 = crypto.createHmac("sha256", secret);
        let hashlog = sha256.update(stringdata).digest('base64');
        ctx.stub.putState(hashlog, Buffer.from(stringify(hashlog)));
        return JSON.stringify([newaction, hashlog.toString()]);

    }
 

}

module.exports = AIContract;