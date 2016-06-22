enchant();

var game = null;
var game_width = 1000;
var game_height = 600;
var scale = 1;
var scale_w = window.innerWidth / game_width;
var scale_h = window.innerHeight / game_height;
var top_margin = 0;
var left_margin = 0;

//ウィンドウ読み込み
window.onload = function(){
	//表示領域の計算
	if (window.innerWidth < 1000) {
		if (scale_h >= scale_w){
			scale = scale_w;
		}else{
			scale = scale_h;
		}
	}

	game = new Core(game_width, game_height);

	//全体の設定
	game.fps = 30;
	game.scale = scale;

	game.JSON_DIR = './resources/json/';
	game.IMAGE_DIR = './image/motion/';

	game.scenes = new Array();

	//配列ソート用処理(数値のプロパティを指定))
	game.sortArray = function (targetArray, propName, isAsc) {
		var retValue = 1;
		if (isAsc != true) {
			retValue = -1;
		}
		targetArray.sort(function(a,b) {
			if (a[propName] < b[propName]) return -1 * retValue;
			if (a[propName] > b[propName]) return 1 * retValue;
		});
	}

	//再描画用処理
	game.repaintGroup = function(groupObj) {
		var length = groupObj.childNodes.length;
		for (i=0; i<length; i++) {
			// 配列の順番通りにremove→add
			var obj = groupObj.childNodes[0];
			groupObj.removeChild(obj);
			groupObj.addChild(obj);
		}
	}

	//表示位置の調整（中央寄せ）
	left_margin = (window.innerWidth - (game.width * game.scale )) / 2;
	
	$('#enchant-stage').css({
	    position : 'absolute',
	    left : left_margin + 'px',
	    top : top_margin + 'px'
	});
	game._pageX = left_margin;
	game._pageY = top_margin;
	
	// ロード後の処理
	game.onload = function() {
		// 画面表示
		game.scenes['MotionTestScene'] = new MotionTestScene(game);
		
		game.pushScene(game.scenes['MotionTestScene']);
	}
	
	//処理開始
	game.start();
}
