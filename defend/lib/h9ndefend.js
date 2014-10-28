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

var utils = require('../../shared/utils');

var h9ndefend = exports;

var console = h9ndefend.log = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)()
	]
});

h9ndefend.log.cli();


h9ndefend.initialized = false;
h9ndefend.root = process.env.H9NDEFEND_ROOT || path.join(process.env.HOME || process.env.USERPROFILE || '/root', '.h9ndefend');
h9ndefend.config = new nconf.File({ file: path.join(h9ndefend.root, 'config.json') });
h9ndefend.cli = require('./cli');

h9ndefend.stat = function(logFile, script, cb){
	var logAppend;

	if(4 === arguments.length){
		logAppend = cb;
		cb = arguments[3];
	}

	// TODO
};

h9ndefend.list = function(format, cb){
	getAllProcesses(function (processes){
		cb(null, h9ndefend.format(format, processes));
	});
};

h9ndefend.format = function(format, procs){
	if(!procs || 0 === procs.length) return;

	// TODO
};

h9ndefend.load = function(options){
	options = options || {};
	options.logLength = options.logLength || 100;
	options.logStream = options.logStream || false;
	options.root      = options.root      || h9ndefend.root;
	options.pidPath   = options.pidPath   || path.join(options.root, 'pids');
	options.sockPath  = options.sockPath  || path.join(options.root, 'sock');

	h9ndefend.config = new nconf.File({ file: path.join(options.root, 'config.json') });

	try{
		h9ndefend.config.loadSync();
	}catch(e){
		console.error('[%s] Load config error: %j.', utils.format(), e);
	}

	options.columns  = options.columns  || h9ndefend.config.get('columns');
	if(!options.columns){
		options.columns = [
			'uid',
			'command',
			'script',
			'h9ndefend',
			'pid',
			'id',
			'logfile',
			'uptime'
		];
	}

	h9ndefend.config.set('root', options.root);
	h9ndefend.config.set('pidPath', options.pidPath);
	h9ndefend.config.set('sockPath', options.sockPath);
	h9ndefend.config.set('logLength', options.logLength);
	h9ndefend.config.set('logStream', options.logStream);
	h9ndefend.config.set('columns', options.columns);

	options.debug = options.debug || h9ndefend.config.get('debug') || false;
	if(options.debug){
		// TODO
	}

	tryCreate(h9ndefend.config.get('root'));
	tryCreate(h9ndefend.config.get('pidPath'));
	tryCreate(h9ndefend.config.get('sockPath'));

	try {
		h9ndefend.config.saveSync();
	}
	catch(e){
		console.error('[%s] Try save error: %j.', utils.format(), e);
	}

	h9ndefend.initialized = true;
};

function tryCreate(dir){
	if(!dir) return;
	try{
		fs.mkdirSync(dir, '0755');
	}
	catch(e){
		// console.error('[%s] Try create %j error: %j.', utils.format(), dir, e);
	}
}

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

h9ndefend.load();
