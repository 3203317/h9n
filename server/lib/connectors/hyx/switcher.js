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

var DEFAULT_TIMEOUT = 90;

var Switcher = function(server /* raw */, opts){
	var self = this;
	EventEmitter.call(self);

	self.server = server;
	self.setNoDelay = opts.setNoDelay || false;

	self.id = 1;
	self.timers = {};
	self.timeout = opts.timeout || DEFAULT_TIMEOUT;

	self.tcpprocessor = new TCPProcessor(opts.closeMethod);

	self.server.on('connection', newSocket.bind(self));

	self.state = ST_STARTED;
}

util.inherits(Switcher, EventEmitter);

module.exports = Switcher;

var pro = Switcher.prototype;

function newSocket(socket){
	var self = this;
	if(self.state !== ST_STARTED) return;

	self.timers[self.id] = setTimeout(function(){
		console.warn('[%s] Socket is timeout, the remote client %s:%s.', utils.format(new Date), socket.remoteAddress, socket.remotePort);
		socket.destroy();
	}, self.timeout * 1000);
	socket.id = self.id++;

	socket.once('data', function (data){
		if(socket.id){
			clearTimeout(self.timers[socket.id]);
			delete self.timers[socket.id];
		}
		if(!isHttp(data)){
			socket.setNoDelay(self.setNoDelay);
			processTcp(self, self.tcpprocessor, socket, data);
		}
	});
}

pro.close = function(){
	var self = this;
	if(self.state != ST_STARTED) return;
	self.state = ST_CLOSED;
	self.tcpprocessor.close();
}

function processHttp(switcher, processor, socket, data){
	processor.add(socket, data);
}

function processTcp(switcher, processor, socket, data){
	processor.add(socket, data);
}

function isHttp(data){
	var head = data.toString('utf8', 0, 4);
	for(var i in HTTP_METHODS){
		if(0 === head.indexOf(HTTP_METHODS[i])){
			return true;
		}
	}
	return false;
}
