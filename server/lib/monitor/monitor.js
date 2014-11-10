/*!
 * h9n-server
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var admin = require('../../../admin');

var utils = require('../../../shared/utils');

var Monitor = function(app, opts){
	var self = this;
	opts = opts || {};
	self.app = app;
	self.serverInfo = app.getCurServer();
	self.modules = [];

	self.monitorConsole = admin.createMonitorConsole({
		id: self.serverInfo.id
	});
};

module.exports = Monitor;

var pro = Monitor.prototype;

pro.start = function(cb){
	utils.invokeCallback(cb);
};

pro.stop = function(cb){
	this.modules = [];
	process.nextTick(function(){
		utils.invokeCallback(cb);
	});
};