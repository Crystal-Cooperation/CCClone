//ユーザーマスタ
module.exports = function(mongoose){
	var UserMasterSchema = new mongoose.Schema({
		id      : { type: String, minlength: 1, maxlength: 16 ,required: true },
		pass    : { type: String, minlength: 1, maxlength: 16 ,required: true },
		leaf    : { type: Number, default: 0, min: 0, max: 99999999 },
		gold    : { type: Number, default: 0, min: 0, max: 99999999 },
		reg_date: { type: Date, default: Date.now,required: true}
	});
	return UserMasterSchema;
};
