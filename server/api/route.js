'use strict';

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/',
        handler: require('./handlers/home')
    });
    /*server.route({ 
    	method: 'POST', 
    	path: '/messages', 
    	config: handlers.messages });
	server.route({ 
		method: 'POST', 
		path: '/sms', 
		config: handlers.SMSmessages });
		*/
	    next();
	};


exports.register.attributes = {
    name: 'api'
};
