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
	check(args);
	setupEnv(app, args);
	processArgs(app, args);
};

function check(args){
	if(!args.id){
		throw new Error('not found server id');
	}
}

function processArgs(app, args){
	// TODO
	app.set(Constants.RESERVED.CURRENT_SERVER, args, true)
	var curServer = app.get(Constants.RESERVED.CURRENT_SERVER);
	app.set(Constants.RESERVED.STARTID, curServer.id, !0)
}

function setupEnv(){
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

	console.log('[%s] App args: %j.', utils.format(), argsMap)

	return argsMap
}