enchant();

var json_dir = './resources/json/';
var img_dir = './resources/image/';
var motion = new Array();
var map_lobby = '';

$(document).ready(function () {
	//モーションデータの読み込み
	$.getJSON(json_dir + 'ccc_wait.json', function (jsonData) {
		motion['wait'] = jsonData;
	});
	$.getJSON(json_dir + 'ccc_walk.json', function (jsonData) {
		motion['walk'] = jsonData;
	});
});

var MotionTestScene = enchant.Class.create(Scene, {
	initialize: function(gCore){
		Scene.call(this);

		//モーション表示用スプライト(180x180)
		
		//立モーション
		var motion1 = new Sprite(180,180);
		motion1.image = new Surface(motion1.width,motion1.height);
		motion1.scaleX = 1;
		motion1.ctx = motion1.image.context;

		var motion1_buffer = new Sprite(180,180);
		motion1_buffer.image = new Surface(motion1_buffer.width,motion1_buffer.height);
		motion1_buffer.scaleX = 1;
		motion1_buffer.ctx = motion1_buffer.image.context;
		motion1_buffer.dataIndex = 0;
		motion1_buffer.imageList = new SsImageList(motion['wait'][motion1_buffer.dataIndex].images, img_dir, true);
		motion1_buffer.animation = new SsAnimation(motion['wait'][motion1_buffer.dataIndex].animation, motion1_buffer.imageList);
		motion1_buffer.sprite = new SsSprite(motion1_buffer.animation);
		motion1_buffer.sprite.x = motion1_buffer.width / 2;
		motion1_buffer.sprite.y = motion1_buffer.height / 2;

		//表示用スプライトのみ追加
		this.addChild(motion1);

		this.addEventListener(Event.ENTER_FRAME, function(e) {
			//モーション描画
			var t = new Date().getTime();
			motion1_buffer.ctx.save();
			motion1_buffer.ctx.clearRect(0, 0, motion1_buffer.width, motion1_buffer.height);
			motion1_buffer.sprite.draw(motion1_buffer.ctx, t);
			motion1_buffer.ctx.restore();
			motion1.ctx.putImageData(motion1_buffer.ctx.getImageData(0,0,motion1_buffer.width,motion1_buffer.height), 0, 0);
		});
		
		motion1.x = 100;
		motion1.y = 100;
	}
});
