/*!
 * h9n-protocol
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

(function (exports, ByteArray, global){
	var Protocol = exports;

	var PKG_HEAD_BYTES = 4;

	var Package = Protocol.Package = {};
	var Message = Protocol.Message = {};

	Package.TYPE_HANDSHAKE = 1;
	Package.TYPE_HANDSHAKE_ACK = 2;
	Package.TYPE_HEARTBEAT = 3;
	Package.TYPE_DATA = 4;
	Package.TYPE_KICK = 5;

	Protocol.strencode = function(str){
		if(ByteArray === Buffer){
			return (new Buffer(str));
		}
	};

	Protocol.strdecode = function(buf){
		if(ByteArray === Buffer){
			return buf.toString();
		}
	};

	Package.encode = function(type, body){
		var len = body ? body.length : 0;
		var buf = new ByteArray(PKG_HEAD_BYTES + len);
		var index = 0;
		buf[index++] = type & 0xff;
		buf[index++] = (len >> 16) & 0xff;
		buf[index++] = (len >> 8) & 0xff;
		buf[index++] = len & 0xff;
		if(body){
			copyArray(buf, index, body, 0, len);
		}
		return buf;
	};

	var copyArray = function(dest, doffset, src, soffset, length){
		if('function' === typeof src.copy){
			src.copy(dest, doffset, soffset, soffset + length);
			return;
		}
	};

	Package.decode = function(buffer){
		var offset = 0;
		var bytes = new ByteArray(buffer);
		var length = 0;
		var rs = [];
		while(offset < bytes.length){
			var type = bytes[offset++];
			length = ((bytes[offset++]) << 16 | (bytes[offset++]) << 8 | bytes[offset++]) >>> 0;
			var body = length ? new ByteArray(length) : null;
			if(body){
				copyArray(body, 0, bytes, offset, length);
			}
			offset += length;
			rs.push({'type': type, 'body': body});
		}
		return rs.length === 1 ? rs[0]: rs;
	};

})('undefined' === typeof(window) ? module.exports : (this.Protocol = {}),
'undefined' === typeof(window) ? Buffer : Uint8Array,
this);