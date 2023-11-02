enchant();

var SelectScene = enchant.Class.create(Scene, {
	initialize: function(socketio, character_info){
		Scene.call(this);

		var me = this;
		var character_list = new Array(5);
		var selected_id = '';
		var class_src = ['warrior.png','scout.png','priest.png','sorcerer.png'];
		var nation_src = ['estoria.png','gilard.png','rshein.png'];
		var nation_rgb = ['66,109,122','174,114,104','94,127,48'];
		var class_rgb = ['98,134,140','103,132,84','131,95,88','131,95,88'];

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

		//ボタンのスタイル設定
		var box_styles = {
			'position' : 'relative',
			'height' : '48px',
			'width' : '170px',
			'background-color' : 'rgb(111, 102, 53)',
			'font-size' : '18px',
			'font-weight' : 'bold',
			'color' : 'rgb(255,255,255)',
			'text-align' : 'center',
		}

		//操作説明のスタイル設定
		var explain_operation = {
			'height' : '50px',
			'width' : Core.instance.width + 'px',
			'font-size' : '20px',
			'font-weight' : 'bold',
			'color' : 'rgb(255,255,255)',
			'text-align' : 'center',
		}
		
		//画像選択時のぼかし用スタイル設定
		var unselect_styles = {
			'border-radius' : '3px',
			'box-shadow' : '0px 0px 1px 1px rgba(255, 255, 255, 0.5) inset',
			'border-color' : 'rgb(255, 255, 255)',
			'width' : '158px',
			'height' : '224px'
		}

		//名前表示
		var name_styles = {
			'border-radius' : '3px',
			'box-shadow' : '0px 0px 1px 1px rgba(255, 255, 255, 0.5) inset',
			'border-color' : 'rgb(255, 255, 255)',
			'background-repeat' : 'no-repeat',
			'background-size' : '64px 64px',
			'background-position' : 'right top'
		}
		var name_text_styles = {
			'font-size' : '14px',
			'color' : 'rgb(255, 255, 255)',
		}

		//クラス画像(大)
		var class_l_styles = {
			'width' : '32px',
			'height' : '64px'
		}

		//選択用
		var select_styles = {
			'box-shadow' : '0px 0px 50px 30px rgba(255, 255, 255, 0.5) inset',
   			'width' : '158px',
			'height' : '224px'
		}
		
		//ボタン
		var button_style = {
			'top' : '-3px',
			'background-color' : 'rgb(135,135,135)'
		}
		
		//キャラクター選択
		var title = new Entity();
		title.width = Core.instance.width;
		title.height = 60;
		title._element = $('<div></div>').text('キャラクター選択').css(block_styles).get(0);

		//操作説明
		var explain = new Entity();
		explain.width = Core.instance.width;
		explain.height = 40;
		explain._element = $('<div></div>').text('キャラクターを選択してください。').css(explain_operation).get(0);

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
			var selected_no = selected_id.replace('selectImage', '');

			if(character_info[selected_no].name == ''){
				//キャラクター作成画面へ
				if(Core.instance.scenes['CharacterCreateScene'] != null){
					Core.instance.removeScene(Core.instance.scenes['CharacterCreateScene']);
				}
				Core.instance.scenes['CharacterCreateScene'] = new CharacterCreateScene(socketio, character_info, selected_no);
				Core.instance.replaceScene(Core.instance.scenes['CharacterCreateScene']);
			} else {
				if(Core.instance.scenes['LobbyScene'] != null){
					Core.instance.removeScene(Core.instance.scenes['LobbyScene']);
				}
				Core.instance.scenes['LobbyScene'] = new LobbyScene(socketio, character_info, selected_no);
				Core.instance.replaceScene(Core.instance.scenes['LobbyScene']);
			}
		});
		
		//戻る
		var $button_back = $('<input>',{
			'type' : 'button'
		}).val('戻る').css(box_styles).css(button_style).css('margin-left','2px');

		//戻るボタン押下
		$button_back.on('click',function(e){
			if(Core.instance.scenes['TitleScene'] != null){
				Core.instance.removeScene(Core.instance.scenes['TitleScene']);
			}
			Core.instance.scenes['TitleScene'] = new TitleScene(socketio, character_info);
			Core.instance.replaceScene(Core.instance.scenes['TitleScene']);
		});
		
		//グループに子要素を追加
		buttons._element = $('<div></div>').css(block_styles).get(0);
		$(buttons._element).append($button_decide);
		$(buttons._element).append($button_back);
		
		var images = new Array(5);

		//キャラクター選択(6枠)
		for(var i=0; i<character_info.length; i++){
			//名前表示用枠
			var chara_name = new Entity();
			var nation_image_src = "url('" + Core.instance.IMAGE_DIR + nation_src[character_info[i].nation] + "')";
			var nation_color = 'rgb(' + nation_rgb[character_info[i].nation] + ')';
			chara_name.width = 158;
			chara_name.height = 102;
			chara_name._element = $('<div></div>',{
				'width' : chara_name.width + 'x',
				'height' : chara_name.height + 'px'
			}).css(name_styles).css('background-image', nation_image_src).css('background-color', nation_color).get(0);

			//クラス画像
			var class_image = new Entity();
			class_image.width = 32;
			class_image.height = 64;
			var class_image_src = Core.instance.IMAGE_DIR + class_src[character_info[i].class];
			class_image._element = $('<img>',{
				'width' : class_image.width + 'px',
				'height' : class_image.height + 'px',
				'src' : class_image_src
			}).get(0);

			//キャラクター名
			var chara_name_text = new Entity();
			chara_name_text.width = chara_name.width - class_image.width;
			chara_name_text.height = 28;
			chara_name_text._element = $('<div></div>',{
				'width' : chara_name_text.width + 'px',
				'height' : chara_name_text.height + 'px',
			}).css(name_text_styles).text(character_info[i].name).get(0);

			//階級
			var rank_text = new Entity();
			rank_text.width = chara_name.width - class_image.width;
			rank_text.height = chara_name.height / 2;
			rank_text._element = $('<div></div>',{
				'width' : rank_text.width + 'px',
				'height' : rank_text.height + 'px',
			}).css(name_text_styles).text('訓練兵').get(0);

			//キャラクター選択用エフェクト
			var chara_select = new Entity();
			chara_select.width = 158;
			chara_select.height = 224;
			
			chara_select._element = $('<div></div>',{
				'id' : 'selectImage' + i,
				'width' : chara_select.width + 'px',
				'height' : chara_select.height + '224px',
			}).css(unselect_styles).get(0);

			$(chara_select._element).on('mouseover',function(e){
				$(this).css(select_styles);
			});

			$(chara_select._element).on('mouseout',function(e){
				if($(this).attr('id') != selected_id){
					$(this).css(unselect_styles);
				}
			});

			$(chara_select._element).on('click',function(e){
				if(selected_id == ''){
					$(this).css(select_styles);
					selected_id = $(this).attr('id');
				}else{
					var prev_id = '#' + selected_id;
					$(prev_id).css(unselect_styles);
					$(this).css(select_styles);
					selected_id = $(this).attr('id');
				}
			});

			//キャラクター表示用画像
			var chara_image = null;
			
			if(character_info[i].name == ''){
				chara_image = new Entity();
				chara_image.width = 158;
				chara_image.height = 224;

				chara_image._element = $('<img>',{
					'width' : chara_image.width + 'px',
					'height' : chara_image.height + '224px',
					'src' : Core.instance.IMAGE_DIR + 'select_empty.png'
				}).get(0);
			}else{
				chara_image = new SsaSprite(character_info[i], 80, 185);
				chara_image.x = chara_name.width / 2 - chara_image.width / 2;
				chara_image.y = chara_name.height + 224 - chara_image.height
				chara_image.autoDraw = true;
			}
			
			//Groupに追加
			character_list[i] = new Group();
			character_list[i]._element = $('<div></div>').get(0);
			character_list[i].backgroundColor = 'rgb(200,200,200)';
			character_list[i].width = chara_name.width;
			character_list[i].height = chara_name.height + chara_image.height + 5;
			character_list[i].addChild(chara_name);
			if(character_info[i].name != ''){
				character_list[i].addChild(class_image);
				character_list[i].addChild(chara_name_text);
				character_list[i].addChild(rank_text);
			}
			character_list[i].addChild(chara_image);
			character_list[i].addChild(chara_select);

			//表示位置の調整(Group内)
			class_image.x = chara_name.x + 2;
			class_image.y = chara_name.y + 2;
			chara_name_text.x = class_image.x + class_image.width + 2;
			chara_name_text.y = class_image.y + 6;
			rank_text.x = chara_name_text.x;
			rank_text.y = chara_name_text.y + chara_name_text.height + 2;
			chara_select.y = chara_name.height + 5;
			if(character_info[i].name == ''){
				chara_image.y = chara_name.height + 5;
			}
			
			//表示位置の調整(Group全体)
			this.addChild(character_list[i]);
			character_list[i].x = ((character_list[i].width + 10) * i);
			character_list[i].y = title.height + 50;
		}

		//シーンに追加
		this.addChild(title);
		this.addChild(explain);
		this.addChild(buttons);
		
		//表示位置調整

		title.y = Core.instance._pageY;
		explain.y = character_list[0].y + character_list[0].height + 50;
		buttons.x = (Core.instance.width / 2) - (buttons.width / 2);
		buttons.y = this.height - buttons.height;

		this.addEventListener('enter', function(){
			//BGM変更
			$('#audioPlayer1').get(0).pause()
			$('#audioPlayer1').get(0).currentTime = 0;

			if ($('#audioPlayer2').get(0).currentTime == 0)
			{
				$('#audioPlayer2').get(0).play();
			}
		});

		this.addEventListener('enterframe', function(){
		});
	}
});
