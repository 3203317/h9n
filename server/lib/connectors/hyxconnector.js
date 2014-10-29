


var Connector = function(server, opts){
	var self = this;
	if(!(self instanceof Connector)){
		return new Connector(server, opts);
	}
};

module.exports = Connector;

var pro = Connector.prototype;

pro.start = function(cb){
	// TODO
};
