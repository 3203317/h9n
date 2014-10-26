/*!
 * h9n-server
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var utils = require('../../../shared/utils'),
	speedt = require('../../');

var app = speedt.createApp();
app.set('name', 'uplserv');

app.start(function (err){
	if(err){
		console.error('[%s] App start error: %s.', utils.format(), err.message);
	}
});

process.on('uncaughtException', function (err){
	// TODO
});

process.on('exit', function (code){
	// TODO
});