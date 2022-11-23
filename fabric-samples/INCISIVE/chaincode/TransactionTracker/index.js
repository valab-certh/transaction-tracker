'use strict'


const UserContract = require('./lib/user');
const DataContract = require('./lib/data');
const AIContract = require('./lib/AI');

module.exports.UserContract = UserContract;
module.exports.DataContract = DataContract;
module.exports.AIContract = AIContract;

module.exports.contracts = [UserContract, DataContract, AIContract];