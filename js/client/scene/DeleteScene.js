enchant();

var DeleteScene = enchant.Class.create(Scene, {
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
		title._element = $('<div></div>').text('キャラクター削除').css(block_styles).get(0);

		//操作説明
		var explain = new Entity();
		explain.width = Core.instance.width;
		explain.height = 40;
		explain._element = $('<div></div>').text('削除するキャラクターを選択してください。').css(explain_operation).get(0);

		//操作用ボタングループ
		var buttons = new Entity();
		buttons.width = Core.instance.width;
		buttons.height = 50;
		
		//削除
		var $button_decide = $('<input>',{
			'type' : 'button'
		}).val('削除').css(box_styles).css(button_style).css('margin-right','2px');

		//削除ボタン押下
		$button_decide.on('click',function(e){
			var selected_no = selected_id.replace('selectImage', '');
			
			if(character_info[selected_no].name != ''){
				//キャラクターを削除
				socketio.emit('character_delete', character_info[selected_no]);
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
		
		//BGM
		var $bgm = $('<audio></audio>', {
			'title' : 'CharacterCreate Bgm',
			'poster' : Core.instance.IMAGE_DIR + 'dummy.png',
			'preload' : 'auto',
			'loop' : ''
		});
		var $source1 = $('<source>', {
			'src' : Core.instance.SOUND_DIR + 'create.webm'
		});
		var $source2 = $('<source>', {
			'src' : Core.instance.SOUND_DIR + 'create.mp4'
		});
		var $source3 = $('<source>', {
			'src' : Core.instance.SOUND_DIR + 'create.ogv'
		});
		$(buttons._element).append($bgm);

		$bgm.append($source1);
		$bgm.append($source2);
		$bgm.append($source3);

		$(title._element).append($bgm);

		var name_box = new Array(6);
		var name_text = new Array(6);
		var class_images = new Array(6);
		var rank_text = new Array(6);
		var chara_images = new Array(6);
		var chara_select = new Array(6);

		var background_del_src = "url('" + Core.instance.IMAGE_DIR + "select_empty.png')";
		var background_src = "url('" + Core.instance.IMAGE_DIR + "dummy.png')";


		//キャラクター選択(6枠)
		for(var i=0; i<character_info.length; i++){
			//名前表示用枠
			name_box[i] = new Entity();
			var nation_image_src = "url('" + Core.instance.IMAGE_DIR + nation_src[character_info[i].nation] + "')";
			var nation_color = 'rgb(' + nation_rgb[character_info[i].nation] + ')';
			name_box[i].width = 158;
			name_box[i].height = 102;
			name_box[i]._element = $('<div></div>',{
				'width' : name_box[i].width + 'x',
				'height' : name_box[i].height + 'px'
			}).css(name_styles).css('background-image', nation_image_src).css('background-color', nation_color).get(0);

			//クラス画像
			class_images[i] = new Entity();
			class_images[i].width = 32;
			class_images[i].height = 64;
			var class_image_src = Core.instance.IMAGE_DIR + class_src[character_info[i].class];
			class_images[i]._element = $('<img>',{
				'width' : class_images[i].width + 'px',
				'height' : class_images[i].height + 'px',
				'src' : class_image_src
			}).get(0);

			//キャラクター名
			name_text[i] = new Entity();
			name_text[i].width = name_box[i].width - class_images[i].width;
			name_text[i].height = 28;
			name_text[i]._element = $('<div></div>',{
				'width' : name_text[i].width + 'px',
				'height' : name_text[i].height + 'px',
			}).css(name_text_styles).text(character_info[i].name).get(0);

			//階級
			rank_text[i] = new Entity();
			rank_text[i].width = name_text[i].width;
			rank_text[i].height = name_box[i].height / 2;
			rank_text[i]._element = $('<div></div>',{
				'width' : rank_text[i].width + 'px',
				'height' : rank_text[i].height + 'px',
			}).css(name_text_styles).text('訓練兵').get(0);

			//キャラクター選択用エフェクト
			chara_select[i] = new Entity();
			var bg_src = '';

			if(character_info[i].name != ''){
				bg_src = background_src;
			}else{
				bg_src = background_del_src;
			}

			chara_select[i].width = 158;
			chara_select[i].height = 224;
			
			chara_select[i]._element = $('<div></div>',{
				'id' : 'selectImage' + i,
				'width' : chara_select[i].width + 'px',
				'height' : chara_select[i].height + '224px',
			}).css(unselect_styles).css('background-image', bg_src).get(0);

			$(chara_select[i]._element).on('mouseover',function(e){
				$(this).css(select_styles);
			});

			$(chara_select[i]._element).on('mouseout',function(e){
				if($(this).attr('id') != selected_id){
					$(this).css(unselect_styles);
				}
			});

			$(chara_select[i]._element).on('click',function(e){
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
			if(character_info[i].name != ''){
				chara_images[i] = new SsaSprite(character_info[i], 80, 185);
				chara_images[i].x = name_box[i].width / 2 - chara_images[i].width / 2;
				chara_images[i].y = name_box[i].height + 224 - chara_images[i].height
				chara_images[i].draw();
			}
			
			//Groupに追加
			character_list[i] = new Group();
			character_list[i]._element = $('<div></div>').get(0);
			character_list[i].backgroundColor = 'rgb(200,200,200)';
			character_list[i].width = name_box[i].width;
			character_list[i].height = name_box[i].height + 185 + 5;
			character_list[i].addChild(name_box[i]);
			if(character_info[i].name != ''){
				character_list[i].addChild(class_images[i]);
				character_list[i].addChild(name_text[i]);
				character_list[i].addChild(rank_text[i]);
				character_list[i].addChild(chara_images[i]);
			}
			character_list[i].addChild(chara_select[i]);

			//表示位置の調整(Group内)
			if(character_info[i].name != ''){
				class_images[i].x = name_box[i].x + 2;
				class_images[i].y = name_box[i].y + 2;
				name_text[i].x = class_images[i].x + class_images[i].width + 2;
				name_text[i].y = class_images[i].y + 6;
				rank_text[i].x = name_text[i].x;
				rank_text[i].y = name_text[i].y + name_text[i].height + 2;
			}
			chara_select[i].y = name_box[i].height + 5;
			
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

//		$(this._element).css('background-image', 'url(' + Core.instance.IMAGE_DIR + 'rshein_lobby.png)');
//		$(this._element).css('background-size', Core.instance.width + 'px');

		this.addEventListener('enter', function(){
			$bgm.trigger('play');
		});

		this.addEventListener('enterframe', function(){
		});
		
		//削除後のイベント
		socketio.on('character_deleted', function(data){
			if(data[0].value != ''){
				alert(data[0].value);
			}else{
				var i = data[1].seq;
				character_info[i] = data[1];

				var nation_image_src = "url('" + Core.instance.IMAGE_DIR + nation_src[character_info[i].nation] + "')";
				var nation_color = 'rgb(' + nation_rgb[character_info[i].nation] + ')';
			
				//キャラクター表示を初期化
				$(name_text[i]._element).text('');
				$(rank_text[i]._element).text('');
				$(chara_select[i]._element).css('background-image', background_del_src);
				$(name_box[i]._element).css('background-image', nation_image_src).css('background-color', nation_color);
				character_list[i].removeChild(chara_images[i]);
				character_list[i].removeChild(class_images[i]);
			}
		});
	}
});
