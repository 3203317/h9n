/*!
 * h9n-server
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('util'),
	EventEmitter = require('events').EventEmitter,
	net = require('net');

var utils = require('../../../shared/utils'),
	Switcher = require('./hyx/switcher'),
	HyxSocket = require('./hyxsocket');

var curId = 1;

var Connector = function(server, opts){
	var self = this;
	if(!(self instanceof Connector)){
		return new Connector(server, opts);
	}

	EventEmitter.call(self);

	self.opts = opts || {};
	self.server = server;
	self.distinctHost = opts.distinctHost;
	self.ssl = opts.ssl;
};

util.inherits(Connector, EventEmitter);

module.exports = Connector;

var pro = Connector.prototype;

pro.start = function(cb){
	var self = this;

	if(!self.ssl){
		self.tcpServer = net.createServer();
		self.switcher = new Switcher(self.tcpServer, self.opts);
		self.switcher.on('connection', newSocket.bind(self));
		if(self.distinctHost){
			self.tcpServer.listen(self.server.clientPort, self.server.host, started.bind(self));
		}else{
			self.tcpServer.listen(self.server.clientPort, started.bind(self));
		}
	}
	process.nextTick(cb)
};

pro.stop = function(force, cb){
	var self = this;
	if(self.switcher) self.switcher.close();
	if(self.tcpServer) self.tcpServer.close();
	process.nextTick(cb);
}

function newSocket(socket){
	console.log('[%s] New socket: %s:%s.', utils.format(), socket.socket.remoteAddress, socket.socket.remotePort);
	gensocket.bind(this, socket)();
}

function gensocket(socket){
	var self = this;
	var hyxsocket = new HyxSocket(curId++, socket);
	self.emit('connection', hyxsocket);
}

function started(){
	console.log('[%s] TcpServer started: %j.', utils.format(), this.server.id);
}
