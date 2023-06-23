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
    async RegisterUser(ctx, user, admin, secret) {

        let adminrole = ctx.clientIdentity.getAttributeValue('role');
        let adminorg = ctx.clientIdentity.getAttributeValue('org'); // the admin's organisation
        let id = ctx.stub.getTxID();
        let timestamp = ctx.stub.getDateTimestamp();


        const newaction = {

            ID: id,
            User: admin,
            Organisation: adminorg,
            Role:adminrole,
            Date: new Date(timestamp),
            Action: 'Register User',
            UserRegistered:user,
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

    
    // write login action to ledger (world state)
    async Login (ctx, user, secret) {


        let id = ctx.stub.getTxID();
        let role = ctx.clientIdentity.getAttributeValue('role');
        let timestamp = ctx.stub.getDateTimestamp();
        let org = ctx.clientIdentity.getAttributeValue('org');
        

        const newaction = {

            ID: id,
            User:user,
            Organisation: org,
            Role:role,
            Date: new Date(timestamp),
            Action: 'Log In',
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


    // write logout action to ledger (world state)
    async Logout (ctx, user, secret) {

        let id = ctx.stub.getTxID();
        let role = ctx.clientIdentity.getAttributeValue('role');
        let timestamp = ctx.stub.getDateTimestamp();
        let org = ctx.clientIdentity.getAttributeValue('org');
        

        const newaction = {

            ID: id,
            User:user,
            Organisation: org,
            Role:role,
            Date: new Date(timestamp),
            Action: 'Log Out',
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


    // write login action to ledger (world state)
    async Revoke (ctx, user, secret) {

        let id = ctx.stub.getTxID();
        let role = ctx.clientIdentity.getAttributeValue('role');
        let timestamp = ctx.stub.getDateTimestamp();
        let org = ctx.clientIdentity.getAttributeValue('org');
        

        const newaction = {

            ID: id,
            User:user,
            Organisation: org,
            Role:role,
            Date: new Date(timestamp),
            Action: 'Revoke user',
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



    async LogExists(ctx, hash) {
        const logJSON = await ctx.stub.getState(hash);
        return logJSON && logJSON.length > 0;
      }


    
    // CheckRole checks if the transaction's invoker's role is the one needed for an operation
    async CheckRole(ctx, role_to_check){

        let role = ctx.clientIdentity.getAttributeValue('role');

        if (role != role_to_check){

            throw new Error("You don't have the necessary rights to perform this action");
        }

    }


    // GetRole Org is used to retrive the role and organization attribute of the user
    async GetRoleOrg(ctx){

        let role = ctx.clientIdentity.getAttributeValue('role');
        let org = ctx.clientIdentity.getAttributeValue('org');
        let infoJSON = {}

        if (role == "ADMINISTRATOR"){

            infoJSON = {

                Role: role,
                Organization: org
            }

        }

        else if (role == "ORGANIZATION_ADMINISTRATOR"){

            infoJSON = {

                Role: role,
                Organization: org
            }

        }

        else {
            throw new Error("You don't have the necessary rights to perform this action");
        }

        return JSON.stringify(infoJSON);
    }

    


    // GetOrganisation fetched the user's(invoker's) role
    async GetOrg(ctx){

        let org = ctx.clientIdentity.getAttributeValue('org');

        if (!(org && org.length)){

            throw new Error("The organisation of the user was not found.");
        }

        return JSON.stringify(org);


    }


    // check if user is able to register another user
    async CheckRegistration(ctx, org) {


        let role = ctx.clientIdentity.getAttributeValue('role');
        let regstrOrg = ctx.clientIdentity.getAttributeValue('org');

        if (!(role == "ADMINISTRATOR" || role == "ORGANIZATION_ADMINISTRATOR")){

            throw new Error("You are not allowed to register users.");
        }

        if ((role == "ORGANIZATION_ADMINISTRATOR" && regstrOrg != org)){

            throw new Error("You are not allowed to register users outside your organization.");
        }

    }



    async WriteFailedTx(ctx, hash, log){

        let failedlog = JSON.parse(log);
        // failedlog['FaileTx'] = true;

        ctx.stub.putState(hash, Buffer.from(stringify(failedlog)));

        return failedlog;
    }

    
}

module.exports = UserContract;