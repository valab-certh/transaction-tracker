//Example chaincode for INCISIVE needs

'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const { Contract } = require('fabric-contract-api');
const crypto = require('crypto');



class UserContract extends Contract {

    constructor(){

        super('UserContract');
    }



    // a new critical action regarding the user will be recorded on the blockchain and saved to world state
    async RegisterUser(ctx, user, role, org, admin, secret) {

        //et array  = this.beforeTransaction(ctx);

        let id = ctx.stub.getTxID();
        // let role = ctx.clientIdentity.getAttributeValue('role');
        // let timestamp = ctx.stub.getTxTimestamp();
        // let timestamp = new Date(ctx.stub.getTxTimestamp().seconds.low*1000).toISOString();
        let timestamp = ctx.stub.getDateTimestamp();
        // let org = ctx.clientIdentity.getAttributeValue('org');
        

        const newaction = {

            ID: id,
            User:user,
            Org: org,
            Role:role,
            Actor: admin,
            Timestamp: timestamp,
            Action: 'Register'

        }


        let stringdata = JSON.stringify(newaction);

        const sha256 = crypto.createHmac("sha256", secret);
        let hashlog = sha256.update(stringdata).digest('base64');
        ctx.stub.putState(hashlog, Buffer.from(stringify(hashlog)));
        return JSON.stringify([newaction, hashlog.toString()]);
    }

    
    // write login action to ledger (world state)
    async Login (ctx, actor, secret) {


        let id = ctx.stub.getTxID();
        let role = ctx.clientIdentity.getAttributeValue('role');
        // let timestamp = ctx.stub.getTxTimestamp();
        // let timestamp = new Date(ctx.stub.getTxTimestamp().seconds.low*1000).toISOString();
        let timestamp = ctx.stub.getDateTimestamp();
        let org = ctx.clientIdentity.getAttributeValue('org');
        

        const newaction = {

            ID: id,
            Actor:actor,
            Org: org,
            Role:role,
            Timestamp: timestamp,
            Action: 'LogIn'

        }

        let stringdata = JSON.stringify(newaction);

        const sha256 = crypto.createHmac("sha256", secret);
        let hashlog = sha256.update(stringdata).digest('base64');

        ctx.stub.putState(hashlog, Buffer.from(stringify(hashlog)));
        return JSON.stringify([newaction, hashlog.toString()]);



    }


    // write logout action to ledger (world state)
    async Logout (ctx, actor, secret) {

        let id = ctx.stub.getTxID();
        let role = ctx.clientIdentity.getAttributeValue('role');
        // let timestamp = ctx.stub.getTxTimestamp();
        // let timestamp = new Date(ctx.stub.getTxTimestamp().seconds.low*1000).toISOString();
        let timestamp = ctx.stub.getDateTimestamp();
        let org = ctx.clientIdentity.getAttributeValue('org');
        

        const newaction = {

            DocType: "Action",
            ID: id,
            Actor:actor,
            Org: org,
            Role:role,
            Timestamp: timestamp,
            Action: 'LogOut'

        }
        

        let stringdata = JSON.stringify(newaction);

        const sha256 = crypto.createHmac("sha256", secret);
        let hashlog = sha256.update(stringdata).digest('base64');
        ctx.stub.putState(hashlog, Buffer.from(stringify(hashlog)));
        return JSON.stringify([newaction, hashlog.toString()]);

    }


    // write login action to ledger (world state)
    async Revoke (ctx, actor, secret) {

        let id = ctx.stub.getTxID();
        let role = ctx.clientIdentity.getAttributeValue('role');
        // let timestamp = ctx.stub.getTxTimestamp();
        // let timestamp = new Date(ctx.stub.getTxTimestamp().seconds.low*1000).toISOString();
        let timestamp = ctx.stub.getDateTimestamp();
        let org = ctx.clientIdentity.getAttributeValue('org');
        

        const newaction = {

            DocType: "Action",
            ID: id,
            Actor:actor,
            Org: org,
            Role:role,
            Timestamp: timestamp,
            Action: 'Revoke user'

        }
        

        let stringdata = JSON.stringify(newaction);

        const sha256 = crypto.createHmac("sha256", secret);
        let hashlog = sha256.update(stringdata).digest('base64');


        ctx.stub.putState(id, Buffer.from(stringify(hashlog)));
        return JSON.stringify([newaction, hashlog.toString()]);


    }



    async LogExists(ctx, hash) {
        const logJSON = await ctx.stub.getState(hash);
        return logJSON && logJSON.length > 0;
      }


    
}

module.exports = UserContract;