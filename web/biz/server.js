var models = require('../models'),
	Server = models.Server;

/**
 * 保存新
 *
 * @params {Object} newInfo
 * @params {Function} cb
 * @return
 */
exports.saveNew = function(newInfo, cb){
	newInfo.Count = newInfo.Count || 0;
	Server.create(newInfo, function (err, doc){
		if(err) return cb(err);
		cb(null, 0, null, doc);
	});
};

/**
 * 查询
 *
 * @params {String}
 * @params {Function} cb
 * @return
 */
exports.findAll = function(user_id, cb){
	var option = {
		sort: {
			ServerName: 1
		}
	};

	Server.find(null, null, option, function (err, docs){
		if(err) return cb(err);
		cb(null, 0, null, docs);
	});
};

exports.findByNames = function(names, cb){
	var arr = [];

	for(var s in names){
		arr.push(new RegExp('^'+ names[s] +'$', 'i'));
	}

	Server.find({
		ServerName: {
			'$in': arr
		}
	}, null, null, function (err, docs){
		if(err) return cb(err);
		cb(null, 0, null, docs);
	});
};

exports.remove = function(Ids, cb){
	Server.remove({
		_id: {
			'$in': Ids
		}
	}, function (err, count){
		if(err) return cb(err);
		cb(null, 0, '删除成功', count);
	});
};

exports.findById = function(id, cb){
	Server.findOne({
		_id: id
	}, null, null, function (err, doc){
		if(err) return cb(err);
		cb(null, 0, null, doc);
	});
};

exports.editInfo = function(newInfo, cb){
	Server.update({
		_id: newInfo.id
	}, {
		ServerName: newInfo.ServerName
	}, function (err, count){
		if(err) return cb(err);
		cb(null, 0, null, count);
	});
};