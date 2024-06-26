'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const { Contract } = require('fabric-contract-api');

const weights = {
    "q1": 0.25,
    "q2":0.2,
    "q3": 0.25,
    "q4":0.1,
    "q5": 0.1,
    "q6": 0.1
};

class ReputationContract extends Contract {


    constructor(){

        super('ReputationContract');
    }

    // RegisterModel is used to register the AI model on the ledger
    async RegisterModel(ctx, model_id){

        let aiModel = {};

        let exists = await this.ModelExists(ctx, model_id);

        if (!exists){

            aiModel = {

                ID: model_id,
                ReputationScore: 0,
                TotalVotes:0
            };
    
            await ctx.stub.putState(model_id, Buffer.from(stringify((aiModel))))
        }

        else {

            throw new Error (`AI Service ${model_id} already exists`)
        }

        return JSON.stringify(aiModel);
    }


    // VoteReputation is used to calculate the reputation score of the AI service
    async VoteReputation(ctx, model_id, vote){

        let model = await this.GetModel(ctx, model_id);
        let currentModel = JSON.parse(model);

        vote = JSON.parse(vote);

        if (vote.hasOwnProperty("q7")) {
            delete vote['q7'];
        }

        let oldVoters = currentModel.TotalVotes;

        currentModel.TotalVotes += 1; 

        let newSum = 0;

        const voteKeys = Object.keys(vote).sort();
        const weightKeys = Object.keys(weights).sort();

        // Compare the sorted arrays of keys
        if ( JSON.stringify(voteKeys) !== JSON.stringify(weightKeys)){

            throw new Error("Inconsistent keys...");
        }


        Object.keys(vote).forEach(key => {

            if (vote[key] <= 0 || vote[key] > 5){

                throw new Error("Please vote in a 1-5 scale...")
            }

            newSum += vote[key]*weights[key];
        });

        currentModel.ReputationScore = ((currentModel.ReputationScore*oldVoters + newSum)/currentModel.TotalVotes).toFixed(2);

        if (currentModel.ReputationScore > 5){

            currentModel.ReputationScore = 5;
        }

        else if (currentModel.ReputationScore < 0){
            
            currentModel.ReputationScore = 0;
        }

        await ctx.stub.putState(model_id, Buffer.from(stringify((currentModel))))

        return JSON.stringify(currentModel);

    }


    // ModelExists returns true when the ai Model with the given ID exists in world state.
    async ModelExists(ctx, model_id) {
        const model = await ctx.stub.getState(model_id);
        return model && model.length > 0;

    }


    async GetModel(ctx, model_id){

        const model = await ctx.stub.getState(model_id);
        if ( !model || model.length ==0 ){

            throw new Error (`The AI service ${model_id} does not exist.`);
        }

        // model = JSON.parse(model);
        // return JSON.stringify(model);
        return model.toString();
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

}

module.exports = ReputationContract;