//Example chaincode for INCISIVE needs

'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const { Contract } = require('fabric-contract-api');

class DatasetsContract extends Contract {


    constructor(){

        super('DatasetsContract');
    }


    async StoreData(ctx, actor, data_id, rights){

        let org = ctx.clientIdentity.getAttributeValue('org');
        let date = ctx.stub.getDateTimestamp();

        let newdata = {};
        let granted;

        // let queryString = {};
		// queryString.selector = {};
		// queryString.selector.DocType = 'Dataset';
		// queryString.selector.ID = data_id;
		// let datasetAsBytes = await ctx.stub.getQueryResult(JSON.stringify(queryString));


        if (ctx.clientIdentity.assertAttributeValue('role', 'hcp')){

            granted = true;

            let datasetAsBytes = await ctx.stub.getState(data_id);
            if (!datasetAsBytes || !datasetAsBytes.toString()) {
    
                newdata = {
    
                    DocType: "Dataset",
                    ID: data_id,
                    AccessRights: rights,
                    Uploader: actor,
                    Org: org,
                    Date_uploaded: date,
                    Date_modified: date,
                    Deleted: false
        
                };
        
        
                ctx.stub.putState(data_id, Buffer.from(stringify(newdata)));
                
            }

        }

        else {

            granted = false;

        }

        return [JSON.stringify(newdata), granted];

    }


    async UpdateData(ctx, identity, data_id){


        let queryString = {};
		queryString.selector = {};
		queryString.selector.DocType = 'Dataset';
		queryString.selector.ID = data_id;
		let datasetAsBytes = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        let dataset = JSON.parse(datasetAsBytes.toString());
        let uploader = dataset.Uploader;

        //TODO: Access control on data
        

        //if (ctx.clientIdentity.assertAttributeValue('role', 'hcp'));


        if (datasetAsBytes && datasetAsBytes.toString()){

            if ( uploader == identity) {

                dataset.Date_modified = tx.stub.getDateTimestamp();

                ctx.stub.putState(data_id, Buffer.from(stringify(dataset)));
            }
        }


        return JSON.stringify(newdata);

    }

}

module.exports = DatasetsContract;