/*!
 * h9n-server
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var path = require('path'),
	fs = require('fs'),
	EventEmitter = require('events').EventEmitter;

var utils = require('../../shared/utils'),
	appUtil = require('./util/appUtil'),
	Constants = require('./util/constants');

var Application = module.exports = {};

var STATE_INITED  = 1;	// app has inited
var STATE_START   = 2;	// app start
var STATE_STARTED = 3;	// app has started
var STATE_STOPED  = 4;	// app has stoped

Application.init = function(opts){
	var self = this;
	opts = opts || {};

	self.settings = {};

	appUtil.defaultConfiguration(self);

	self.state = STATE_INITED;
	console.log('[%s] App inited: %j.', utils.format(), self.getServerId());
	return self;
};

Application.start = function(cb){
	var self = this;
	self.startTime = Date.now();
	if(self.state > STATE_INITED){
		utils.invokeCallback(cb, new Error('app has already start'));
		return;
	}
	return self;
};

Application.getServerId = function(){
	return this.get(Constants.RESERVED.STARTID)
};

Application.set = function(key, val){
	this.settings[key] = val;
	return this;
};

Application.get = function(key){
	return this.settings[key];
};