/*!
 * h9n-server
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var utils = require('../../../../shared/utils')

var DEFAULT_TIMEOUT = 3000,
	DEFAULT_SIZE = 500

module.exports = function(timeout, maxSize){
	return new Filter(timeout || DEFAULT_TIMEOUT, maxSize || DEFAULT_SIZE)
}

var Filter = function(timeout, maxSize){
	var self = this;
	self.timeout = timeout;
	self.maxSize = maxSize;
	self.timeouts = {};
	self.curId = 0;
};

Filter.prototype.before = function(msg, session, next){
	var self = this;
	var count = utils.size(self.timeouts);
	if(count > self.maxSize){
		console.log('[%s] Timeout filter is out of range, current size is %s, max size is %s.', utils.format(), count, self.maxSize);
		next();
		return;
	}
	self.curId++;
	self.timeouts[self.curId] = setTimeout(function(){
		console.warn('[%s] Request %j timeout.', utils.format(), msg.__route__)
	}, self.timeout);
	session.__timeout__ = self.curId;
	next();
}

Filter.prototype.after = function(err, msg, session, resp, next){
	var timeout = this.timeouts[session.__timeout__]
	if(timeout){
		clearTimeout(timeout)
		delete this.timeouts[session.__timeout__]
	}
	next(err)
}
