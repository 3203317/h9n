/*!
 * h9n-server
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var path = require('path'),
	fs = require('fs'),
	async = require('async');

var utils = require('../../../shared/utils'),
	Constants = require('./constants');

var exp = module.exports;

exp.defaultConfiguration = function(app){
	var args = parseArgs(process.argv);
	setupEnv(app, args);
	processArgs(app, args);
	configLogger(app);
	loadLifecycle(app);
};

function processArgs(app, args){
	for(var i in args){
		app.set(i, args[i]);
	}
}

function setupEnv(app, args){
	app.set(Constants.RESERVED.ENV, args.env, true);
}

function configLogger(app){
	// TODO
}

function loadLifecycle(app){
	// TODO
}

function parseArgs(args){
	var mainPos = 1

	var argsMap = {
		main: args[1]
	}

	for(var i = ++mainPos, j = args.length; i < j; i++){
		var arg = args[i]
		var sep = arg.indexOf('=')
		if(-1 === sep) continue

		var key = arg.slice(0, sep)
		if(!key) continue

		var value = arg.slice(++sep)
		if(!value) continue

		if(!isNaN(Number(value)) && (value.indexOf('.') < 0)){
			value = Number(value)
		}

		argsMap[key] = value
	}

	argsMap.env = argsMap.env || Constants.RESERVED.ENV_DEV;

	if(argsMap.file){
		var originPath = path.join(path.dirname(argsMap.main), argsMap.file);
		if(fs.existsSync(originPath)){
			var file = require(originPath);
			file = file[argsMap.env];
			for(var i in file){
				var serverInfo = file[i];
				argsMap.serverType = i;

				for(var j in serverInfo){
					argsMap[j] = serverInfo[j];
				}

				break;
			}
		}
	}

	console.log('[%s] App args: %j.', utils.format(), argsMap)

	return argsMap
}
