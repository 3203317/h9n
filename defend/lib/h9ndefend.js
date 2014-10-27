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

var h9ndefend = exports;

h9ndefend.cli = require('./cli');