//Example chaincode for INCISIVE needs

'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const { Contract } = require('fabric-contract-api');
const shim = require("fabric-shim");

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

    async RegisterModel(ctx, model_id){

        let aiModel = {};

        let exists = await this.ModelExists(ctx, model_id);

        if (!exists){

            aiModel = {    //do we need to keep each score separately (for each question) ?

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


    async VoteReputation(ctx, model_id, vote){

        let model = await this.GetModel(ctx, model_id);
        let currentModel = JSON.parse(model);

        vote = JSON.parse(vote);

        if (vote.hasOwnProperty("q7")) {
            delete vote['q7'];
        }

        let oldVoters = currentModel.TotalVotes;

        // let oldReputation = currentModel.ReputationScore

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


    // AI Exists returns true when the ai Model with the given ID exists in world state.
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


}

module.exports = ReputationContract;