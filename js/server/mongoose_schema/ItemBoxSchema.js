//アイテムボックス情報
module.exports = function(mongoose){
	var ItemBoxSchema = new mongoose.Schema({
		id       : Number,	//ユーザーID
		seq      : Number,	//キャラクター枠番号(0-5)
		box_seq  : Number,	//アイテムボックスの位置
		item_id  : Number,	//アイテム
		item_num : Number	//アイテムスタック数
	});
	return ItemBoxSchema;
};
