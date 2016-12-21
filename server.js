'use strict';

const Composer = require('./index');
const Routes = require('./server/config/route');

Composer((err, server) => {

    if (err) {
        throw err;
    }
    server.route(Routes.endpoints);
    server.start((error) => {

        if (error) {
            throw error;
        }

        console.log('Started on port ' + server.info.port);
    });

});
