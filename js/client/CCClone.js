enchant();

var CCClone = enchant.Class.create({
    initialize: function (langObject, url) {
		//定数値
		this.JSON_DIR         = './resources/json/';
		this.JSON_LANG_DIR    = './resources/json/language/';
		this.JSON_MAP_DIR     = './resources/json/map/';
		this.JSON_MOTION_DIR  = './resources/json/motion/';
		this.IMAGE_MOTION_DIR = './resources/image/motion/';
		this.IMAGE_DIR        = './resources/image/';
		this.SOUND_DIR        = './resources/sound/';

		//言語リソース
		this.resourceString = langObject;
		
		//国情報
		this.nations = new Array(3);
		this.nations[0] = new Nation(langObject.strings[4101].value, langObject.strings[4104], '66,109,122',  this.IMAGE_DIR + 'nation1.png');
		this.nations[1] = new Nation(langObject.strings[4102].value, langObject.strings[4105], '174,114,104', this.IMAGE_DIR + 'nation2.png');
		this.nations[2] = new Nation(langObject.strings[4103].value, langObject.strings[4106], '94,127,48',   this.IMAGE_DIR + 'nation3.png');
		
		//クラス情報
		this.classes = new Array(4);
		this.classes[0] = new Class(langObject.strings[4402].value, langObject.strings[4406], '98,134,140', this.IMAGE_DIR + 'class1.png');
		this.classes[1] = new Class(langObject.strings[4403].value, langObject.strings[4407], '103,132,84', this.IMAGE_DIR + 'class2.png');
		this.classes[2] = new Class(langObject.strings[4404].value, langObject.strings[4408], '131,95,88',  this.IMAGE_DIR + 'class3.png');
		this.classes[3] = new Class(langObject.strings[4405].value, langObject.strings[4408], '131,95,88',  this.IMAGE_DIR + 'class4.png');

		//アカウント情報
		this.account = null;
		
		//通信用ソケット
		this.socket = io.connect(url);
		
		//オプション情報
		this.option = null;
		
		//リソースのキャッシュ
		
		//サウンド
		
		//参照を解放
		langObject = null;
	},
	
	//ゲーム内定数値取得

	//フォント情報取得 引数指定時は指定のフォントサイズで返却
	getFontStyle : function () {
		var fontStyle = this.resourceString.fontFamily;
		var fontSize  = this.resourceString.baseFontSize;
	
		if (arguments.length == 1) {
			fontSize = arguments[0] - 0;
		}
		
		return fontStyle + ' ' + fontSize + 'px';
	},

	//ランダムヒント取得
	getRandomHint : function () {
		return 'test<br>test';
	},
	
	//エラー情報送信
	sendError : function (objectString, errorObject) {
	},
	
	//サーバーとの通信監視
	
});
