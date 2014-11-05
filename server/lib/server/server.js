/*!
 * h9n-server
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var utils = require('../../../shared/utils');

var ST_INITED = 0;
var ST_STARTED = 1;
var ST_STOPED = 2;

module.exports.create = function(app, opts){
	return new Server(app, opts);
}

var Server = function(app, opts){
	var self = this;
	self.opts = opts || {};
	self.state = ST_INITED;
}

var pro = Server.prototype;

pro.start = function(){
	var self = this;
	if(self.state > ST_INITED) return;

	self.state = ST_STARTED;
}

pro.afterStart = function(){
	// TODO
};

pro.stop = function(){
	this.state = ST_STOPED;
}

pro.globalHandle = function(msg, session, cb){
	var self = this;
	if(self.state != ST_STARTED){
		utils.invokeCallback(cb, new Error('server not started'));
		return;
	}

	var routeRecord = parseRoute(msg.route);

	console.log('globalHandle')
}

var parseRoute = function(route){
	if(!route) return;

	var ts = route.split('.');
	if(3 !== ts.length){
		return;
	}

	return {
		route: route,
		serverType: ts[0],
		handler: ts[1],
		method: ts[2]
	};
}
