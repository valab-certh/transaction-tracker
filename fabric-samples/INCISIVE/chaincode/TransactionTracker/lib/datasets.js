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
    async StoreData(ctx, data_id, user, dataType){

        let org = ctx.clientIdentity.getAttributeValue('org');
        let timestamp = ctx.stub.getDateTimestamp();

        const exists = await this.DataExists(ctx, data_id);
        if (!exists) {

           let data = {

                ID: data_id,
                Uploader: user,
                DataProvider: org,
                DateShared: timestamp.toDateString(),
                TimeShared: timestamp.toTimeString(),
                DateModified: timestamp.toDateString(),
                TimeModified: timestamp.toTimeString(),
                Type:dataType   //n represents if data is public or private

            };
            await ctx.stub.putState(data_id, Buffer.from(stringify((data))));
            return JSON.stringify(data);
        }
        else {

            let data = await this.ReadData(ctx, data_id);
            data = JSON.parse(data);
            data.DateModified = timestamp.toDateString();
            data.TimeModified = timestamp.toTimeString();
            await ctx.stub.putState(data_id, Buffer.from(stringify((data))));
            return JSON.stringify(data);
        }
        

    }


    // RemoveData is used when a data provider removes some of the data with data_id.
    // TODO: check if user is eligible to perform this action
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
    async DeleteData(ctx, data_id, user){

        const exists = this.DataExists(ctx, data_id);
        if (!exists) {

            throw new Error(`You can't delete data that does not exist.`);
        }


        let currentData = await this.ReadData(ctx, data_id);

        await ctx.stub.DeleteData(data_id);

        return currentData;

    }



  // ReadData returns the data stored in the world state with given id.
  async ReadData(ctx, data_id) {
    const dataJSON = await ctx.stub.getState(data_id); // get the data from chaincode state
    if (!dataJSON || dataJSON.length === 0) {
      throw new Error(`The data with id ${data_id} does not exist`);
    }

    return dataJSON.toString();
}



    // DataExists returns true when data with the given ID exists in world state.
    async DataExists(ctx, data_id) {
        const dataJSON = await ctx.stub.getState(data_id);
        return dataJSON && dataJSON.length > 0;
  }

}

module.exports = DatasetsContract;