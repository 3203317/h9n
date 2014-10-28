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

var nconf = require('nconf');

var h9ndefend = exports;

h9ndefend.log = function(){};

h9ndefend.log.info = function(){};

h9ndefend.root = process.env.H9NDEFEND_ROOT || path.join(process.env.HOME || process.env.USERPROFILE || '/root', '.h9ndefend');
h9ndefend.config = new nconf.File({ file: path.join(h9ndefend.root, 'config.json') });
h9ndefend.cli = require('./cli');

h9ndefend.list = function(format, cb){
	console.log(process.env)
	getAllProcesses(function (processes){
		cb(null);
	});
};

function getAllProcesses(cb){

	getSockets(null, function (err, cb){
		if(err){
			cb(err);
			return;
		}
	});
}

function getSockets(sockPath, cb){
	var sockets;

	try{
		sockets = fs.readdirSync();
	}catch(e){
		if('ENOENT' != e.code){
			cb(e);
			return;
		}
	}
	cb(null, sockets);
}
