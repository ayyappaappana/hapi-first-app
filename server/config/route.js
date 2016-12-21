'use strict';

var User = require('../api/handlers/user');

exports.endpoints = [
	{ method: 'POST', path: '/user', config:User.create},
	{ method: 'GET', path: '/user', config: User.getAll}, 
	{ method: 'GET', path: '/user/{userId}', config: User.getOne}, 
	{ method: 'PUT', path: '/user/{userId}', config: User.update}, 
	{ method: 'DELETE', path: '/user/{userId}', config: User.remove},
	{ method: 'POST', path: '/login', config: User.login},
	{ method: 'POST', path: '/verifyEmail', config: User.verifyEmail},
	{ method: 'POST', path: '/forgotPassword', config: User.forgotPassword},
	{ method: 'POST', path: '/resendVerificationEmail', config: User.resendVerificationEmail}
	];