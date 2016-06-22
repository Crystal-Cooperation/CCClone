//プレイヤー情報
module.exports = function(mongoose){
	var MakingNameSchema = new mongoose.Schema({
		id   : { type: String, default: "", minlength: 1, maxlength: 16, required: true },	//ユーザーID
		name : { type: String, default: "", minlength: 1, maxlength: 16 ,required: true }	//キャラクター名
	});
	return MakingNameSchema;
};
