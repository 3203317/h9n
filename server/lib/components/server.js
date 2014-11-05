/*!
 * h9n-server
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var utils = require('../../../shared/utils');

var Server = require('../server/server');

module.exports = function(app, opts){
	return new Component(app, opts);
}

var Component = function(app, opts){
	this.server = Server.create(app, opts);
}

var pro = Component.prototype;

pro.name = '__server__';

pro.start = function(cb){
	this.server.start();
	process.nextTick(cb);
};

pro.afterStart = function(cb){
	this.server.afterStart();
	process.nextTick(cb);
}

pro.stop = function(force, cb){
	this.server.stop()
	process.nextTick(cb);
}

pro.handle = function(msg, session, cb){
	this.server.handle(msg, session, cb);
}

pro.globalHandle = function(msg, session, cb){
	this.server.globalHandle(msg, session, cb);
}
