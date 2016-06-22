//プレイヤー情報
module.exports = function(mongoose){
	var PlayerInfoSchema = new mongoose.Schema({
		id        : { type: String, default: "", minlength: 1, maxlength: 16, required: true },	//ユーザーID
		seq       : { type: Number, default: 0, min: 0, max: 5, required: true },				//キャラクター枠番号
		scene_id  : { type: Number, default: 0, min: 0, max: 15, required: true },				//キャラクター所属シーン(0-4:イストリアロビー、5-9:ギラードロビー、10-14:ル・シェインロビー、15:バトルマップ)
		x         : { type: Number, default: 0, required: true },								//x座標
		y         : { type: Number, default: 0, required: true },								//y座標
		z         : { type: Number, default: 0, required: true },								//z座標（重なり順）
		scaleX    : { type: Number, default: 0, min: -1, max: 1, required: true },				//向き(-1=右、-1以外=左)
		hp        : { type: Number, default: 0, min: 0, required: true },						//HP
		mp        : { type: Number, default: 0, min: 0, required: true },						//MP
		tag_icon  : { type: Number, default: 0, min: 0 },										//タグのアイコンID
		tag       : { type: String,  default: 0 },												//タグ内容
		motion_id : { type: Number,  default: 0, min: 0 }										//実行中モーションID
	});
	return PlayerInfoSchema;
};
