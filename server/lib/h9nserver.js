/*!
 * h9n-server
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var fs = require('fs'),
	path = require('path');

var application = require('./application');

var H9nServer = module.exports = {
	version: '1.0.0',	// Current version
	components: {},
	filters: {},
	rpcFilters: {},
	connectors: {}
};

var self = this;

var load = function(path, name){
	if(name) return require(path + name);
	return require(path);
};

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

Object.defineProperty(H9nServer.connectors, 'hyxconnector', {
	get: load.bind(null, './connectors/hyxconnector')
});

fs.readdirSync(__dirname +'/components').forEach(function (filename){
	if(!/\.js$/.test(filename)) return
	var name = path.basename(filename, '.js')
	var _load = load.bind(null, './components/', name)
	Object.defineProperty(H9nServer, name, { get: _load })
})

fs.readdirSync(__dirname +'/filters/handler').forEach(function (filename){
	if(!/\.js$/.test(filename)) return
	var name = path.basename(filename, '.js')
	var _load = load.bind(null, './filters/handler/', name)
	Object.defineProperty(H9nServer, name, { get: _load })
});
