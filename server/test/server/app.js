/*!
 * h9n-server
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var utils = require('../../../shared/utils'),
	speedt = require('../../');

process.on('uncaughtException', function (err){
	if(err){
		console.error('[%s] Caught exception: %j.', utils.format(), err.stack);
	}
});

process.on('exit', function (code){
	if(0 === code){
		console.log('[%s] Process exit.', utils.format())
		return
	}
	console.error('[%s] Process exit with code: %s.', utils.format(), code)
});

var app = speedt.createApp(null, function (err){
	var self = this;
	self.set('name', 'uplserv');
});

app.start(function (err){
	if(err){
		console.error('[%s] App start error: %s.', utils.format(), err.message);
	}
});
