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
	_console = h9ndefend.log,
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

var tryStart = function(file, options, cb){
	var fullLog, fullScript;

	if(options.path){
		h9ndefend.config.set('root', options.path);
		h9ndefend.root = options.path;
	}

	h9ndefend.stat(fullLog, fullScript, options.append, function (err){
		if(err){
			_console.error('[%s] Cannot start h9ndefend.', utils.format());
			_console.error('[%s] %j.', err.message);
			process.exit(-1);
		}
		cb();
	});
}

app.cmd('help', cli.help = function(){
	util.puts(help.join('\n'));
});

app.cmd(/start (.+)/, cli.startDaemon = function(){
	var file = app.argv._[1],
		options = getOptions(file);

	_console.info('[%s] H9ndefend processing file: %s.', utils.format(), file.grey);

	tryStart(file, options, function(){
		h9ndefend.startDaemon(file, options);
	});
});

app.cmd('list', cli.list = function(){
	h9ndefend.list(true, function (err, processes){
		if(processes){
			_console.info('[%s] H9ndefend processes is running.', utils.format());
		}else{
			_console.warn('[%s] H9ndefend processes is not running.', utils.format());
		}
	});
});

cli.run = function(){
	// TODO
};

cli.start = function(){
	if(app.argv.version){
		console.log('v%s', h9ndefend.version);
		return;
	}

	if(app.config.get('help')){
		return util.puts(help.join('\n'))
	}

	app.init(function(){
		if(app.argv._.length && -1 === actions.indexOf(app.argv._[0])){
			return cli.run();
		}
		app.start();
	});
};

var getOptions = cli.getOptions = function(file){
	var options = {};
	options.options = process.argv.splice(process.argv.indexOf(file) + 1);

	app.config.stores.argv.store = {};
	app.config.use('argv', argvOptions);

	[
		'pidFile',
		'logFile',
		'errFile',
		'watch',
		'minUptime',
		'append',
		'silent',
		'outFile',
		'max',
		'command',
		'path',
		'spinSleepTime',
		'sourceDir',
		'uid',
		'watchDirectory',
		'watchIgnore',
		'killTree',
		'killSignal',
		'id'
	].forEach(function (key){
		options[key] = app.config.get(key);
	});

	return options;
};
