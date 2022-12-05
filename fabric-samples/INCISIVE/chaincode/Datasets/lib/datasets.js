//Example chaincode for INCISIVE needs

'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const { Contract } = require('fabric-contract-api');

class DatasetsContract extends Contract {


    constructor(){

        super('DatasetsContract');
    }

    // StoreData is used to store metadata about the medical dataon the ledger, either it is about new data or add data to existing data.
    // TODO: Add check if user is a data provider and can upload data
    async StoreData(ctx, data, user, dataType){

        let org = ctx.clientIdentity.getAttributeValue('org');
        let timestamp = ctx.stub.getDateTimestamp();


        let data_id = data.split(",");



        // Multiple patients or different data might be uploaded at once, that's why the following implementation

        for (let i=0; i<data_id.length; i++){

            let exists = await this.DataExists(ctx, data_id[i]);
            if (!exists) {

            let data = {

                    ID: data_id[i],
                    Uploader: user,
                    DataProvider: org,
                    DateShared: timestamp.toDateString(),
                    TimeShared: timestamp.toTimeString(),
                    DateModified: timestamp.toDateString(),
                    TimeModified: timestamp.toTimeString(),
                    Type:dataType   //n represents if data is public or private

                };
                await ctx.stub.putState(data_id[i], Buffer.from(stringify((data))));

            }

            else {

                let data = await this.ReadData(ctx, data_id[i]);
                data = JSON.parse(data);
                data.DateModified = timestamp.toDateString();
                data.TimeModified = timestamp.toTimeString();
                await ctx.stub.putState(data_id[i], Buffer.from(stringify((data))));
            }
        
        }

        
    }


    // RemoveData is used when a data provider removes some of the data with data_id.
    // TODO: check if user is eligible to perform this action
    // TODO: Check if user will be able to remove multiple data at once
    async RemoveData(ctx, data_id, user) {

        let timestamp = ctx.stub.getDateTimestamp();

        const exists = this.DataExists(ctx, data_id);
        if (!exists) {

            throw new Error(`You can't remove data that does not exist.`);
        }

        let currentData = await this.ReadData(ctx, data_id);
        currentData.DateModified = timestamp.toDateString();
        currentData.TimeModified = timestamp.toTimeString();


        await ctx.stub.putState(data_id, Buffer.from(stringify(sortKeysRecursive(currentData))));
        return currentData;

    }


    // DeleteData is used when data is permanently deleted from the repository
    // TODO: check if user is elegible to perform this action
    // TODO: Check if user will be able to delete multiple data at once
    async DeleteData(ctx, data_id, user){

        const exists = this.DataExists(ctx, data_id);
        if (!exists) {

            throw new Error(`You can't delete data that does not exist.`);
        }


        let currentData = await this.ReadData(ctx, data_id);

        await ctx.stub.DeleteData(data_id);

        return currentData;

    }



    // DataExists returns true when data with the given ID exists in world state.
    async DataExists(ctx, data_id) {
        const dataJSON = await ctx.stub.getState(data_id);
        return dataJSON && dataJSON.length > 0;
    }



    async GetDataProvider(ctx, data){

        let currentData = await this.ReadData(ctx, data);

        currentData = JSON.parse(currentData);

        return currentData.DataProvider;
    }


    // Get Dataset retrieves information about a specific dataset if it exists.
    async GetDataset(ctx, data_id){

        const dataJSON = await ctx.stub.getState(data_id);
        if ( !dataJSON || dataJSON.length ==0 ){

            throw new Error (`The dataset ${data_id} does not exist.`);
        }

        return dataJSON.toString();
    }


    async GetAllAssets(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } 
            catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: result.value.key, Record: record });
            result = await iterator.next();
        }
        return allResults;
    }
    
    // GetDatasetOrg returns all datasets belonging to a specific data provider (organization)
    async GetDatasetOrg(ctx){

        let role = ctx.clientIdentity.getAttributeValue('role');

        if (!(role == "MEDICAL_PERSONNEL" || role == "ORGANIZATION_ADMINISTRATOR")){

            throw new Error("You are not allowed to check information about data used.");
        }

        let org = ctx.clientIdentity.getAttributeValue('org');

        let allDatasets = await this.GetAllAssets(ctx); // get all assets
        let datasetsOfOrg = allDatasets.filter( (dataset) => dataset.Record.DataProvider === org); // filter by type

        return JSON.stringify(datasetsOfOrg);
    }



    // CheckDataLogs checks if a user can check the logs based on specific data
    async CheckDataLogs(ctx, data){

        let role = ctx.clientIdentity.getAttributeValue('role');

        if (!(role == "MEDICAL_PERSONNEL" || role == "ORGANIZATION_ADMINISTRATOR")){

            throw new Error("You are not allowed to check information about data used.");
        }

        let org = ctx.clientIdentity.getAttributeValue('org');

        // let dataorg = await new Datasets().GetDataProvider(ctx, data);
        let dataorg = await this.GetDataProvider(ctx,data); //invoke func from another CC
        

        if (!(org == dataorg)){

            throw new Error("You are not allowed to check information about data that don't belong to your organization.");
        }



    }

}

module.exports = DatasetsContract;