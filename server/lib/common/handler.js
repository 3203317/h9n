/*!
 * h9n-server
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var utils = require('../../../shared/utils');

var handlers = {};

var ST_INITED = 0;
var ST_WAIT_ACK = 1;
var ST_WORKING = 2;
var ST_CLOSED = 3;

var handleData = function(socket, pkg){
//	if(socket.state !== ST_WORKING) return;
	socket.emit('message', pkg);
}

handlers[4] = handleData;

var handle = function(socket, pkg){
	var handler = handlers[pkg.type];
	if(handler){
		handler(socket, pkg);
		return;
	}
	console.error('[%s] Could not find handle invalid data package.', utils.format());
	socket.disconnect();
}

module.exports = handle;
