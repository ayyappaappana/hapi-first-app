var Joi = require('joi'),
    Boom = require('boom'),
    fs =  require('fs'),
    multiparty = require('multiparty'),
    Config = require('../../config/config');

exports.uploadFile = {
    payload: {
        maxBytes: 209715200,
        output: 'stream',
        parse: false,
        allow: 'multipart/form-data'
    },
    handler: function(request, reply) {

        var form = new multiparty.Form();
        form.parse(request.payload, function(err, content, files) {
            if (err) return reply(err);
            else upload(files, reply);
        });
    }
};

var upload = function(files, reply) {
    fs.readFile(files.content[0].path, function(err, data) {
        fs.writeFile(Config.MixInsideFolder + files.content[0].originalFilename, data, function(err) {
            if (err) return reply(err);
            else return reply('File uploaded to: ' + Config.MixInsideFolder + files.content[0].originalFilename);

        });
    });
};
