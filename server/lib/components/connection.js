/*!
 * h9n-server
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var utils = require('../../../shared/utils');

module.exports = function(app, opts){
	return new Component(app, opts)
}

var Component = function(app, opts){
	var self = this;
	opts = opts || {};
}

var pro = Component.prototype;

pro.name = '__connection__';