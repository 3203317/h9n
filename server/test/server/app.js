/*!
 * h9n-server
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var utils = require('../../../shared/utils'),
	uplserv = require('../../');

process.on('uncaughtException', function (err){
	console.error('[%s] Caught exception: %j.', utils.format(), err.stack);
});

process.on('exit', function (code){
	if(0 === code){
		console.log('[%s] Process exit.', utils.format())
		return
	}
	console.error('[%s] Process exit with code: %s.', utils.format(), code)
});

uplserv.createApp(null, function(){
	var self = this;

	self.configure('production|development', function(){
		self.filter(uplserv.time());
		self.filter(uplserv.timeout());
	});

	self.configure('production|development', 'uplserv', function(){
		self.set('connectorConfig', {
			connector: uplserv.connectors.hyxconnector,
			heartbeat: 3
		})
	});

	self.start(function (err){
		if(err){
			console.error('[%s] App start error: %s.', utils.format(), err.message);
			return;
		}
	});
});
