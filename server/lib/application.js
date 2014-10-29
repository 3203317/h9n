/*!
 * h9n-server
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var path = require('path'),
	fs = require('fs'),
	EventEmitter = require('events').EventEmitter;

var utils = require('../../shared/utils'),
	appUtil = require('./util/appUtil'),
	Constants = require('./util/constants');

var Application = module.exports = {};

var STATE_INITED  = 1;	// app has inited
var STATE_START   = 2;	// app start
var STATE_STARTED = 3;	// app has started
var STATE_STOPED  = 4;	// app has stoped

Application.init = function(opts){
	var self = this;
	opts = opts || {};
	self.settings = {};

	appUtil.defaultConfiguration(self);

	var base = opts.base || path.dirname(require.main.filename);
	self.set(Constants.RESERVED.BASE, base, true);

	self.loaded = [];
	self.components = [];
	self.event = new EventEmitter();
	self.state = STATE_INITED;
	console.log('[%s] App inited: %j.', utils.format(), self.getServerId());
};

Application.start = function(cb){
	var self = this;
	self.startTime = Date.now();
	if(self.state > STATE_INITED){
		utils.invokeCallback(cb, new Error('app has already start'));
		return;
	}

	appUtil.startByType(self, function(){
		appUtil.loadDefaultComponents(self);
	});
};

Application.load = function(name, component, opts){
	if('string' !== typeof name){
		opts = component
		component = name
		name = null
	}

	if('function' === typeof component){
		component = component(this, opts)
	}

	if(!name && 'string' === typeof component.name){
		name = component.name
	}

	if(name && this.components[name]) return;

	this.loaded.push(component)

	if(name) this.components[name] = component
}

Application.configure = function (env, type, fn){
	var args = [].slice.call(arguments);
	fn = args.pop();
	env = type = Constants.RESERVED.ALL;

	if(0 < args.length) env = args[0];
	if(1 < args.length) type = args[1];

	if(env === Constants.RESERVED.ALL || contains(this.settings.env, env)){
		if(type === Constants.RESERVED.ALL || contains(this.settings.serverType, type)){
			fn.call(this)
		}
	}
};

Application.getServerId = function(){
	return this.get(Constants.RESERVED.ID);
};

Application.set = function(key, val){
	this.settings[key] = val;
	return this;
};

Application.get = function(key){
	return this.settings[key];
};

Application.filter = function(filter){
	this.before(filter);
	this.after(filter);
};

Application.before = function(filter){
	addFilter(this, Constants.KEYWORDS.BEFORE_FILTER, filter);
};

Application.after = function(filter){
	addFilter(this, Constants.KEYWORDS.AFTER_FILTER, filter);
};

Application.getCurServer = function(){
	return this.settings;
};

function addFilter(app, type, filter){
        var filters = app.get(type);
        if(!filters){
                filters = [];
                app.set(type, filters);
        }
        filters.push(filter);
}

function contains(str, settings){
        if(!settings) return false;

        var ts = settings.split('|');

        for(var i in ts){
                if(str === ts[i]) return true;
        }

        return false;
}
