'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const { Contract } = require('fabric-contract-api');

const crypto = require('crypto');

class DataContract extends Contract {

    constructor(){

        super('DataContract');
    }


    // data uploading recorded on ledger (world state)
    // This action is called by a data provider, so user is the data provider
    async UploadData (ctx, data_id, actor, secret) {

        let id = ctx.stub.getTxID();

        let timestamp = ctx.stub.getDateTimestamp();

        const newaction = {


            ID: id,
            User:actor,
            Organisation:actor,
            Role: "Data Provider",
            Date: new Date(timestamp),
            Action: 'Upload data',
            UserRegistered: '-',
            Data: data_id,
            Query: '-',
            ModelName: '-',
            AIservice: '-'

        }

        try{
            await ctx.stub.invokeChaincode('datasets', ['StoreData', data_id, actor], 'mychannel'); //invoke func from another CC

        }

        catch(err){

            throw new Error(err)
        }


        let stringdata = JSON.stringify(newaction);

        const sha256 = crypto.createHmac("sha256", secret);
        let hashlog = sha256.update(stringdata).digest('base64');
        ctx.stub.putState(hashlog, Buffer.from(stringify(hashlog)));
        return JSON.stringify([newaction, hashlog.toString()]);
    }

    // search query for data recorded on ledger (world state)
    async SearchData(ctx, query, actor, secret) {

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
            Action: 'Search for data',
            UserRegistered: '-',
            Data: '-',
            Query: JSON.parse(query),
            ModelName: '-',
            AIservice: '-'

        }


        let stringdata = JSON.stringify(newaction);

        const sha256 = crypto.createHmac("sha256", secret);
        let hashlog = sha256.update(stringdata).digest('base64');
        ctx.stub.putState(hashlog, Buffer.from(stringify(hashlog)));
        return JSON.stringify([newaction, hashlog.toString()]);


    }

   // the returned form the query data data recorded on ledger (world state)
   async ReturnedData(ctx, data, actor, secret) {

    let id = ctx.stub.getTxID();
    let timestamp = ctx.stub.getDateTimestamp();
    let role = ctx.clientIdentity.getAttributeValue('role');
    let org = ctx.clientIdentity.getAttributeValue('org');
    

    const newaction = {

        
        ID: id,
        User:actor,
        Organisation:org,
        Role: role,
        Date: timestamp.toDateString(),
        Time: timestamp.toTimeString(),
        Action: 'Returned data',
        UserRegistered: '-',
        Data: data,
        Query: '-',
        ModelName: '-',
        AIservice: '-'

    }


    let stringdata = JSON.stringify(newaction);

    const sha256 = crypto.createHmac("sha256", secret);
    let hashlog = sha256.update(stringdata).digest('base64');
    ctx.stub.putState(hashlog, Buffer.from(stringify(hashlog)));
    return JSON.stringify([newaction, hashlog.toString()]);


    }


   // chosen data that were selected from the returned ones, recorded on ledger (world state)
   async ChooseData(ctx, data, actor, secret) {

    let id = ctx.stub.getTxID();
    let timestamp = ctx.stub.getDateTimestamp();
    let role = ctx.clientIdentity.getAttributeValue('role');
    let org = ctx.clientIdentity.getAttributeValue('org');
    

    const newaction = {

        ID: id,
        User:actor,
        Organisation:org,
        Role: role,
        Date: timestamp.toDateString(),
        Time: timestamp.toTimeString(),
        Action: 'Choose data',
        UserRegistered: '-',
        Data: data,
        Query: '-',
        ModelName: '-',
        AIservice: '-'

    }


    let stringdata = JSON.stringify(newaction);

    const sha256 = crypto.createHmac("sha256", secret);
    let hashlog = sha256.update(stringdata).digest('base64');
    ctx.stub.putState(hashlog, Buffer.from(stringify(hashlog)));
    return JSON.stringify([newaction, hashlog.toString()]);


    }

}

module.exports = DataContract;