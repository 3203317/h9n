var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var util = require('../lib/util');

var ServerSchema = new Schema({
	ServerName: {
		type: String,
		required: true,
		index: true
	}, IP: {
		type: String
	}, PORT: {
		type: String
	}, CPU: {
		type: String
	}, User_Id: {		// 用户Id
		type: ObjectId
	}
}, {
	versionKey: false,
	toObject: {
		virtuals: true
	}, toJSON: {
		virtuals: true
	}
});

ServerSchema.virtual('CreateTime').get(function(){
	return (new Date(this._id.getTimestamp())).format();
});

mongoose.model('Server', ServerSchema);