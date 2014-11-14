/*!
 * h9n-server
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('util'),
        EventEmitter = require('events').EventEmitter;

var utils = require('../../../../shared/utils'),
	TCPProcessor = require('./tcpprocessor');

var HTTP_METHODS = [
	'GET',
	'POST',
	'DELETE',
	'PUT',
	'HEAD'
];

var ST_STARTED = 1,
	ST_CLOSED = 2;

var DEFAULT_TIMEOUT = 3;

var Switcher = function(server /* raw */, opts){
	var self = this;
	EventEmitter.call(self);

	self.opts = opts || {};
	opts.setNoDelay = opts.setNoDelay || false;
	opts.timeout = opts.timeout || DEFAULT_TIMEOUT;

	self.server = server;
	self.id = 1;
	self.tcpprocessor = new TCPProcessor(opts.closeMethod);

	server.on('connection', newSocket.bind(self));
	self.tcpprocessor.on('connection', self.emit.bind(self, 'connection'));

	self.state = ST_STARTED;
}

util.inherits(Switcher, EventEmitter);

module.exports = Switcher;

var pro = Switcher.prototype;

var newSocket = function(socket /* raw */){
	var self = this;
	if(self.state !== ST_STARTED) return;

	if(self.opts.hostFilter(socket.remoteAddress)){
		socket.destroy();
		return;
	}

	socket.id = self.id++;
	socket.isdata = false;
	(function (socket){
		var timeout = setTimeout(function(){
			if(!socket.isdata){
				if(socket.remoteAddress){
					console.warn('[%s] Socket is timeout, the remote client %s:%s.', utils.format(), socket.remoteAddress, socket.remotePort);
				}else{
					console.warn('[%s] Socket is already active closed.', utils.format());
				}
				socket.destroy();
			}
			clearTimeout(timeout);
		}, self.opts.timeout * 1000);
	})(socket);

	socket.once('data', ondata.bind(self, socket));
}

pro.close = function(){
	var self = this;
	if(self.state != ST_STARTED) return;
	self.state = ST_CLOSED;
	self.tcpprocessor.close();
}

var processHttp = function(switcher, processor, socket, data){
	processor.add(socket, data);
}

var processTcp = function(switcher, processor, socket, data){
	processor.add(socket, data);
}

var isHttp = function(data){
	var head = data.toString('utf8', 0, 4);
	for(var i in HTTP_METHODS){
		if(0 === head.indexOf(HTTP_METHODS[i])){
			return true;
		}
	}
	return false;
}

var ondata = function(socket, data){
	var self = this;
	socket.isdata = !!(socket.id);
	if(!isHttp(data)){
		socket.setNoDelay(self.opts.setNoDelay);
		processTcp(self, self.tcpprocessor, socket, data);
	}
}