/*!
 * h9n-web
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var conf = require('../settings'),
	EventProxy = require('eventproxy');

var title = 'H9N WebMonitor',
	virtualPath = '/';

var User = require('../biz/user');

exports.loginUI = function(req, res, next){
	res.render('user/Login', {
		title: 'LOGIN | '+ title,
		description: '',
		keywords: ',Bootstrap3,nodejs,express',
		virtualPath: virtualPath,
		cdn: conf.cdn
	});
};

exports.login = function(req, res, next){
	var result = { success: false },
		data = req._data;
	User.login(data, function (err, status, msg, doc){
		if(err) return next(err);
		if(!!status){
			result.msg = msg;
			return res.send(result);
		}
		/* session */
		req.session.lv = 1;
		req.session.userId = doc._id;
		req.session.role = 'admin';
		req.session.user = doc;
		/* result */
		result.success = true;
		res.send(result);
	});
};

exports.changePwdUI = function(req, res, next){
	res.render('user/ChangePwd', {
		title: '修改密码 - 后台管理 - '+ title,
		description: '',
		keywords: ',Bootstrap3,nodejs,express',
		virtualPath: virtualPath,
		cdn: conf.cdn
	});
};

exports.changePwd = function(req, res, next){
	var result = { success: false },
		data = req._data,
		user = req.session.user;

	if(!data.NewPass || !data.NewPass.trim().length){
		result.msg = ['新密码不能为空。', 'NewPass'];
		return res.send(result);
	}

	User.changePwd(user._id, data.OldPass, data.NewPass, function (err, status, msg, doc){
		if(err) return next(err);
		result.success = !status;
		result.msg = msg;
		res.send(result);
	});
};

exports.validate = function(req, res, next){
	if(1 === req.session.lv) return next();
	if(req.xhr){
		return res.send({
			success: false,
			code: 300,
			msg: '无权访问'
		});
	}
	res.redirect('/user/login');
};

exports.logout = function(req, res, next) {
	req.session.destroy();
	res.redirect('/user/login');
};