/*!
 * h9n-server
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var fs = require('fs'),
	path = require('path');

var application = require('./application'),
	utils = require('../../shared/utils');

var H9nServer = module.exports = {
	version: '1.0.0',	// Current version
	components: {},
	filters: {},
	rpcFilters: {},
	connectors: {}
};

var self = this;

H9nServer.createApp = function(opts, cb){
	var app = application;
	app.init(opts);
	self.app = app;
	cb.bind(app)();
};

Object.defineProperty(H9nServer, 'app', {
	get: function(){
		return self.app;
	}
});

function load(path, name){
	if(name) return require(path + name);
	return require(path);
}
