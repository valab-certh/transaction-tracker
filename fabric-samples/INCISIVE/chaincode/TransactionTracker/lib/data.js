//Example chaincode for INCISIVE needs

'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const { Contract } = require('fabric-contract-api');
const Datasets = require('./datasets');
const crypto = require('crypto');

class DataContract extends Contract {

    constructor(){

        super('DataContract');
    }


    // data uploading recorded on ledger (world state)
    async UploadData (ctx, data_id, actor, secret) {

        let id = ctx.stub.getTxID();
        // let timestamp = ctx.stub.getTxTimestamp();
        // let timestamp = new Date(ctx.stub.getTxTimestamp().seconds.low*1000).toISOString();
        let timestamp = ctx.stub.getDateTimestamp();
        let role = ctx.clientIdentity.getAttributeValue('role');
        let org = ctx.clientIdentity.getAttributeValue('org');

        //let granted;

        const newaction = {


            ID: id,
            User:actor,
            Organisation:org,
            Role: role,
            Date: timestamp.toDateString(),
            Time: timestamp.toTimeString(),
            Action: 'Upload data',
            Data: data_id

        }




        let data = await new Datasets().StoreData(ctx, data_id, actor, "Public");


        let stringdata = JSON.stringify(newaction);

        const sha256 = crypto.createHmac("sha256", secret);
        let hashlog = sha256.update(stringdata).digest('base64');
        ctx.stub.putState(id, Buffer.from(stringify(hashlog)));
        return JSON.stringify([newaction, hashlog.toString()]);
    }



    // pseudonymization action on data recorded on ledger (world state)
    async UpdateData(ctx, data, actor, secret) {

        let id = ctx.stub.getTxID();
        // let timestamp = ctx.stub.getTxTimestamp();
        // let timestamp = new Date(ctx.stub.getTxTimestamp().seconds.low*1000).toISOString();
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
            Action: 'Update data',
            Data: data

        }

        let stringdata = JSON.stringify(newaction);

        const sha256 = crypto.createHmac("sha256", secret);
        let hashlog = sha256.update(stringdata).digest('base64');
        ctx.stub.putState(id, Buffer.from(stringify(hashlog)));
        return JSON.stringify([newaction, hashlog.toString()]);

    }



    // pseudonymization action on data recorded on ledger (world state)
    async DeleteData(ctx, data, actor, secret) {

        let id = ctx.stub.getTxID();
        // let timestamp = ctx.stub.getTxTimestamp();
        // let timestamp = new Date(ctx.stub.getTxTimestamp().seconds.low*1000).toISOString();
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
            Action: 'Delete data',
            Data: data

        }

        let stringdata = JSON.stringify(newaction);

        const sha256 = crypto.createHmac("sha256", secret);
        let hashlog = sha256.update(stringdata).digest('base64');
        ctx.stub.putState(id, Buffer.from(stringify(hashlog)));
        return JSON.stringify([newaction, hashlog.toString()]);


    }

 

    // deidentification action on data recorded on ledger (world state)
    async Deidentify(ctx, data, actor, secret) {

        let id = ctx.stub.getTxID();
        // let timestamp = ctx.stub.getTxTimestamp();
        // let timestamp = new Date(ctx.stub.getTxTimestamp().seconds.low*1000).toISOString();
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
            Action: 'Deidentify data',
            Data: data

        }

        let stringdata = JSON.stringify(newaction);

        const sha256 = crypto.createHmac("sha256", secret);
        let hashlog = sha256.update(stringdata).digest('base64');
        ctx.stub.putState(id, Buffer.from(stringify(hashlog)));
        return JSON.stringify([newaction, hashlog.toString()]);

    }



    // annotation action on data recorded on ledger (world state)
    async Annotate(ctx, data, actor, secret) {

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
            Action: 'Annotate',
            Data: data

        }


        let stringdata = JSON.stringify(newaction);

        const sha256 = crypto.createHmac("sha256", secret);
        let hashlog = sha256.update(stringdata).digest('base64');
        ctx.stub.putState(id, Buffer.from(stringify(hashlog)));
        return JSON.stringify([newaction, hashlog.toString()]);


    }



    // annotation action on data using AI algorithms recorded on ledger (world state)
    async AnnotateAI(ctx, data, actor, secret) {

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
            Action: 'Annotate data using AI algorithms',
            Data: data

        }


        let stringdata = JSON.stringify(newaction);

        const sha256 = crypto.createHmac("sha256", secret);
        let hashlog = sha256.update(stringdata).digest('base64');
        ctx.stub.putState(id, Buffer.from(stringify(hashlog)));
        return JSON.stringify([newaction, hashlog.toString()]);


    }


    // quality check of data action on data recorded on ledger (world state)
    async QualityCheck (ctx, data, actor, secret) {

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
            Action: 'Data Quality Check',
            Data: data

        }


        let stringdata = JSON.stringify(newaction);

        const sha256 = crypto.createHmac("sha256", secret);
        let hashlog = sha256.update(stringdata).digest('base64');
        ctx.stub.putState(id, Buffer.from(stringify(hashlog)));
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
            Date: timestamp.toDateString(),
            Time: timestamp.toTimeString(),
            Action: 'Search for data',
            Query: JSON.parse(query)

        }


        let stringdata = JSON.stringify(newaction);

        const sha256 = crypto.createHmac("sha256", secret);
        let hashlog = sha256.update(stringdata).digest('base64');
        ctx.stub.putState(id, Buffer.from(stringify(hashlog)));
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
        Data: data

    }


    let stringdata = JSON.stringify(newaction);

    const sha256 = crypto.createHmac("sha256", secret);
    let hashlog = sha256.update(stringdata).digest('base64');
    ctx.stub.putState(id, Buffer.from(stringify(hashlog)));
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
        Data: data

    }


    let stringdata = JSON.stringify(newaction);

    const sha256 = crypto.createHmac("sha256", secret);
    let hashlog = sha256.update(stringdata).digest('base64');
    ctx.stub.putState(id, Buffer.from(stringify(hashlog)));
    return JSON.stringify([newaction, hashlog.toString()]);


    }



    // ViewData is the action that creates the log for (pre)viewing some data
    async ViewData(ctx, data_id, user, secret){


        let id = ctx.stub.getTxID();
        // let timestamp = ctx.stub.getTxTimestamp();
        // let timestamp = new Date(ctx.stub.getTxTimestamp().seconds.low*1000).toISOString();
        let timestamp = ctx.stub.getDateTimestamp();
        let role = ctx.clientIdentity.getAttributeValue('role');
        let org = ctx.clientIdentity.getAttributeValue('org');

        //let granted;

        const newaction = {


            ID: id,
            User:user,
            Organisation:org,
            Role: role,
            Date: timestamp.toDateString(),
            Time: timestamp.toTimeString(),
            Action: 'View data',
            Data: data_id

        }


        let stringdata = JSON.stringify(newaction);

        const sha256 = crypto.createHmac("sha256", secret);
        let hashlog = sha256.update(stringdata).digest('base64');
        ctx.stub.putState(id, Buffer.from(stringify(hashlog)));
        return JSON.stringify([newaction, hashlog.toString()]);
    }


}

module.exports = DataContract;