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

exp.loadDefaultComponents = function(app){
	var h9nserver = require('../');
	app.load(h9nserver.connection, app.get('connectionConfig'));
	app.load(h9nserver.connector, app.get('connectorConfig'));
	app.load(h9nserver.server, app.get('serverConfig'));
	app.load(h9nserver.monitor, app.get('monitorConfig'));
};

exp.startByType = function(app, cb){
	utils.invokeCallback(cb);
}

exp.optComponents = function(comps, method, cb){
	async.forEachSeries(comps, function (comp, done){
		if('function' === typeof comp[method]){
			comp[method](done);
			return;
		}
		done()
	}, function (err){
		if(err){
			console.error('[%s] Operate component fail, method: %s, err: %j.', utils.format(), method, err)
		}
		utils.invokeCallback(cb, err)
	})
};

var processArgs = function(app, args){
	delete args.env;
	app.set(Constants.RESERVED.CURRENT_SERVER, args);
}

var setupEnv = function(app, args){
	app.set(Constants.RESERVED.ENV, args.env, true);
}

var configLogger = function(app){
	// TODO
}

var loadLifecycle = function(app){
	// TODO
}

var parseArgs = function(args){
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
