//Example chaincode for INCISIVE needs

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

          // source: https://bitbucket.org/beyondi-bbd/workspace/snippets/7n5MoM
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





    // pseudonymization action on data recorded on ledger (world state)
    // TODO: In case they are used, check if they will be through the ETL tool to change the actor
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
            Date: new Date(timestamp),
            Action: 'Delete data',
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

 

    // deidentification action on data recorded on ledger (world state)
    async Deidentify(ctx, actor, secret) {

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
            Date: new Date(timestamp),
            Action: 'Deidentify data',
            UserRegistered: '-',
            Data: '-',
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



    // annotation action on data recorded on ledger (world state)
    async Annotate(ctx, actor, secret) {

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
            Action: 'Annotate',
            UserRegistered: '-',
            Data: '-',
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
            Date: new Date(timestamp),
            Action: 'Annotate data using AI algorithms',
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


    // quality check of data action on data recorded on ledger (world state)
    async QualityCheck (ctx, actor, secret) {

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
            Action: 'Data Quality Check',
            UserRegistered: '-',
            Data: '-',
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
            Date: new Date(timestamp),
            Action: 'View data',
            UserRegistered: '-',
            Data: data_id,
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