/*!
 * h9n-server
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var utils = require('../../../../shared/utils')

var toobusy = null

var DEFAULT_MAXLAG = 70;

module.exports = function(maxLag){
	return new Filter(maxLag || DEFAULT_MAXLAG);
}

var Filter = function(maxLag){
	try{
		toobusy = require('toobusy');
	}catch(e){
		// TODO
	}
	if(toobusy){
		toobusy.maxLag(maxLag);
	}
};

Filter.prototype.before = function(msg, session, next){
	if(toobusy && toobusy()){
		console.warn('[%s] [toobusy] reject request msg: %s', utils.format(), msg);
		var err = new Error('Server toobusy!');
		err.code = 500;
		next(err);
		return;
	}
	next();
}
