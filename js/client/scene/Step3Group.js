enchant();

var Step3Group = enchant.Class.create(Group, {
	initialize: function(width, height, character_data, socketio){
		Group.call(this);
		
		//STEP3・キャラクター詳細
		var selected_hair_color_id = '';
		var selected_hair_id = '';
		var selected_skin_color_id = '';
		var selected_face_id = '';
		var me = this;

		this._element = $('<div></div>').css('color','rgb(255,255,255)').get(0)
		this.width = width;
		this.height = height;
		this.checked = false;
		this.checking = false;
		this.draw_timer = 0;
		
		//性別に応じて表示画像を変更
		var image_prefixies = ['female', 'male'];
		var image_prefix = image_prefixies[character_data.sex];

		//スタイル設定
		var explain_styles = {
			'font-size' : '25px',
			'text-align' : 'center',
			'color' : 'rgb(255,255,255)'
		}

		var setting_styles = {
			'font-size' : '25px',
			'text-align' : 'left',
			'color' : 'rgb(255,255,255)'
		}

		var sample_styles = {
			'border-radius' : '3px',
			'-webkit-border-radius' : '3px',
			'-moz-border-radius' : '3px',
			'font-size' : '8px',
			'color' : 'rgb(255,255,255)',
			'border-style' : 'solid',
			'border-width' : '1px',
			'border-color' : 'rgb(255,255,255)',
			'background-color' : 'rgb(115,114,94)'
		}

		var color_styles = {
			'border-radius' : '3px',
			'-webkit-border-radius' : '3px',
			'-moz-border-radius' : '3px',
			'border-style' : 'solid',
			'border-width' : '1px',
			'border-color' : 'rgb(255,255,255)'
		}

		//髪型ベース
		var sample_image_styles = new Array(2);

		//髪型ベース(女性)
		sample_image_styles[0] = {
			'position' : 'absolute',
			'left' : '0px',
			'top' : '0px',
			'z-index' : '1'
		}

		//髪型ベース(男性)
		sample_image_styles[1] = {
			'position' : 'absolute',
			'left' : '0px',
			'top' : '0px',
			'z-index' : '1'
		}

		//髪型・前
		var sample_hair_front_styles = new Array(2);

		//髪型・前(女性)
		sample_hair_front_styles[0] = {
			'position' : 'absolute',
			'left' : '-9px',
			'top' : '0px',
			'z-index' : '2'
		}
		//髪型・前(男性)
		sample_hair_front_styles[1] = {
			'position' : 'absolute',
			'left' : '-13px',
			'top' : '-8px',
			'z-index' : '2'
		}

		//髪型・後
		var sample_hair_back_styles = new Array(2);

		sample_hair_back_styles[0] = {
			'position' : 'absolute',
			'left' : '0px',
			'top' : '19px',
			'z-index' : '0'
		}
		sample_hair_back_styles[1] = {
			'position' : 'absolute',
			'left' : '0px',
			'top' : '19px',
			'z-index' : '0'
		}

		//顔の髪型・前
		var sample_face_hair_front_styles = new Array(2);

		//顔の髪型・前(女性)
		sample_face_hair_front_styles[0] = {
			'position' : 'absolute',
			'left' : '-9px',
			'top' : '15px',
			'z-index' : '2'
		}
		//顔の髪型・前(男性)
		sample_face_hair_front_styles[1] = {
			'position' : 'absolute',
			'left' : '-12px',
			'top' : '10px',
			'z-index' : '2'
		}

		//顔
		var sample_face_styles = new Array(2);

		//顔(女性)
		sample_face_styles[0] = {
			'position' : 'absolute',
			'left' : '2px',
			'top' : '30px',
			'z-index' : '1'
		}

		//顔(男性)
		sample_face_styles[1] = {
			'position' : 'absolute',
			'left' : '4px',
			'top' : '25px',
			'z-index' : '1'
		}

		//頭
		var sample_head_styles = new Array();
		
		//頭(女性)
		sample_head_styles[0] = {
			'position' : 'absolute',
			'left' : '4px',
			'top' : '25px',
			'z-index' : '1'
		}

		//頭(男性)
		sample_head_styles[1] = {
			'position' : 'absolute',
			'left' : '4px',
			'top' : '25px',
			'z-index' : '1'
		}

		var input_styles = {
			'padding' : '2px',
			'background-color' : 'rgba(0, 0, 0, 0.8)',
			'opacity' : '0.5',
			'font-size' : '12px',
			'color' : 'rgb(255,255,255)'
		}

		var box_select_styles = {
			'box-shadow' : '0px 0px 2px 2px rgba(255, 255, 255, 0.5) inset',
		}
		
		var box_unselect_styles = {
			'box-shadow' : '0px 0px 0px 0px rgba(255, 255, 255, 1)',
		}
		
		//マウスオーバーイベント用共通メソッド
		function mouse_over(box){
			$(box).css(box_select_styles);
		}

		//マウスアウトイベント用共通メソッド
		function mouse_out(box, selected_id){
			var box_id = $(box).attr('id') + '';
			
			if(box_id != selected_id){
				$(box).css(box_unselect_styles);
			}
		}

		//髪色クリックイベント
		function element_hair_color_click(box){
			var box_id = $(box).attr('id');

			if(selected_hair_color_id == ''){
				$(box).css(box_select_styles);
				selected_hair_color_id = box_id;
			}else{
				var prev_id = '#' + selected_hair_color_id;
				$(prev_id).css(box_unselect_styles);
				$(box).css(box_select_styles);
				selected_hair_color_id = box_id;
			}
			
			var selected_no = box_id.replace('hair_color_', '');

			//キャラクターイメージに反映
			character.hair_color = selected_no;
			character.restructImage();

			//データ更新
			character_data.hair_color = character.hair_color;

			//髪型パターンの色を変更
			
			//前髪
			for(var i=0; i<hair_samples_front.length; i++){
				var path = Core.instance.MOTIN_IMAGE_DIR + image_prefix + '_base_hair' + (i+1) + '_front.png?' + selected_no;
				var image = Core.instance.cachedImages.getImageFromPath(path);
				hair_samples_front[i].src = image.src;
			}
			
			//後ろ髪
			for(var i=0; i<hair_samples_back.length; i++){
				var path = Core.instance.MOTIN_IMAGE_DIR + image_prefix + '_base_hair' + (i+1) + '_back.png?' + selected_no;
				var image = Core.instance.cachedImages.getImageFromPath(path);
				hair_samples_back[i].src = image.src;
			}
			
			//顔サンプルの髪型
			for(var i=0; i<face_samples_front.length; i++){
				face_samples_front[i].src = hair_samples_front[character.hair-1].src;
			}
		}

		//肌の色クリックイベント
		function element_skin_color_click(box){
			var box_id = $(box).attr('id');

			if(selected_skin_color_id == ''){
				$(box).css(box_select_styles);
				selected_skin_color_id = box_id;
			}else{
				var prev_id = '#' + selected_skin_color_id;
				$(prev_id).css(box_unselect_styles);
				$(box).css(box_select_styles);
				selected_skin_color_id = box_id;
			}
			
			var selected_no = box_id.replace('skin_color_', '');

			//キャラクターイメージに反映
			character.skin_color = selected_no;
			character.restructImage();
			
			//データ更新
			character_data.skin_color = character.skin_color;

			//顔サンプル
			for(var i=0; i<face_samples.length; i++){
				var path = Core.instance.MOTIN_IMAGE_DIR + image_prefix + '_base_face' + (i+1) + '.png?' + selected_no;
				var image = Core.instance.cachedImages.getImageFromPath(path);
				face_samples[i].src = image.src;
				
				path = Core.instance.MOTIN_IMAGE_DIR + image_prefix + '_base_head.png?' + selected_no;
				image = Core.instance.cachedImages.getImageFromPath(path);
				face_samples_base[i].src = image.src;
			}
		}

		//髪型パターンクリックイベント
		function element_hair_click(box){
			var box_id = $(box).attr('id');

			if(selected_hair_id == ''){
				$(box).css(box_select_styles);
				selected_hair_id = box_id;
			}else{
				var prev_id = '#' + selected_hair_id;
				$(prev_id).css(box_unselect_styles);
				$(box).css(box_select_styles);
				selected_hair_id = box_id;
			}

			var selected_no = box_id.replace('hair_sample_', '');

			//キャラクターイメージに反映
			character.hair = selected_no;
			character.restructImage();
			
			//データ更新
			character_data.hair = character.hair;

			//顔サンプルの髪型
			for(var i=0; i<face_samples_front.length; i++){
				face_samples_front[i].src = hair_samples_front[character.hair -1].src;
			}
		}

		//顔パターンクリックイベント
		function element_face_click(box){
			var box_id = $(box).attr('id');

			if(selected_face_id == ''){
				$(box).css(box_select_styles);
				selected_face_id = box_id;
			}else{
				var prev_id = '#' + selected_face_id;
				$(prev_id).css(box_unselect_styles);
				$(box).css(box_select_styles);
				selected_face_id = box_id;
			}
			
			var selected_no = box_id.replace('face_sample_', '');

			//キャラクターイメージに反映
			character.face = selected_no;
			character.restructImage();

			//データ更新
			character_data.face = character.face;
		}

		//操作説明
		var explain = new Entity();
		explain.width = this.width;
		explain.height = 50;
		explain._element = $('<div></div>', {
			'width' : explain.width + 'px',
			'height' : explain.height + 'px'
		}).css(explain_styles).text('キャラクターの詳細を決定してください。').get(0);

		//髪の設定
		var hair_setting = new Entity();
		hair_setting.width = 30;
		hair_setting.height = 30;
		hair_setting._element = $('<div></div>', {
			'width' : hair_setting.width + 'px',
			'height' : hair_setting.height + 'px',
		}).css(setting_styles).text('髪').get(0);
		
		var hair_color_blocks = new Array(Core.instance.hair_colors.length);
		
		//髪の色指定用BOX
		for(var i=0;i<Core.instance.hair_colors.length;i++){
			hair_color_blocks[i] = new Entity();
			hair_color_blocks[i].width = 24;
			hair_color_blocks[i].height = 12;
			hair_color_blocks[i]._element = $('<div></div>', {
				'id' : 'hair_color_' + i,
				'width' : hair_color_blocks[i].width + 'px',
				'height' : hair_color_blocks[i].height + 'px',
			}).css(color_styles).css('background-color','rgb(' + Core.instance.hair_colors[i] + ')').get(0);
			this.addChild(hair_color_blocks[i]);
			hair_color_blocks[i].x = hair_setting.width + (i * hair_color_blocks[i].width) + i * 5;
			hair_color_blocks[i].y = 136;
			
			//イベント設定
			$(hair_color_blocks[i]._element).on('click',function(){element_hair_color_click(this)});
			$(hair_color_blocks[i]._element).on('mouseover',function(){mouse_over(this)});
			$(hair_color_blocks[i]._element).on('mouseout',function(){mouse_out(this, selected_hair_color_id)});
		}

		var hair_samples_box = new Array(10);
		var hair_samples_front = new Array(10);
		var hair_samples_back = new Array(10);
		var hair_samples_base = new Array(10);

		//髪形サンプル表示用BOX
		for(var j=0;j<hair_samples_box.length;j++){
			hair_samples_box[j] = new Entity();
			hair_samples_box[j].width = 40;
			hair_samples_box[j].height = 80;
			hair_samples_box[j]._element = $('<div></div>', {
				'id' : 'hair_sample_' + (j + 1),
				'width' : hair_samples_box[j].width + 'px',
				'height' : hair_samples_box[j].height + 'px',
			}).css(sample_styles).text('HAIR').get(0);

			//画像をHTMLの子要素として追加
			hair_samples_base[j] = $('<img>',{
				'src' : Core.instance.IMAGE_DIR + image_prefix + '_hair_base.png'
			}).css(sample_image_styles[character_data.sex]).get(0);

			hair_samples_front[j] = $('<img>',{
				'src' : Core.instance.MOTIN_IMAGE_DIR + image_prefix + '_base_hair' + (j+1) + '_front.png'
			}).css(sample_hair_front_styles[character_data.sex]).get(0);

			hair_samples_back[j] = $('<img>',{
				'src' : Core.instance.MOTIN_IMAGE_DIR + image_prefix + '_base_hair' + (j+1) + '_back.png'
			}).css(sample_hair_back_styles[character_data.sex]).get(0);
			
			hair_samples_box[j]._element.appendChild(hair_samples_base[j]);
			hair_samples_box[j]._element.appendChild(hair_samples_front[j]);
			hair_samples_box[j]._element.appendChild(hair_samples_back[j]);
			this.addChild(hair_samples_box[j]);
			hair_samples_box[j].x = (j * hair_samples_box[j].width) + j * 5;
			hair_samples_box[j].y = hair_color_blocks[0].y + hair_color_blocks[0].height + 5;

			//イベント設定
			$(hair_samples_box[j]._element).on('click',function(){element_hair_click(this)});
			$(hair_samples_box[j]._element).on('mouseover',function(){mouse_over(this)});
			$(hair_samples_box[j]._element).on('mouseout',function(){mouse_out(this, selected_hair_id)});
		}

		//顔の設定
		var face_setting = new Entity();
		face_setting.width = 30;
		face_setting.height = 30;
		face_setting._element = $('<div></div>', {
			'width' : face_setting.width + 'px',
			'height' : face_setting.height + 'px',
		}).css(setting_styles).text('顔').get(0);

		var skin_color_blocks = new Array(Core.instance.skin_colors.length);
		
		//肌の色指定用BOX
		for(var i=0;i<Core.instance.skin_colors.length;i++){
			skin_color_blocks[i] = new Entity();
			skin_color_blocks[i].width = 24;
			skin_color_blocks[i].height = 12;
			skin_color_blocks[i]._element = $('<div></div>', {
				'id' : 'skin_color_' + i,
				'width' : skin_color_blocks[i].width + 'px',
				'height' : skin_color_blocks[i].height + 'px',
			}).css(color_styles).css('background-color','rgb(' + Core.instance.skin_colors[i] + ')').get(0);
			this.addChild(skin_color_blocks[i]);
			skin_color_blocks[i].x = face_setting.width + (i * skin_color_blocks[i].width) + i * 5;
			skin_color_blocks[i].y = 270;
			
			//イベント設定
			$(skin_color_blocks[i]._element).on('click',function(){element_skin_color_click(this)});
			$(skin_color_blocks[i]._element).on('mouseover',function(){mouse_over(this)});
			$(skin_color_blocks[i]._element).on('mouseout',function(){mouse_out(this, selected_skin_color_id)});
		}

		var face_samples_box = new Array(6);
		var face_samples = new Array(6);
		var face_samples_base = new Array(6);
		var face_samples_front = new Array(6);

		//顔サンプル表示用BOX
		for(var j=0;j<face_samples_box.length;j++){
			face_samples_box[j] = new Entity();
			face_samples_box[j].width = 40;
			face_samples_box[j].height = 80;
			face_samples_box[j]._element = $('<div></div>', {
				'id' : 'face_sample_' + (j + 1),
				'width' : face_samples_box[j].width + 'px',
				'height' : face_samples_box[j].height + 'px',
			}).css(sample_styles).text('FACE').get(0);

			//画像をHTMLの子要素として追加
			face_samples_base[j] = $('<img>',{
				'src' : Core.instance.MOTION_IMAGE_DIR + image_prefix + '_base_head.png'
			}).css(sample_head_styles[character_data.sex]).get(0);

			face_samples_front[j] = $('<img>',{
				'src' : Core.instance.MOTION_IMAGE_DIR + image_prefix + '_base_hair1_front.png'
			}).css(sample_face_hair_front_styles[character_data.sex]).get(0);

			face_samples[j] = $('<img>',{
				'src' : Core.instance.MOTION_IMAGE_DIR + image_prefix + '_base_face' + (j+1) + '.png'
			}).css(sample_face_styles[character_data.sex]).get(0);
			
			face_samples_box[j]._element.appendChild(face_samples_base[j]);
			face_samples_box[j]._element.appendChild(face_samples_front[j]);
			face_samples_box[j]._element.appendChild(face_samples[j]);
			this.addChild(face_samples_box[j]);
			face_samples_box[j].x = (j * face_samples_box[j].width) + j * 5;
			face_samples_box[j].y = skin_color_blocks[0].y + skin_color_blocks[0].height + 5;

			//イベント設定
			$(face_samples_box[j]._element).on('click',function(){element_face_click(this)});
			$(face_samples_box[j]._element).on('mouseover',function(){mouse_over(this)});
			$(face_samples_box[j]._element).on('mouseout',function(){mouse_out(this, selected_face_id)});
		}

		//名前入力
		var name_setting = new Entity();
		name_setting.width = 300;
		name_setting.height = 24;
		name_setting._element = $('<div></div>', {
			'width' : name_setting.width + 'px',
			'height' : name_setting.height + 'px',
		}).css(setting_styles).css('font-size','22px').text('名前を入力してください。').get(0);

		//名前入力用テキストボックス
		var name_input = new Entity();
		name_input.width = 130;
		name_input.height = 20;
		name_input._element = $('<input>',{
			'type' : 'text',
			'width' : name_input.width,
			'height' : name_input.height
		}).css(input_styles).css(color_styles).get(0);

		//イベント設定
		$(name_input._element).on('change',function(){character_data.name = this.value})

		//キャラクター表示
		character = new SsaSprite(character_data, 80,185);

		//イメージへの参照を保存
		Core.instance.ctx = character.ctx;

		//グループに追加
		this.addChild(explain);
		this.addChild(hair_setting);
		this.addChild(face_setting);
		this.addChild(name_setting);
		this.addChild(name_input);
		this.addChild(character);
		
		//表示部品の位置調整
		explain.y = 30;
		hair_setting.y = 122;
		face_setting.y = 258;
		name_setting.x = 660;
		name_setting.y = 100;
		name_input.x = 690;
		name_input.y = name_setting.y + name_setting.height + 5;
		character.x = 720;
		character.y = name_input.y + name_input.height + 30;

		//初期値に従って選択状態に変更
		
		//髪の色
		$(hair_color_blocks[character.hair_color]._element).trigger('click');
		$(hair_color_blocks[character.hair_color]._element).trigger('mouseover');

		//髪型
		$(hair_samples_box[character.hair - 1]._element).trigger('click');
		$(hair_samples_box[character.hair - 1]._element).trigger('mouseover');

		//肌の色
		$(skin_color_blocks[character.skin_color]._element).trigger('click');
		$(skin_color_blocks[character.skin_color]._element).trigger('mouseover');

		//顔
		$(face_samples_box[character.face - 1]._element).trigger('click');
		$(face_samples_box[character.face - 1]._element).trigger('mouseover');

		//モーション描画
		$(function(){
		    draw_timer = setInterval(function(){
		    	character.draw();
		    },30);
		});

		//入力チェック
		this.checkInput = function(){
			if (this.checking == false) {
				if (character_data.name == '') {
					alert('名前を入力してください。');
					this.checking = false;
					this.checked = false;
				} else {
					this.checking = true;
					this.checked = false;
					socketio.emit('name_duplicate_check', {'id' : character_data.id, 'name' : character_data.name});
				}
			}
		}

		//グループ内の再描画
		this.updateGroup = function(){
			if(image_prefixies[character_data.sex] != image_prefix){
				//性別変更時のみ、画像を再描画
				image_prefix = image_prefixies[character_data.sex];

				var sample_image_style = sample_image_styles[character_data.sex];
				var sample_hair_front_style = sample_hair_front_styles[character_data.sex];
				var sample_face_hair_front_style = sample_face_hair_front_styles[character_data.sex];
				var sample_hair_back_style = sample_hair_back_styles[character_data.sex];
				var sample_face_style = sample_face_styles[character_data.sex];
				var sample_head_style = sample_head_styles[character_data.sex];

				
				//髪型サンプル
				for(var i=0; i<hair_samples_front.length; i++){
					var path1 = Core.instance.IMAGE_DIR + image_prefix + '_hair_base.png';
					var path2 = Core.instance.MOTIN_IMAGE_DIR + image_prefix + '_base_hair' + (i+1) + '_front.png?' + character.hair_color;
					var path3 = Core.instance.MOTIN_IMAGE_DIR + image_prefix + '_base_hair' + (i+1) + '_back.png?' + character.hair_color;
					
					hair_samples_base[i].src = path1;
					hair_samples_front[i].src = path2;
					hair_samples_back[i].src = path3;
					
					//表示位置調整
					$(hair_samples_front[i]).css(sample_hair_front_style);
				}

				//顔サンプルの髪型
				for(var i=0; i<face_samples_front.length; i++){
					face_samples_front[i].src = hair_samples_front[character.hair -1].src;
					$(face_samples_front[i]).css(sample_face_hair_front_style);
				}
				
				//顔サンプル
				for(var i=0; i<face_samples.length; i++){
					var path1 = Core.instance.MOTIN_IMAGE_DIR + image_prefix + '_base_face' + (i+1) + '.png?' + character.skin_color;
					var path2 = Core.instance.MOTIN_IMAGE_DIR + image_prefix + '_base_head.png?' + character.skin_color;

					face_samples[i].src = path1;
					$(face_samples[i]).css(sample_face_style);
					
					face_samples_base[i].src = path2;
					$(face_samples_base[i]).css(sample_head_style);
				}

				//キャラクター再表示
				
				//モーション描画停止
				clearInterval(draw_timer)
				
				//Groupからキャラクターを削除し再作成
				this.removeChild(character);
				character = null;
				character = new SsaSprite(character_data, 80,185);

				//イメージへの参照を保存
				Core.instance.ctx = character.ctx;
				
				//再作成したキャラクターをGroupに追加
				this.addChild(character);
				
				//初期表示位置の調整
				character.x = 720;
				character.y = name_input.y + name_input.height + 30;

				//初期値に従って選択状態に変更
				
				//髪の色
				$(hair_color_blocks[character.hair_color]._element).trigger('click');
				$(hair_color_blocks[character.hair_color]._element).trigger('mouseover');

				//髪型
				$(hair_samples_box[character.hair - 1]._element).trigger('click');
				$(hair_samples_box[character.hair - 1]._element).trigger('mouseover');

				//肌の色
				$(skin_color_blocks[character.skin_color]._element).trigger('click');
				$(skin_color_blocks[character.skin_color]._element).trigger('mouseover');

				//顔
				$(face_samples_box[character.face - 1]._element).trigger('click');
				$(face_samples_box[character.face - 1]._element).trigger('mouseover');
				
				//モーション描画再開
				$(function(){
				    draw_timer = setInterval(function(){
				    	character.draw();
				    },30);
				});
			}
		}

		//名前重複チェック
		socketio.on('name_duplicate_checked',function(data){
			if(data.value != ''){
				alert(data.value);
				me.checking = false;
				me.checked = false;
			} else {
				//入力した名前を保存
				socketio.emit('name_save', {'id' : character_data.id, 'name' : character_data.name});
			}
		});
		
		//名前保存
		socketio.on('name_saved',function(data){
			if(data.value != ''){
				alert(data.value);
				me.checking = false;
				me.checked = false;
				return;
			}
			me.checking = false;
			me.checked = true;
		});
	}
});