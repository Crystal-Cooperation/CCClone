enchant();

var CharacterCreateScene = enchant.Class.create(Scene, {
	initialize: function(socketio, player_info, selected_no){
		Scene.call(this);

		var me = this;
		var current_step = 0;	//キャラクター作成STEP(0～4)
		var check = false;		//入力チェック中フラグ
		var next = false;		//決定ボタン押下フラグ
		var back = false;		//戻るボタン押下フラグ
		var step_height = 430;
		var scene_speed = Core.instance.width / 10;
		
		var scene_steps = new Array();
		
		//表示領域の設定
		this.width = Core.instance.width;
		this.height = Core.instance.height;
	
		//画面表示用の部品を作成（共通部分）
		
		//メニューのスタイル設定
		var block_styles = {
			'position' : 'absolute',
			'height' : '50px',
			'width' : Core.instance.width + 'px',
			'font-size' : '40px',
			'font-weight' : 'bold',
			'color' : 'rgb(255,255,255)',
			'text-align' : 'center',
			'float' : 'left'
		}
		
		//進捗表示ボックスのスタイル設定
		var box_styles = {
			'position' : 'relative',
			'height' : '48px',
			'width' : '170px',
			'font-size' : '18px',
			'font-weight' : 'bold',
			'color' : 'rgb(255,255,255)',
			'text-align' : 'center'
		}
		
		//進捗表示用画像のスタイル設定
		var arrow_style = {
			'height' : '48px',
			'width' : '24px',
			'margin-left' : '5px',
			'margin-right' : '5px'
		}
		//ボタン
		var button_style = {
			'top' : '-3px',
			'background-color' : 'rgb(135,135,135)'
		}
		
		//キャラクター作成タイトル
		var title = new Entity();
		title.width = Core.instance.width;
		title.height = 60;
		title._element = $('<div></div>').text('キャラクターメイキング').css(block_styles).get(0);

		//進捗表示用DIV作成
		var current_progress_style = {
			'background-color' : 'rgb(45,45,25)'
		}
		var progress_style = {
			'background-color' : 'rgb(111, 102, 53)'
		}
		
		//進捗表示用ボタングループ
		var progress = new Entity();
		progress.width = Core.instance.width;
		progress.height = 50;
		progress._element = $('<div></div>').css(block_styles).get(0);
		
		var $button_progress = new Array();
		$button_progress[0] = $('<input>',{'type' : 'button'}).val('国').css(box_styles).css(current_progress_style).css('top','-18px');
		$button_progress[1] = $('<input>',{'type' : 'button'}).val('性別').css(box_styles).css(progress_style).css('top','-18px');
		$button_progress[2] = $('<input>',{'type' : 'button'}).val('キャラクター').css(box_styles).css(progress_style).css('top','-18px');
		$button_progress[3] = $('<input>',{'type' : 'button'}).val('クラス').css(box_styles).css(progress_style).css('top','-18px');
		$button_progress[4] = $('<input>',{'type' : 'button'}).val('完了').css(box_styles).css(progress_style).css('top','-18px');

		//グループに子要素を追加
		$(progress._element).append($button_progress[0]);
		$(progress._element).append($('<img>',{'src' : Core.instance.IMAGE_DIR + 'progress_arrow.png'}).css(arrow_style));
		$(progress._element).append($button_progress[1]);
		$(progress._element).append($('<img>',{'src' : Core.instance.IMAGE_DIR + 'progress_arrow.png'}).css(arrow_style));
		$(progress._element).append($button_progress[2]);
		$(progress._element).append($('<img>',{'src' : Core.instance.IMAGE_DIR + 'progress_arrow.png'}).css(arrow_style));
		$(progress._element).append($button_progress[3]);
		$(progress._element).append($('<img>',{'src' : Core.instance.IMAGE_DIR + 'progress_arrow.png'}).css(arrow_style));
		$(progress._element).append($button_progress[4]);

		//操作用ボタングループ
		var buttons = new Entity();
		buttons.width = Core.instance.width;
		buttons.height = 50;
		
		//決定
		var $button_decide = $('<input>',{
			'type' : 'button'
		}).val('決定').css(box_styles).css(button_style).css('margin-right','2px');

		//決定ボタン押下
		$button_decide.on('click',function(e){
			if(next == false){
				if(current_step < scene_steps.length - 1){
					//表示中画面の入力内容チェックを実行
					if(check == false){
						scene_steps[current_step].checkInput();
						check = true;
					}
				} else {
					//キャラクター作成
					socketio.emit('character_create', player_info[selected_no]);
					next = true;
				}
			}
		});
		
		//戻る
		var $button_back = $('<input>',{
			'type' : 'button'
		}).val('戻る').css(box_styles).css(button_style).css('margin-left','2px');

		//戻るボタン押下
		$button_back.on('click',function(e){
			if(back == false){
				if(current_step > 0){
					current_step--;
				} else {
					if(Core.instance.scenes['SelectScene'] != null){
						Core.instance.removeScene(Core.instance.scenes['SelectScene']);
					}
					Core.instance.scenes['SelectScene'] = new SelectScene(socketio, player_info);
					Core.instance.replaceScene(Core.instance.scenes['SelectScene']);
				}
				back = true;
			}
		});
		
		//グループに子要素を追加
		buttons._element = $('<div></div>').css(block_styles).get(0);
		$(buttons._element).append($button_decide);
		$(buttons._element).append($button_back);
		
		//STEP1・所属国選択
		scene_steps[0] = new Step1Group(Core.instance.width, 430, player_info[selected_no]);

		//STEP2・性別選択
		scene_steps[1] = new Step2Group(Core.instance.width, 430, player_info[selected_no]);

		//STEP3・詳細選択
		scene_steps[2] = new Step3Group(Core.instance.width, 430, player_info[selected_no], socketio);

		//STEP4・クラス選択
		scene_steps[3] = new Step4Group(Core.instance.width, 430, player_info[selected_no]);

		//STEP5・確認
		scene_steps[4] = new Step5Group(Core.instance.width, 430, player_info[selected_no]);
		
		//シーンに追加
		this.addChild(title);
		this.addChild(progress);
		this.addChild(buttons);

		//表示位置調整
		title.y = Core.instance._pageY;
		progress.y = title.height;
		buttons.x = (Core.instance.width / 2) - (buttons.width / 2);
		buttons.y = this.height - buttons.height;

		//各STEPを追加、調整
		for(var i=0; i<=scene_steps.length - 1; i++){
			this.addChild(scene_steps[i]);
			scene_steps[i].x = i * scene_steps[i].width;
			scene_steps[i].y = progress.y + progress.height;
		}
		
		this.addEventListener('enterframe', function(){
			//入力チェック
			if(check == true){
				if(scene_steps[current_step].checking == true){
					//チェック中
				}else{
					if(scene_steps[current_step].checked == true){
						//チェックOK
						current_step++;
						//次画面の描画を更新
						scene_steps[current_step].updateGroup();
						next = true;
					}else if(scene_steps[current_step].checked == false){
						//チェックNG
						next = false;
					}
					check = false;
				}
			}
		
			//次STEP表示
			if(next == true){
				if(scene_steps[current_step].x > 0){
					for (var i=0; i<=scene_steps.length-1; i++) {
						scene_steps[i].x -= scene_speed;
					}
				}else{
					$button_progress[current_step - 1].css(progress_style);
					$button_progress[current_step].css(current_progress_style);
					next = false;
				}
			}
			
			//前STEP表示
			if(back == true){
				if(scene_steps[current_step].x < 0){
					for (var i=0; i<=scene_steps.length-1; i++) {
						scene_steps[i].x += scene_speed;
					}
				}else{
					$button_progress[current_step + 1].css(progress_style);
					$button_progress[current_step].css(current_progress_style);
					back = false;
				}
			}
		
		});
		
		socketio.on('character_created',function(data){
			if(data.value != ''){
				alert(data.value);
			} else {
				//ロビーに移動
				if(Core.instance.scenes['LobbyScene'] != null){
					Core.instance.removeScene(Core.instance.scenes['LobbyScene']);
				}
				Core.instance.scenes['LobbyScene'] = new LobbyScene(socketio, player_info, selected_no);
				Core.instance.replaceScene(Core.instance.scenes['LobbyScene']);
			}
		});

	}
});
