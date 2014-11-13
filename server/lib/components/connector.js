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

var hostFilter = function(ip){
	return checkIp(this.blacklist, ip);
};

var Component = function(app, opts){
	var self = this;
	opts = opts || {};
	opts.hostFilter = hostFilter.bind(self);
	self.app = app;
	self.blacklist = opts.blacklist;
	self.connector = getConnector(app, opts);
}

var pro = Component.prototype;

pro.name = '__connector__';

pro.start = function(cb){
	var self = this;
	self.server = self.app.components.__server__;

	if(!self.server){
		process.nextTick(function(){
			utils.invokeCallback(cb, new Error('no server component'));
		});
		return;
	}
	process.nextTick(cb);
};

pro.afterStart = function(cb){
	var self = this;
	self.connector.start(cb);
	self.connector.on('connection', bindEvents.bind(self));
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

var getConnector = function(app, opts){
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

var getDefaultConnector = function(app, opts){
	var DefaultConnector = require('../connectors/gynconnector');
	var curServer = app.getCurServer();
	return new DefaultConnector(curServer, opts);
}

var checkIp = function(list, ip){
	for(var i in list){
		var exp = new RegExp(list[i]);
		if(exp.test(ip)){
			return true;
		}
	}
	return false;
};

var bindEvents = function(socket){
	var self = this;

	socket.on('disconnect', function(){
		console.log('[%s] Client socket is closed.', utils.format());
	});

	socket.on('error', function (err){
		console.log('[%s] Client socket error: %j.', utils.format(), err);
	});

	socket.on('message', function (msg){
		handleMessage(self, null, msg);
	});
}

var handleMessage = function(self, session, msg){
	self.server.globalHandle(msg, null, function (err, resp, opts){
		console.log('[%s] Client socket msg: %j.', utils.format(), msg);
	});
}
