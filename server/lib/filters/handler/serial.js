/*!
 * h9n-server
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var utils = require('../../../../shared/utils'),
	taskManager = require('../../common/manager/taskManager');

module.exports = function(){
	return new Filter();
}

var Filter = function(){};

Filter.prototype.before = function(msg, session, next){
	taskManager.addTask(session.id, function (task){
		session.__serialTask__ = task;
		next();
	}, function(){
		console.error('[%s] [serial filter] msg timeout, msg: %s.', utils.format(), JSON.stringify(msg));
	});
}

Filter.prototype.after = function(err, msg, session, resp, next){
	var task = session.__serialTask__;
	if(task){
		if(!task.done() && !err){
			err = new Error('task time out. msg: ' + JSON.stringify(msg));
		}
	}
	next(err);
}
