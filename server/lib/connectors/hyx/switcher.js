/*!
 * h9n-server
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('util'),
        EventEmitter = require('events').EventEmitter;

var utils = require('../../../../shared/utils');

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

	self.server.on('connection', newSocket.bind(self));

	self.state = ST_STARTED;
}

util.inherits(Switcher, EventEmitter);

module.exports = Switcher;

var pro = Switcher.prototype;

function newSocket(socket){
	var self = this;
	if(self.state !== ST_STARTED) return;

	socket.once('data', function (data){
		console.log(data);
	});
}

pro.close = function(){
	var self = this;
	if(self.state != ST_STARTED) return;

	self.state = ST_CLOSED;
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
