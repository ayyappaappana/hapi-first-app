'use strict';

const Confidence = require('confidence');
const Config = require('./config');
const Db = require('./database');

const criteria = {
    env: process.env.NODE_ENV
};

const manifest = {
    server: {
        debug: {
            request: ['error']
        },
        connections: {
            routes: {
                security: true
            }
        }
    },
    connections: [{
        port: Config.server.port
    }]
};


const store = new Confidence.Store(manifest);

exports.get = function (key) {

    return store.get(key, criteria);
};

