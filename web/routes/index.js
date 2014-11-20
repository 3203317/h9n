/*!
 * h9n-web
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var user = require('../controllers/user'),
	manage = require('../controllers/manage'),
	server = require('../controllers/server');

var virtualPath = '',
	title = 'SpeedT WebMonitor',
	str1 = '参数异常';

module.exports = function(app){
	app.get('/user/logout$', user.validate, user.logout);
	app.post('/user/login$', valiPostData, user.login);
	app.get('/user/login$', user.loginUI);
	app.get('/user/changePwd$', user.validate, user.changePwdUI);
	app.post('/user/changePwd$', valiPostData, user.validate, user.changePwd);

	app.get('/manage/', user.validate, manage.indexUI);

	app.get('/server/', user.validate, server.indexUI);
	app.get('/server/add$', user.validate, server.addUI);
	app.get('/server/edit$', user.validate, server.editUI);
};

/**
 * post数据校验
 *
 * @params {Object} 
 * @params {Object} 
 * @return {Object} 
 */
function valiPostData(req, res, next){
	var data = req.body.data;
	if(!data) return res.send({
		success: false,
		msg: str1
	});

	try{
		data = JSON.parse(data);
		if('object' === typeof data){
			req._data = data;
			return next();
		}
		res.send({
			success: false,
			msg: str1
		});
	}catch(ex){
		res.send({
			success: false,
			msg: ex.message
		});
	}
}

/**
 * get数据校验
 *
 * @params {Object} 
 * @params {Object} 
 * @return {Object} 
 */
function valiGetData(req, res, next){
	var data = req.query.data;
	if(!data) return next(new Error(str1));
	try{
		data = JSON.parse(data);
		if('object' === typeof data){
			req._data = data;
			return next();
		}
		next(new Error(str1));
	}catch(ex){
		next(new Error(ex.message));
	}
}