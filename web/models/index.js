/*!
 * h9n-web
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var mongoose = require('mongoose'),
	settings = require('../settings');

var db = mongoose.connection;
var url = 'mongodb://'+ settings.user +':'+ settings.pass +'@'+ settings.host +':'+ settings.port +'/'+ settings.db;

db.on('error', console.error);
db.once('open', function(){
	console.log(url);
});

mongoose.connect(url, function (err){
	if(err){
		console.error('Connect to %s Error: %s.', url, err.message);
		process.exit(1);
	}
});

// models
require('./User');

exports.User = mongoose.model('User');