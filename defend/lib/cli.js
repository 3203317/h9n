/*!
 * h9n-defend
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var fs = require('fs'),
	path = require('path'),
	util = require('util');

var flatiron = require('flatiron');

var cli = exports,
	h9ndefend = require('./h9ndefend'),
	utils = require('../../shared/utils'),
	console = h9ndefend.log,
	app = flatiron.app;

var actions = [
	'start',
	'stop',
	'stopall',
	'restart',
	'restartall',
	'list',
	'config',
	'set',
	'clear',
	'logs',
	'columns',
	'cleanlogs'
];

var help = [
	'usage: h9ndefend [action] [options] SCRIPT [script-options]',
	'',
	'Monitors the script specified in the current process or as a daemon',
	'',
	'actions:',
	'  start	Start SCRIPT as a daemon',
	'  stop		Stop the daemon SCRIPT',
	'  list		List all running h9ndefend scripts',
	'',
	'options:',
	'  -h, --help	You\'re staring at it'
];

var argvOptions = cli.argvOptions = {
	'command': {
		alias: 'c'
	}, 'errFile': {
		alias: 'e'
	}, 'logFile': {
		alias: 'l'
	}, 'killTree': {
		alias: 't',
		boolean: true
	}, 'help': {
		alias: 'h'
	},
};

app.use(flatiron.plugins.cli, {
	argv: argvOptions,
	usage: help
});

app.cmd('help', cli.help = function(){
	util.puts(help.join('\n'));
});

app.cmd(/start (.+)/, cli.startDaemon = function(){
	var file = app.argv._[1],
		options = getOptions(file);

	console.info('[%s] H9ndefend processing file: %s.', utils.format(), file.grey);
});

app.cmd('list', cli.list = function(){
	h9ndefend.list(true, function (err, processes){
		if(processes){
			console.info('[%s] H9ndefend processes is running.', utils.format());
		}else{
			console.warn('[%s] H9ndefend processes is not running.', utils.format());
		}
	});
});

cli.start = function(){
	app.init(function(){
		app.start();
	});
};


var getOptions = cli.getOptions = function (file){
	var options = {};
};
