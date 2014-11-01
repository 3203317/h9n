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

	socket.on('data', ondata.bind(self));
	socket.on('end', onend.bind(self));
	socket.on('error', self.emit.bind(self, 'error'));
	socket.on('close', self.emit.bind(self, 'close'));

	self.state = ST_HEAD;
}

util.inherits(Socket, Stream);

module.exports = Socket;

var pro = Socket.prototype;

pro.send = function(msg, encode, cb){
	this.socket.write(msg, encode, cb);
}

pro.close = function(){
	try{
		this.socket.destroy();
	}catch(e){
		console.error('[%s] Socket close with destroy error: %j.', utils.format(), e.stack);
	}
}

function ondata(chunk){
	var self = this;

	if(self.state === ST_CLOSED){
		throw new Error('socket has closed');
	}

	self.emit('message', chunk);
	return true;
}

function onend(chunk){
	if(chunk){
		this.socket.write(chunk);
	}

	this.state = ST_CLOSED;
	reset(this)
	this.emit('end');
}

function reset(socket){
	socket.state = ST_HEAD;
}
