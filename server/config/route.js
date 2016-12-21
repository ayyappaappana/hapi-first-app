'use strict';

var Controller = require('../api/handlers/user');
var fileController = require('../api/handlers/fileupload');

exports.endpoints = [
  { method: 'POST', path: '/user', config:Controller.create},
  { method: 'GET', path: '/user', config: Controller.getAll}, 
  { method: 'GET', path: '/user/{userId}', config: Controller.getOne}, 
  { method: 'POST', path: '/file/upload', config: fileController.uploadFile}, 
  { method: 'PUT', path: '/user/{userId}', config: Controller.update}, 
  { method: 'DELETE', path: '/user/{userId}', config: Controller.remove}];