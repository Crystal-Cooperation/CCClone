enchant();

var resource_dir = './resources/';

var TitleScene = enchant.Class.create(Scene, {
	initialize: function(socketio, character_info){
		Scene.call(this);

		var me = this;

		//表示領域の設定
		this.width = Core.instance.width;
		this.height = Core.instance.height;

		//画面表示用の部品を作成
		var margin = 5;
		var menu = new Entity();
		var title_logo = new Sprite(590, 300);
		title_logo.image = Core.instance.assets[Core.instance.IMAGE_DIR + 'title_logo.png'];
		title_logo.scaleX = 1.8;
		title_logo.scaleY = 1.8;

		var button_start = $('<input>',{
			type: 'button',
			value: 'ゲームスタート'
		});
		var button_delete = $('<input>',{
			type: 'button',
			value: 'キャラクター削除'
		});
		var button_official = $('<input>',{
			type: 'button',
			value: '公式サイトへ'
		});

		//各ボタンの設定
		var styles = {
			'width' : '150px',
			'height' : '30px',
			'font-family' : 'ＭＳ　ゴシック',
			'font-weight': 'bold',
			'font-size' : '16px',
			'text-shadow': 'black 1px 1px 0px, black -1px 1px 0px, black 1px -1px 0px, black -1px -1px 0px',
			'color' : 'rgb(255,255,255)',
			'background-color': 'rgb(30,30,30)',
			'border-style': 'double',
			'border-color': 'rgb(255,255,255)',
			'border-width': '3px',
			'opacity' : '0.8',
			'margin' : margin + 'px'
		}
		
		//スタート
		button_start.css(styles);
		button_start.on('click', function () {
			if(Core.instance.scenes['SelectScene'] != null){
				Core.instance.removeScene(Core.instance.scenes['SelectScene']);
			}
			Core.instance.scenes['SelectScene'] = new SelectScene(socketio, character_info);
			Core.instance.replaceScene(Core.instance.scenes['SelectScene']);
		});

		button_delete.css(styles);
		button_delete.on('click', function () {
			if(Core.instance.scenes['DeleteScene'] != null){
				Core.instance.removeScene(Core.instance.scenes['DeleteScene']);
			}
			Core.instance.scenes['DeleteScene'] = new DeleteScene(socketio, character_info);
			Core.instance.replaceScene(Core.instance.scenes['DeleteScene']);
		});
		
		button_official.css(styles);
		
		//DOMをelementに格納
		menu._element = $('<div></div>').get(0);
		$(menu._element).append(button_start);
		$(menu._element).append($('<br>'));
		$(menu._element).append(button_delete);
		$(menu._element).append($('<br>'));
		$(menu._element).append(button_official);

		//シーンに追加
		this.addChild(title_logo);
		this.addChild(menu);
		
		//タイトルロゴ表示
		title_logo.x = Core.instance.width / 2 - (title_logo.width / 2);
		title_logo.y = title_logo.height / 2 - 80;
		
		//メニュー表示
		menu.width = 160;
		menu.height = 120;
		menu.x = Core.instance.width / 2 - (menu.width / 2);
		menu.y = Core.instance.height - menu.height - 30;
		
		$(this._element).css('background-image', "url('./resources/image/title_bg.png')");
		$(this._element).css('background-size', Core.instance.width + 'px');

		this.addEventListener('enter', function(){
			for(var i=1; i<5; i++)
			{
				$('#audioPlayer'+i).get(0).pause();
				$('#audioPlayer'+i).get(0).currentTime = 0;
			}
			$('#audioPlayer1').get(0).play();
		});

		this.addEventListener('exit', function(){
		});
	}
});
