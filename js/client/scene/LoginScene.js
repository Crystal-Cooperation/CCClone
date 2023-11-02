enchant();

var LoginScene = enchant.Class.create(enchant.Scene, {
	initialize : function (socketio) {
		enchant.Scene.call(this);

		//表示領域の設定
		this.width = Core.instance.width;
		this.height = Core.instance.height;
		this.character_info = null;

		//このクラスへの参照を退避
		var me = this;

		//スタイル設定
		var login_button_styles = {
			'font-family' : 'ＭＳ　ゴシック',
			'font-weight': 'bold',
			'font-size' : '16px',
			'color' : 'rgb(255,255,255)',
			'background-color': 'rgb(30,30,30)',
			'border-style': 'double',
			'border-color': 'rgb(255,255,255)',
			'border-width': '3px',
		}
		var input_styles = {
			'padding' : '2px',
			'background-color' : 'rgba(0, 0, 0, 0.8)',
			'font-size' : '12px',
			'color' : 'rgb(255,255,255)'
		}
		var label_styles = {
			'color' : 'rgb(0, 0, 0)',
			'padding' : '2px',
			'font-size' : '16px',
			'font-weight' : 'bold'
		}
		var bg_styles = {
			'background-color' : 'rgb(255, 255, 255)',
			'background-image' : "url('./resources/image/login.png')",
			'background-size' : 'auto',
			'background-repeat' : 'no-repeat',
			'background-attachment' : 'fixed',
			'background-position' : 'center top'
		}

		//部品作成
		
		//ラベル(ID)
		var label_id = new Entity();
		label_id.width = 300;
		label_id.height = 24;
		label_id._element = $('<label>',{
			'for' : 'txtId',
			'width' : label_id.width + 'px',
			'height' : label_id.height + 'px'
		}).css(label_styles).text('ユーザーID　※半角英数字16文字まで').get(0);
		

		//ID入力用テキストボックス
		var id_text = new Entity();
		id_text.width = 150;
		id_text.height = 24;
		id_text._element = $('<input>',{
			'id' : 'txtId',
			'type' : 'text',
			'width' : id_text.width + 'px',
			'height' : id_text.height + 'px',
			'maxlength' : 16
		}).css(input_styles).get(0);

		//ラベル(パスワード)
		var label_pass = new Entity();
		label_pass.width = 300;
		label_pass.height = 24;
		label_pass._element = $('<label>',{
			'for' : 'txtPass',
			'width' : label_pass.width + 'px',
			'height' : label_pass.height + 'px'
		}).css(label_styles).text('パスワード　※半角英数字16文字まで').get(0);
		
		//パスワード入力用テキストボックス
		var pass_text = new Entity();
		pass_text.width = 150;
		pass_text.height = 24;
		pass_text._element = $('<input>',{
			'id' : 'txtPass',
			'type' : 'password',
			'width' : pass_text.width + 'px',
			'height' : pass_text.height + 'px',
			'maxlength' : 16
		}).css(input_styles).get(0);
		
		// 新規登録用チェックボックス(チェック＝新規登録)
		var regist_check = new Entity();
		regist_check.width = 24;
		regist_check.height = 24;
		regist_check._element = $('<input>',{
			'id' : 'chkIsRegist',
			'type' : 'checkbox',
			'width' : regist_check.width + 'px',
			'height' : regist_check.height + 'px'
		}).text('new').get(0);

		//ラベル(チェックボックス)
		var label_check = new Entity();
		label_check.width = 300;
		label_check.height = 24;
		label_check._element = $('<label>',{
			'for' : 'chkIsRegist',
			'width' : label_check.width + 'px',
			'height' : label_check.height + 'px'
		}).css(label_styles).text('IDを新規登録').get(0);

		//ログインボタン
		var login_button = new Entity();
		login_button.width = 150;
		login_button.height = 30;
		login_button._element = $('<input>',{
			'id' : 'btnLogin',
			'type' : 'button',
			'width' : login_button.width + 'px',
			'height' : login_button.height + 'px'
		}).val('ログイン').css(login_button_styles).get(0);

		// ボタン押下時処理
		$(login_button._element).on('click',function () {
		
			// エラーチェック
			if($(id_text._element).val() == ''){
				alert('IDを入力してください');
				$(id_text._element).focus();
				return;
			}
			if($(id_text._element).val().match(/[^0-9A-Za-z]+/)){
				alert('半角英数字で入力してください');
				$(id_text._element).focus();
				return;
			}
			if ($(pass_text._element).val() == '') {
				alert('パスワードを入力してください');
				$(pass_text._element).focus();
				return;
			}
			if($(pass_text._element).val().match(/[^0-9A-Za-z]+/)){
				alert('半角英数字で入力してください');
				$(pass_text._element).focus();
				return;
			}

			// 他クラスへ連携する情報をプロパティに設定
			Core.instance.user_id = $(id_text._element).val();

			if ($(regist_check._element).prop('checked') == true) {
				// 新規登録
				socketio.emit('login_registration', ({id:$(id_text._element).val(), pass:$(pass_text._element).val()}));
			} else {
				// ユーザー認証
				socketio.emit('login_authentification', ({id:$(id_text._element).val(), pass:$(pass_text._element).val()}));
			}
		});

		//ユーザー認証処理
		socketio.on('login_authentification', function(results){
			if (results[0].value != '') {
				if (results[0].value == 'nodata') {
					// ログインNG→再入力
					alert('IDまたはパスワードが違います。');
				} else {
					// ログインNG→再入力
					alert(results[0].value);
				}
			} else {
				// ログインOK→一時データの削除
				me.character_info = results[1];
				socketio.emit('name_remove', {'id':results[1][0].id});
			}
		});

		//ユーザー登録処理
		socketio.on('login_registration', function(results){
			if (results[0].value != '') {
				// 登録NG→再入力
				alert(results[0].value);
			} else {
				// ログインOK→スタート画面へ遷移
				alert('IDを登録しました。');
				me.moveScene(results[1]);
			}
		});

		//一時データ削除処理
		socketio.on('name_removed', function(result){
			if (result.value != '') {
				// 一時データ削除失敗
				alert(result.value);
			} else {
				// ログインOK→スタート画面へ遷移
				me.moveScene(me.character_info);
			}
		});

		//オーディオプレイヤーをbodyに追加
		var $bgm1 = $('<video></video>', {
			id: 'audioPlayer1',
			title: 'player',
			poster: Core.instance.IMAGE_DIR + 'dummy.png',
			preload: 'auto',
			loop: 'true'
		}).css('display', 'none');
		$($bgm1).get(0).src = Core.instance.SOUND_DIR + 'title.mp4';
		$($bgm1).get(0).load()

		var $bgm2 = $('<video></video>', {
			id: 'audioPlayer2',
			title: 'player',
			poster: Core.instance.IMAGE_DIR + 'dummy.png',
			preload: 'auto',
			loop: 'true'
		}).css('display', 'none');
		$($bgm2).get(0).src = Core.instance.SOUND_DIR + 'create.mp4';
		$($bgm2).get(0).load()

		var $bgm3 = $('<video></video>', {
			id: 'audioPlayer3',
			title: 'player',
			poster: Core.instance.IMAGE_DIR + 'dummy.png',
			preload: 'auto',
			loop: 'true'
		}).css('display', 'none');
		$($bgm3).get(0).src = Core.instance.SOUND_DIR + 'estoria.mp3';
		$($bgm3).get(0).load()

		var $bgm4 = $('<video></video>', {
			id: 'audioPlayer4',
			title: 'player',
			poster: Core.instance.IMAGE_DIR + 'dummy.png',
			preload: 'auto',
			loop: 'true'
		}).css('display', 'none');
		$($bgm4).get(0).src = Core.instance.SOUND_DIR + 'gilard.mp3';
		$($bgm4).get(0).load()

		var $bgm5 = $('<video></video>', {
			id: 'audioPlayer5',
			title: 'player',
			poster: Core.instance.IMAGE_DIR + 'create.png',
			preload: 'auto',
			loop: 'true'
		}).css('display', 'none');
		$($bgm5).get(0).src = Core.instance.SOUND_DIR + 'rshein.mp3';
		$($bgm5).get(0).load()

		$('body').append($bgm1);
		$('body').append($bgm2);
		$('body').append($bgm3);
		$('body').append($bgm4);
		$('body').append($bgm5);

		//シーンに部品を追加
		this.addChild(label_id);
		this.addChild(id_text);
		this.addChild(label_pass);
		this.addChild(pass_text);
		this.addChild(regist_check);
		this.addChild(label_check);
		this.addChild(login_button);

		$(this._element).css(bg_styles);

		//表示部品の位置調整
		label_id.x = 350;
		label_id.y = 250;
		id_text.x = label_id.x + label_id.width + 20;
		id_text.y = label_id.y - 5;

		label_pass.x = label_id.x;
		label_pass.y = label_id.y + label_id.height + 20;
		pass_text.x = id_text.x;
		pass_text.y = label_pass.y - 5;

		regist_check.x = label_id.x;
		regist_check.y = label_pass.y + label_pass.height + 20;

		label_check.x = regist_check.x + regist_check.width + 20;
		label_check.y = regist_check.y + 5;

		login_button.x = this.width / 2 - login_button.width / 2;
		login_button.y = label_check.y + label_check.height + 50;

		// シーン開始前の処理
		this.addEventListener('enter', function () {
			$(id_text._element).focus();
		});
	},
	moveScene : function(character_info){
		// ログインOK→次画面へ遷移
		if(Core.instance.scenes['OpeningScene'] == null){
			Core.instance.scenes['OpeningScene'] = new OpeningScene(socketio, character_info);
		}
		Core.instance.removeScene(Core.instance.scenes['LoginScene']);
		Core.instance.scenes['LoginScene'] = null;
		Core.instance.pushScene(Core.instance.scenes['OpeningScene']);
	}
});
