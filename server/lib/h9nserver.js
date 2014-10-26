/*!
 * h9n-server
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var fs = require('fs'),
	path = require('path')

var H9nServer = module.exports = {
	version: '1.0.0',	// Current version
	components: {},
	filters: {},
	rpcFilters: {},
	connectors: {}
}
