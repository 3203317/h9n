/*!
 * h9n-server
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var utils = require('../../../shared/utils');

var Monitor = require('../monitor/monitor');

module.exports = function(app, opts){
	return new Component(app, opts);
}

var Component = function(app, opts){
	this.monitor = new Monitor(app, opts);
}

var pro = Component.prototype;

pro.name = '__monitor__';

pro.start = function(cb){
	this.monitor.start(cb);
	process.nextTick(cb);
};

pro.stop = function(force, cb){
	this.monitor.stop(cb);
};

pro.reconnect = function(masterInfo){
	this.monitor.reconnect(masterInfo);
}