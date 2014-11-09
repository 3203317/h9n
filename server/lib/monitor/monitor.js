/*!
 * h9n-server
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var utils = require('../../../shared/utils');

var Monitor = function(app, opts){
	var self = this;
	opts = opts || {};
	self.app = app;
};

module.exports = Monitor;

var pro = Monitor.prototype;

pro.start = function(cb){
	// TODO
};

pro.stop = function(cb){
	process.nextTick(function(){
		utils.invokeCallback(cb);
	});
};

pro.reconnect = function(masterInfo){
	var self = this;
	// TODO
};