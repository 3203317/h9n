/*!
 * h9n-defend
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var fs = require('fs'),
	path = require('path'),
	cp = require('child_process'),
	exec = cp.exec,
	spawn = cp.spawn;

var nconf = require('nconf'),
	utile = require('utile'),
	winston = require('winston'),
	mkdirp = utile.mkdirp,
	async = utile.async;

var h9ndefend = exports;

h9ndefend.log = function(){};

h9ndefend.log.info = function(){};

h9ndefend.root = process.env.H9NDEFEND_ROOT || path.join(process.env.HOME || process.env.USERPROFILE || '/root', '.h9ndefend');
h9ndefend.config = new nconf.File({ file: path.join(h9ndefend.root, 'config.json') });
h9ndefend.cli = require('./cli');

h9ndefend.list = function(format, cb){
	getAllProcesses(function (processes){
		cb(null, h9ndefend.format(format, processes));
	});
};

h9ndefend.format = function(format, procs){
	if(!procs || 0 === procs.length) return;

	// TODO
};

function getAllProcesses(cb){
	var sockPath = h9ndefend.config.get('sockPath');

	getSockets(sockPath, function (err, sockets){
		if(err || (sockets && 0 === sockets.length)){
			cb(err);
			return;
		}
		async.map(sockets, getProcess, function (err, processes){
			cb(processes.filter(Boolean));
		});
	});
}

function getSockets(sockPath, cb){
	var sockets;

	try{
		sockets = fs.readdirSync(sockPath);
	}catch(e){
		if('ENOENT' !== e.code){
			cb(e);
			return;
		}
	}
	cb(null, sockets);
}

function getProcess(name, next){
	// TODO
}
