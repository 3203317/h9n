/*!
 * h9n-web
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var conf = require('../settings');

var title = 'SpeedT WebMonitor v'+ require('../package.json').version,
	virtualPath = '/';

exports.indexUI = function(req, res, next){
	res.render('server/Index', {
		title: '服务器管理 | '+ title,
		description: '',
		keywords: ',Bootstrap3,nodejs,express',
		virtualPath: virtualPath,
		cdn: conf.cdn
	});
};