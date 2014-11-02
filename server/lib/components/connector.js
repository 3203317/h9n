/*!
 * h9n-server
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var utils = require('../../../shared/utils');

module.exports = function(app, opts){
	return new Component(app, opts)
}

var Component = function(app, opts){
	var self = this;
	opts = opts || {}
	self.app = app;
	self.connector = getConnector(app, opts);
}

var pro = Component.prototype;

pro.name = '__connector__';

pro.start = function(cb){
	process.nextTick(cb);
};

pro.afterStart = function(cb){
	var self = this;
	self.connector.start(cb);
	self.connector.on('connection', hostFilter.bind(self, bindEvents));
};

pro.stop = function(force, cb){
	var self = this;
	if(self.connector){
		self.connector.stop(force, cb);
		self.connector = null;
		return;	
	}
	process.nextTick(cb);
};

function getConnector(app, opts){
	var connector = opts.connector;

	if(!connector){
		return getDefaultConnector(app, opts);
	}

	if('function' !== typeof connector){
		return connector;
	}

	var curServer = app.getCurServer();
	return connector(curServer, opts);
}

function getDefaultConnector(app, opts){
	var DefaultConnector = require('../connectors/gynconnector');
	var curServer = app.getCurServer();
	return new DefaultConnector(curServer, opts);
}

function hostFilter(cb, socket){
	var self = this;
	utils.invokeCallback(cb, self, socket);
}

function bindEvents(self, socket){
	var closed = false;

	socket.on('disconnect', function(){
		console.log('[%s] Client socket is closed.', utils.format());
	});

	socket.on('error', function (err){
		console.log('[%s] Client socket error: %j.', utils.format(), err);
	});

	socket.on('message', function (msg){
		console.log('[%s] Client socket msg: %j.', utils.format(), msg);
		handleMessage(self, null, msg);
	});
}

function handleMessage(self, session, msg){
	// TODO
}
