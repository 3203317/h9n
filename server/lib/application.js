/*!
 * h9n-server
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var path = require('path'),
	fs = require('fs'),
	EventEmitter = require('events').EventEmitter;

var utils = require('../../shared/utils');

var Application = module.exports = {};

var STATE_INITED  = 1;	// app has inited
var STATE_START   = 2;	// app start
var STATE_STARTED = 3;	// app has started
var STATE_STOPED  = 4;	// app has stoped

Application.init = function(opts){
	var self = this;
	opts = opts || {};

	self.settings = {};
	self.state = STATE_INITED;

	console.log('[%s] App inited: %s.', utils.format());
	return self;
};

Application.set = function(key, val){
	this.settings[key] = val;
	return this;
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