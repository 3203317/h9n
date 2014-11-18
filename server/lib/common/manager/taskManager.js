/*!
 * h9n-server
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var sequeue = require('seq-queue');

var manager = module.exports;

var queues = {};

var TIMEOUT = 3000;

manager.addTask = function(key, fn, ontimeout){
	var queue = queues[key];
	if(!queue){
		queue = sequeue.createQueue(TIMEOUT);
		queues[key] = queue;
	}
	return queue.push(fn, ontimeout);
};

manager.closeQueue = function(key, force){
	if(!queues[key]) return;
	(queues[key]).close(force);
	delete queues[key];
};
