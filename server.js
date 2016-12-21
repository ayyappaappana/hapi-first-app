'use strict';

const Composer = require('./index');
const Routes = require('./server/config/route');

var Moment = require('moment'),//a lightweight JavaScript date library for parsing, validating, manipulating, and formatting dates
    Config = require('./server/config/config');

var privateKey = Config.key.privateKey;
var ttl = Config.key.tokenExpiry;

Composer((err, server) => {

    if (err) {
        throw err;
    }

    var validate = function(token, callback) {
        // Check token timestamp
        var diff = Moment().diff(Moment(token.iat * 1000));
        if (diff > ttl) {
            return callback(null, false);
        }
        callback(null, true, token);
    };

    server.register([{
        register: require('hapi-auth-jwt')
    }], function(err) {
        server.auth.strategy('token', 'jwt', {
            validateFunc: validate,
            key: privateKey
        });
    });
    server.route(Routes.endpoints);

    server.start((error) => {

        if (error) {
            throw error;
        }

        console.log('Started on port ' + server.info.port);
    });

});
