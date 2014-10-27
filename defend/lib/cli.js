/*!
 * h9n-defend
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var fs = require('fs'),
	path = require('path'),
	util = require('util'),
	flatiron = require('flatiron');

var cli = exports,
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
	'actions:',
	'  list		List all running h9ndefend scripts',
	'',
	'options:',
	'  -h, --help	You\'re staring at it',
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

app.start();