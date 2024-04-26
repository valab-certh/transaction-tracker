'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const { Contract } = require('fabric-contract-api');

class DatasetsContract extends Contract {


    constructor(){

        super('DatasetsContract');
    }

    // StoreData is used to store metadata about the medical dataon the ledger, either it is about new data or add data to existing data.
    async StoreData(ctx, data, user){

        let timestamp = ctx.stub.getDateTimestamp();


        let data_id = data.split(",");



        // Multiple patients or different data might be uploaded at once
        for (let i=0; i<data_id.length; i++){

            let exists = await this.DataExists(ctx, data_id[i]);
            if (!exists) {

            let data = {

                    ID: data_id[i],
                    Uploader: user,
                    DataProvider: user,
                    DateShared: timestamp.toDateString(),
                    TimeShared: timestamp.toTimeString(),
                    DateModified: timestamp.toDateString(),
                    TimeModified: timestamp.toTimeString()


                };
                await ctx.stub.putState(data_id[i], Buffer.from(stringify((data))));

            }

            else {

                let data = await this.GetDataset(ctx, data_id[i]);
                data = JSON.parse(data);
                data.DateModified = timestamp.toDateString();
                data.TimeModified = timestamp.toTimeString();
                await ctx.stub.putState(data_id[i], Buffer.from(stringify((data))));
            }
        
        }

        
    }

    // DataExists returns true when data with the given ID exists in world state.
    async DataExists(ctx, data_id) {
        const dataJSON = await ctx.stub.getState(data_id);
        return dataJSON && dataJSON.length > 0;
    }


    // GetDataProvider is used to retrieve the data provider of the specified data
    async GetDataProvider(ctx, data){

        let currentData = await this.GetDataset(ctx, data);

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

    // GetAllAssets retrieves all assets from ledger
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

        if (!(role.includes("MEDICAL_PERSONNEL")  || role.includes("ORGANIZATION_ADMINISTRATOR"))){

            throw new Error("You are not allowed to check information about data used.");
        }

        let org = ctx.clientIdentity.getAttributeValue('org');

        let allDatasets = await this.GetAllAssets(ctx); 
        let datasetsOfOrg = allDatasets.filter( (dataset) => dataset.Record.DataProvider === org);

        return JSON.stringify(datasetsOfOrg);
    }



    // CheckDataPermission checks if a user can check the logs based on specific data
    async CheckDataPermissions(ctx, data_id){

        let role = ctx.clientIdentity.getAttributeValue('role');

        if (!(role.includes("MEDICAL_PERSONNEL")  || role.includes("ORGANIZATION_ADMINISTRATOR"))){

            throw new Error("You are not allowed to check information about data used.");
        }

        let org = ctx.clientIdentity.getAttributeValue('org');
        const data = await this.GetDataset(ctx,data_id);
        let dataJSON = JSON.parse(data);
        
        if ( !dataJSON || dataJSON.length ==0 ){

            throw new Error (`The dataset ${data_id} does not exist.`);
        }
        
        if (!(org == dataJSON.DataProvider)){

            throw new Error("You are not allowed to check information about data that don't belong to your organization.");
        }

        
        return JSON.stringify(dataJSON.DataProvider);


    }

}

module.exports = DatasetsContract;