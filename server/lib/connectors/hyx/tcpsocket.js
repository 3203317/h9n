/*!
 * h9n-server
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('util'),
	Stream = require('stream');

var utils = require('../../../../shared/utils');

var ST_HEAD = 1,
	ST_BODY = 2,
	ST_CLOSED = 3;

var Socket = function(socket, opts){
	var self = this;
	if(!(self instanceof Socket)){
		return new Socket(socket, opts);
	}

	Stream.call(self);
	self.socket = socket;

	self.state = ST_HEAD;
}

util.inherits(Socket, Stream);

module.exports = Socket;

var pro = Socket.prototype;

pro.send = function(msg, encode, cb){
	this.socket.write(msg, encode, cb);
}

pro.close = function(){
	// TODO
}
