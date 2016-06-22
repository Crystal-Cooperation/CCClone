//キャラクター情報
module.exports = function(mongoose){
	var CharacterInfoSchema = new mongoose.Schema({
		socket_id    : { type: String, default: "", required: true },
		id           : { type: String, default: "", minlength: 1, maxlength: 16 ,required: true },
		seq          : { type: Number, default: 0, min: 0, max: 5, required: true },
		name         : { type: String, default: "", minlength: 1, maxlength: 16 ,required: true },
		sex          : { type: Number, default: 0, min: 0, max: 1, required: true },
		nation       : { type: Number, default: 0, min: 0, max: 2, required: true },
		rank         : { type: Number, default: 0, min: 0, default: 0, required: true },
		guild_id     : { type: Number, default: 0 },
		class        : { type: Number, default: 0, min: 0, max: 3, required: true },
		skin_color   : { type: Number, default: 0, min: 0, max: 5, required: true },
		hair_color   : { type: Number, default: 1, min: 0, max: 11, required: true },
		hair         : { type: Number, default: 1, min: 1, max: 10, required: true },
		face         : { type: Number, default: 1, min: 1, max: 6, required: true },
		eq_arms1_id  : { type: Number },
		eq_arms2_id  : { type: Number },
		eq_head_id   : { type: Number },
		eq_body_id   : { type: Number },
		eq_arm_id    : { type: Number },
		eq_leg_id    : { type: Number },
		eq_item1_id  : { type: Number },
		eq_item1_num : { type: Number, default: 0, min: 0, max: 99 },
		eq_item2_id  : { type: Number },
		eq_item2_num : { type: Number, default:0 },
		max_item     : { type: Number, default:0 },
		scaleX       : { type: Number, default:1 },
		x            : { type: Number, default:0 },
		y            : { type: Number, default:0 },
		z            : { type: Number, default:0 },
		parent_x     : { type: Number, default:0 },
		parent_y     : { type: Number, default:0 },
		parent_z     : { type: Number, default:0 },
		motion       : { type: String, default:"wait" }
	});
	return CharacterInfoSchema;
}
