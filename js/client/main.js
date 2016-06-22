enchant();

var json_dir = './resources/json/';
var image_dir = './resources/image/';
var motion_dir = './resources/image/motion/';
var url = 'http://localhost:8080';
var game = null;
var focus_flg = false;
var game_width = 1000;
var game_height = 600;
var scale = 1;
var scale_w = window.innerWidth / game_width;
var scale_h = window.innerHeight / game_height;
var player_data = null;
var socketio = io.connect(url);
var top_margin = 0;
var left_margin = 0;
var image_cache = null;
var cache_list = null;
var motion_data = new Array();
var lobby_map = new Array(3);
$(document).ready(function () {
	//データの読み込み
	$.when($.getJSON(json_dir + 'ccc_wait.json'), $.getJSON(json_dir + 'ccc_walk.json'), $.getJSON(json_dir + 'estoria_lobby.json'), $.getJSON(json_dir + 'gilard_lobby.json'), $.getJSON(json_dir + 'rshein_lobby.json'), $.getJSON(json_dir + 'ccc_cache.json')).done(function(json_wait, json_walk, json_estoria_lobby, json_gilard_lobby, json_rshein_lobby, json_cache_image){
		//モーションデータの読み込み
		motion_data['wait'] = json_wait[0];
		motion_data['walk'] = json_walk[0];
		
		//ロビーデータの読み込み
		lobby_map[0] = json_estoria_lobby[0];
		lobby_map[1] = json_gilard_lobby[0];
		lobby_map[2] = json_rshein_lobby[0];
		
		//イメージキャッシュを作成
		image_cache = new SsCachedImageList(null, json_cache_image[0][0].images, motion_dir, true, onload);
		
		//本来はSsImageListの引数にonloadを渡して、完了時に呼び出したい。
		image_cache.checkLoadImages();
	});
});

//ウィンドウ読み込み
function onload(){
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
	game.speedX = 3;
	game.speedY = 3;

	game.JSON_DIR = json_dir;
	game.IMAGE_DIR = image_dir;
	game.MOTIN_IMAGE_DIR = motion_dir;
	game.SOUND_DIR = './resources/sound/';
	game.scenes = new Array();
	game.motion = motion_data;
	game.cachedImages = image_cache;
	game.lobby_map = lobby_map;

	//髪型、肌の色変更後のイメージをキャッシュ

	//髪の色
	var hair_colors = [
		'192,186,172',
		'194,161,107',
		'174,158,96',
		'127,103,69',
		'41,46,50',
		'189,150,153',
		'202,100,77',
		'196,151,92',
		'188,178,83',
		'116,157,91',
		'122,155,148',
		'126,110,146'
	]
	game.hair_colors = hair_colors;

	//髪の基本色を定義(初期選択:8)
	var base_r = 196;
	var base_g = 151;
	var base_b = 92;

	//髪の色変更用フィルタ
	var hair_filters = new Array();

	for (var i=0; i<hair_colors.length; i++){
		var rgb = hair_colors[i].split(',');
		hair_filters[i] = new colorFilter(rgb[0] - base_r, rgb[1] - base_g, rgb[2] - base_b);
	}

	//肌の色
	var skin_colors = [
		'196,189,173',
		'203,200,169',
		'161,124,95',
		'94,68,33'
	]
	game.skin_colors = skin_colors;

	//肌の基本色を定義(初期選択:1)
	base_r = 196;
	base_g = 189;
	base_b = 173;

	//肌の色変更用フィルタ
	var skin_filters = new Array();

	//肌用フィルタを作成
	for (var i=0; i<skin_colors.length; i++){
		var rgb = skin_colors[i].split(',');
		skin_filters[i] = new colorFilter(rgb[0] - base_r, rgb[1] - base_g, rgb[2] - base_b);
	}
	
	//フィルタ適用オブジェクトを作成
	var color_filter = new colorFilterApplyer(64, 64);

	//色変更後のイメージを作成
	var changed_images = new Array();

	for (var i=0; i<game.cachedImages.images.length; i++) {
		var cached_image = game.cachedImages.images[i];
		var filters = null;
		
		//イメージの種類に応じてフィルタを変更
		if(cached_image.src.indexOf('_hair') > -1){
			filters = hair_filters;
		} else {
			filters = skin_filters;
		}
		
		//フィルタ数分イメージを作成
		for (var j=0; j<filters.length; j++){
			var new_image = new Image();
			var file_name = cached_image.src.substring(cached_image.src.lastIndexOf('/') + 1, cached_image.src.length);
			
			new_image.src = color_filter.apply(cached_image, filters[j]);
			
			//変更後のイメージを配列に追加
			changed_images[game.MOTIN_IMAGE_DIR + file_name + '?' + j] = new_image;
		}
	}

	//ImageListに追加
	for(var key in changed_images){
		game.cachedImages.addImage(changed_images[key], key);
	}

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
	
	$(document.body).css({
	    'margin-left' : left_margin + 'px',
	    'margin-top' : top_margin + 'px'
	});
	game._pageX = left_margin;
	game._pageY = top_margin;

	var images = [
		game.IMAGE_DIR + 'hit_test.png',
		game.IMAGE_DIR + 'cursor.png',
		game.IMAGE_DIR + 'dummy.png',
		game.IMAGE_DIR + 'login.png',
		game.IMAGE_DIR + 'lobby_estoria.png',
		game.IMAGE_DIR + 'lobby_gilard.png',
		game.IMAGE_DIR + 'lobby_rshein.png',
		game.IMAGE_DIR + 'title_logo.png',
		game.IMAGE_DIR + 'create1_estoria.png',
		game.IMAGE_DIR + 'create1_gilard.png',
		game.IMAGE_DIR + 'create1_rshein.png'
	]
	
	//画像のプリロード
	game.preload(images);
	game.start();
	
	//画面表示
	game.onload = function () {
		$('#enchant-stage').css('overflow', 'hidden');
		game.scenes['LoginScene'] = new LoginScene(socketio);
		game.pushScene(game.scenes['LoginScene']);
	}
}
