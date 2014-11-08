/*!
 * h9n-protocol
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var should = require('should');
var Protocol = require('../');
var Package = Protocol.Package;
var Message = Protocol.Message;

describe('H9n protocol test', function(){
	describe('String encode and decode', function(){
		it('should be ok to encode and decode Chinese string', function(){
			var str = '你好, abc~~~';
			var buf = Protocol.strencode(str);
			should.exist(buf);
			str.should.equal(Protocol.strdecode(buf));
		});
	});

	describe('Package encode and decode', function() {
		it('should keep the same data after encoding and decoding', function() {
			var msg = 'hello world~';
			var buf = Package.encode(Package.TYPE_DATA, Protocol.strencode(msg));
			should.exist(buf);
			var res = Package.decode(buf);
			should.exist(res);
			Package.TYPE_DATA.should.equal(res.type);
			should.exist(res.body);
			msg.should.equal(Protocol.strdecode(res.body));
		})
	});
});