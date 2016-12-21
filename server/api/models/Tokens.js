var Mongoose = require('mongoose'),
    Schema = Mongoose.Schema;

var Joi = require('joi');

var TokensSchema = new Schema({
    // saves user email, validation of email address is done in paylod
    userId: {
        type: String
    },
    token: {
        type: String
    },
    deviceId: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

var tokens = Mongoose.model('tokens', TokensSchema);
module.exports = {
    Tokens: tokens
};