enchant();

var CustomLoginScene = enchant.Class.create(enchant.Scene, {
	initialize : function () {
		enchant.Scene.call(this);

		//オブジェクト名を取得（エラー処理用）
		var objectString = Object.prototype.toString.apply(this);

		//参照を取得
		var core = Core.instance;
		var ccc = Core.instance.CCClone;
		var self = this;

		//表示位置調整用
		var indicator_margin_left = 500;
		
		//表示領域の設定
		this.width = Core.instance.width;
		this.height = Core.instance.height;

		//背景色の設定
		this.backgroundColor = 'rgb(0, 0, 0)';

		//画像用スプライトを配置
		try {
			//背景
			var bgImage = new Sprite(this.width, this.height);
			bgImage.image = core.assetes[ccc.IMAGE_DIR + 'load_bg.png']

			//ラベル表示(ランダムヒント)
			var randomHint = new Label(ccc.getRandomHint());
			randomHint.font = ccc.getFontStyle(14);
			randomHint.x = (this.width - randomHint._boundWidth) / 2;
			randomHint.y = (this.height - randomHint._boundHeight) / 2;

			//子要素追加
			this.addChild(bgImage);
			this.addChild(randomHint);
			
			//参照を解放
			bgImage = null;
			randomHint = null;
			
		} catch (e) {
			//サーバーにエラー情報を送信
			ccc.sendError(objectString, e);
		}
		
		//ロード処理
		this.addEventListener(Event.PROGRESS, function (e) {
			try {
				var progress = e.loaded / e.total;
				progress *= 100;
				progress = Math.round(progress);
				
				if (progress % 10 == 0) {
					//10で割り切れる場合、インジケータを増やす
					var indicator = new Sprite(10, 10);
					indicator._image = core.assets[ccc.IMAGE_DIR + 'indicator.png'];
					indicator.x = indicator_margin_left + (Math.floor(progress / 10) - 1) * indicator.width;
					indicator.y = self.height - indicator.height;

					//子要素追加
					this.addChild(indicator);

					//参照を解放
					indicator = null;
				}
			} catch (e) {
				//サーバーにエラー情報を送信
				ccc.sendError(objectString, e);
			}
		});
		
		//ロード完了後
		this.addEventListener(Event.LOAD, function (e) {
			core.removeScene(this);
			core.dispatchEvent(e);
		});
		
		//参照を解放
		core = null;
		ccc = null;
		self = null;
	}
});
