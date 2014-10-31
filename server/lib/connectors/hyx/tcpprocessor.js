/*!
 * h9n-server
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('util'),
        EventEmitter = require('events').EventEmitter;

var utils = require('../../../../shared/utils');

var ST_STARTED = 1;
var ST_CLOSED = 2;

var HEAD_SIZE = 4;

var Processor = function(closeMethod){
	var self = this;
	EventEmitter.call(self);
	self.closeMethod = closeMethod;
	self.state = ST_STARTED;
}

util.inherits(Processor, EventEmitter);

module.exports = Processor;

var pro = Processor.prototype;

pro.add = function(socket, data){
	var self = this;
	if(self.state !== ST_STARTED) return;

	var tcpsocket = new TcpSocket(socket, {
		headSize: HEAD_SIZE,
		closeMethod: self.closeMethod
	});

	self.emit('connection', tcpsocket);
	socket.emit('data', data);
}

pro.close = function(){
	if(this.state !== ST_STARTED) return;
	this.state = ST_CLOSED;
}
