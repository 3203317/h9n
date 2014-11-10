/*!
 * h9n-admin
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('util'),
	EventEmitter = require('events').EventEmitter;

var ConsoleService = function(opts){
	var self = this;
	EventEmitter.call(self);
};

util.inherits(ConsoleService, EventEmitter);

var pro = ConsoleService.prototype;

pro.start = function(cb){
	// TODO
};

module.exports.createMonitorConsole = function(opts){
	return new ConsoleService(opts);
};