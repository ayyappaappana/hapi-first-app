'use strict';

const Glue = require('glue');
const Manifest = require('./server/config/manifest');


const composeOptions = {
    relativeTo: __dirname
};


module.exports = Glue.compose.bind(Glue, Manifest.get('/'), composeOptions);
