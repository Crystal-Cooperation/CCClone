enchant();

var resource_dir = './resources/';
var spritestduio = null;
var motion = null;

$(document).ready(function () {
	//モーションデータの読み込み
	$.getJSON(resource_dir + 'json/inout.json', function (jsonData) {
		motion = jsonData;
	});
});

var OpeningScene = enchant.Class.create(Scene, {
	initialize: function(socketio, character_info){
		Scene.call(this);

		var me = this;

		//表示領域の設定
		this.width = Core.instance.width;
		this.height = Core.instance.height;
		
		//画面表示用の部品を作成
		
		//スプラッシュ表示用スプライト
		var ss = new Sprite(900, 320);
		ss.image = new Surface(ss.width, ss.height);
		ss.scaleX = 1;
		ss.ctx = ss.image.context;
		ss.dataIndex = 0;
		ss.imageList = new SsImageList(motion[ss.dataIndex].images, resource_dir + 'json/', true);
		ss.animation = new SsAnimation(motion[ss.dataIndex].animation, ss.imageList);
		ss.sprite = new SsSprite(ss.animation);
		ss.sprite.setLoop(1);
		ss.sprite.x = 0;
		ss.sprite.y = 0;
		
		//スプラッシュ表示後処理
		ss.sprite.setEndCallBack(function(){
			me.removeChild(ss);
		
			//シーンに部品を追加
			me.addChild(video);

			//部品追加後にサイズ、表示位置を修正
			video.width = Core.instance.width;
			video.height = Core.instance.height;

			//オープニングムービー再生
			$(video._element).trigger('play');
		});

		//シーンに部品を追加
		this.addChild(ss);

		//スプラッシュを中央表示
		ss.x = Core.instance.width / 2 - (ss.width / 2);
		ss.y = Core.instance.height / 2 - (ss.height / 2);

		//オープニングムービー再生用Entity
		var video = new Entity();
		
		var $splash = $('<video></video>', {
			title: 'Opening Movie',
			poster: resource_dir + 'image/dummy.png',
			preload: 'auto'
		});

		var $source1 = $('<source>', {
			src: resource_dir + 'movie/opening.webm',
			type: 'video/webm'
		});
		var $source2 = $('<source>', {
			src: resource_dir + 'movie/opening.mp4',
			type: 'video/mp4'
		});
		var $source3 = $('<source>', {
			src: resource_dir + 'movie/opening.ogv',
			type: 'video/ogv'
		});

		//子要素の追加
		$splash.append($source1);
		$splash.append($source2);
		$splash.append($source3);

		//DOMをelementに格納
		video._element = $splash.get(0);

		video.ontouchstart = function(){
			if(Core.instance.scenes['TitleScene'] == null){
				Core.instance.scenes['TitleScene'] = new TitleScene(socketio, character_info);
			}
			Core.instance.removeScene(Core.instance.scenes['OpeningScene']);
			Core.instance.scenes['OpeningScene'] = null;
			Core.instance.pushScene(Core.instance.scenes['TitleScene']);
		}

		//再生終了時
		$splash.on('ended', function(){
			if(Core.instance.scenes['TitleScene'] == null){
				Core.instance.scenes['TitleScene'] = new TitleScene(socketio, character_info);
			}
			Core.instance.removeScene(Core.instance.scenes['OpeningScene']);
			Core.instance.scenes['OpeningScene'] = null;
			Core.instance.pushScene(Core.instance.scenes['TitleScene']);
		});

		this.addEventListener('enterframe', function(){
			if (ss.sprite.getLoopCount() == 0){
				//$splash表示
				var time = new Date().getTime();
				ss.ctx.save();
				ss.ctx.clearRect(0, 0, ss.width, ss.height);
				ss.sprite.x = ss.x + Core.instance._pageX;
				ss.sprite.y = ss.y;
				ss.sprite.draw(ss.ctx, time);
				ss.ctx.restore();
			}
		});

		this.addEventListener('exit', function(){
			$splash.trigger('stop');
		});
	}
});
