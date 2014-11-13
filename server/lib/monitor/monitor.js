/*!
 * h9n-server
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var admin = require('../../../admin');

var utils = require('../../../shared/utils'),
	Constants = require('../util/constants');

var Monitor = function(app, opts){
	var self = this;
	opts = opts || {};
	self.app = app;
	self.serverInfo = app.getCurServer();
	self.modules = [];

	self.monitorConsole = admin.createMonitorConsole({
		id: self.serverInfo.id,
		env: self.app.get(Constants.RESERVED.ENV),
		info: self.serverInfo,
		type: self.serverInfo.serverType
	});
};

module.exports = Monitor;

var pro = Monitor.prototype;

pro.start = function(cb){
	this.startConsole(cb);
};

pro.startConsole = function(cb){
	var self = this;

	self.monitorConsole.on('error', function(err){
		console.error('[%s] monitorConsole encounters with error: %j.', utils.format(), err.stack);
	});

	self.monitorConsole.start(function (err){
		if(err){
			utils.invokeCallback(cb, err);
			return;
		}
	});

	utils.invokeCallback(cb);
};

pro.stop = function(cb){
	this.monitorConsole.stop();
	this.modules = [];
	process.nextTick(function(){
		utils.invokeCallback(cb);
	});
};