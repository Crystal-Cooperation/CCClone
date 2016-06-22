enchant();

var Step2Group = enchant.Class.create(Group, {
	initialize: function(width, height, character_data){
		Group.call(this);
		
		//STEP2・性別選択
		character_data.sex = 0;
		var selected_id = '';
		
		this._element = $('<div></div>').css('color','rgb(255,255,255)').get(0)
		this.width = width;
		this.height = height;
		this.checked = false;
		this.checking = false;

		var explain_styles = {
			'font-size' : '25px',
			'text-align' : 'center',
			'color' : 'rgb(255,255,255)'
		}
		
		var box_select_styles = {
			'border-radius' : '3px',
			'-webkit-border-radius' : '3px',
			'-moz-border-radius' : '3px',
			'border-style' : 'solid',
			'border-width' : '1px',
			'border-color' : 'rgb(255,255,255)'
		}
		
		var box_unselect_styles = {
			'border-radius' : '3px',
			'-webkit-border-radius' : '3px',
			'-moz-border-radius' : '3px',
			'border-style' : 'solid',
			'border-width' : '1px',
			'border-color' : 'rgb(100,100,100)'
		}
		
		//マウスオーバーイベント用共通メソッド
		function mouse_over(box){
			$(box._element).css(box_select_styles);
		}

		//マウスアウトイベント用共通メソッド
		function mouse_out(box){
			var box_id = $(box._element).attr('id') + '';
			
			if(box_id != selected_id){
				$(box._element).css(box_unselect_styles);
			}
		}

		//クリックイベント用共通メソッド
		function element_click(box){
			var box_id = $(box._element).attr('id') + '';
	
			character_data.sex = box_id.substr(box_id.length - 1, 1);
			
			if(selected_id == ''){
				$(box._element).css(box_select_styles);
				selected_id = box_id;
			}else{
				var prev_id = '#' + selected_id;
				
				$(prev_id).css(box_unselect_styles);
				$(box._element).css(box_select_styles);
				selected_id = box_id;
			}
		}
		
		//操作説明
		var explain = new Entity();
		explain.width = this.width;
		explain.height = 50;
		explain._element = $('<div></div>', {
			'width' : explain.width + 'px',
			'height' : explain.height + 'px'
		}).css(explain_styles).text('性別を選択してください。').get(0);

		//性別イメージ（女）
		var female_image = new Entity();
		female_image.width = 82;
		female_image.height = 184;
		female_image._element = $('<img>', {
			'width' : female_image.width + 'px',
			'height' : female_image.height + 'px',
			'src' : Core.instance.IMAGE_DIR + 'female.png'
		}).get(0);

		//性別シンボルイメージ（女）
		var female_symbol = new Entity();
		female_symbol.width = 120;
		female_symbol.height = 78;
		female_symbol._element = $('<img>', {
			'width' : female_symbol.width + 'px',
			'height' : female_symbol.height + 'px',
			'src' : Core.instance.IMAGE_DIR + 'female_symbol.png'
		}).get(0);

		//性別イメージ（女）ボックス
		var female_box = new Entity();
		female_box.width = 132;
		female_box.height = 132;
		female_box._element = $('<img>', {
			'id' : 'select_box0',
			'width' : female_box.width + 'px',
			'height' : female_box.height + 'px'
		}).css(box_unselect_styles).css('background-color','rgb(171,120,115)').get(0);
		
		//性別テキスト
		var female_text = new Entity();
		female_text.width = female_box.width;
		female_text.height = 40;
		female_text._element = $('<div></div>', {
			'width' : female_text.width + 'px',
			'height' : female_text.height + 'px'
		}).css(explain_styles).text('女性').get(0);

		//イベント設定
		$(female_image._element).on('click',function(){element_click(female_box)});
		$(female_image._element).on('mouseover',function(){mouse_over(female_box)});
		$(female_image._element).on('mouseout',function(){mouse_out(female_box)});

		$(female_symbol._element).on('click',function(){element_click(female_box)});
		$(female_symbol._element).on('mouseover',function(){mouse_over(female_box)});
		$(female_symbol._element).on('mouseout',function(){mouse_out(female_box)});

		$(female_box._element).on('click',function(){element_click(female_box)});
		$(female_box._element).on('mouseover',function(){mouse_over(female_box)});
		$(female_box._element).on('mouseout',function(){mouse_out(female_box)});

		$(female_text._element).on('click',function(){element_click(female_box)});
		$(female_text._element).on('mouseover',function(){mouse_over(female_box)});
		$(female_text._element).on('mouseout',function(){mouse_out(female_box)});

		//性別イメージ（男）
		var male_image = new Entity();
		male_image.width = 82;
		male_image.height = 184;
		male_image._element = $('<img>', {
			'width' : male_image.width + 'px',
			'height' : male_image.height + 'px',
			'src' : Core.instance.IMAGE_DIR + 'male.png'
		}).get(0);

		//性別シンボルイメージ（男）
		var male_symbol = new Entity();
		male_symbol.width = 120;
		male_symbol.height = 78;
		male_symbol._element = $('<img>', {
			'id' : 'select_box1',
			'width' : male_symbol.width + 'px',
			'height' : male_symbol.height + 'px',
			'src' : Core.instance.IMAGE_DIR + 'male_symbol.png'
		}).get(0);

		//性別イメージ（男）ボックス
		var male_box = new Entity();
		male_box.width = 132;
		male_box.height = 132;
		male_box._element = $('<img>', {
			'id' : 'select_box1',
			'width' : male_box.width + 'px',
			'height' : male_box.height + 'px'
		}).css(box_unselect_styles).css('background-color','rgb(64,99,119)').get(0);
		
		//性別テキスト
		var male_text = new Entity();
		male_text.width = male_box.width;
		male_text.height = 40;
		male_text._element = $('<div></div>', {
			'width' : male_text.width + 'px',
			'height' : male_text.height + 'px'
		}).css(explain_styles).text('男性').get(0);

		//イベント設定
		$(male_image._element).on('click',function(){element_click(male_box)});
		$(male_image._element).on('mouseover',function(){mouse_over(male_box)});
		$(male_image._element).on('mouseout',function(){mouse_out(male_box)});

		$(male_symbol._element).on('click',function(){element_click(male_box)});
		$(male_symbol._element).on('mouseover',function(){mouse_over(male_box)});
		$(male_symbol._element).on('mouseout',function(){mouse_out(male_box)});

		$(male_box._element).on('click',function(){element_click(male_box)});
		$(male_box._element).on('mouseover',function(){mouse_over(male_box)});
		$(male_box._element).on('mouseout',function(){mouse_out(male_box)});

		$(male_text._element).on('click',function(){element_click(male_box)});
		$(male_text._element).on('mouseover',function(){mouse_over(male_box)});
		$(male_text._element).on('mouseout',function(){mouse_out(male_box)});

		//グループに追加
		this.addChild(explain);
		this.addChild(female_box);
		this.addChild(female_image);
		this.addChild(female_symbol);
		this.addChild(female_text);
		this.addChild(male_box);
		this.addChild(male_image);
		this.addChild(male_symbol);
		this.addChild(male_text);
		
		//表示部品の位置調整
		explain.y = 30;
		female_box.x = this.width / 2 - female_box.width - 50;
		female_box.y = explain.y + explain.height + 30 + (female_image.height / 2);
		female_image.x = female_box.x  + (female_box.width / 2) - (female_image.width / 2);
		female_image.y = female_box.y - (female_image.height / 2);
		female_symbol.x = female_box.x - female_box.width / 2;
		female_symbol.y = female_box.y + female_box.width - female_symbol.height;
		female_text.x = female_box.x;
		female_text.y = female_box.y + male_box.height + 5;

		male_box.x = this.width / 2 + 50;
		male_box.y = explain.y + explain.height + 30 + (male_image.height / 2);
		male_image.x = male_box.x  + (male_box.width / 2) - (male_image.width / 2);
		male_image.y = male_box.y - (male_image.height / 2);
		male_symbol.x = male_box.x + male_box.width / 2;
		male_symbol.y = male_box.y + male_box.width - male_symbol.height;
		male_text.x = male_box.x;
		male_text.y = male_box.y + male_box.height + 5;

		//入力チェック
		this.checkInput = function(){
			this.checked = true;
			this.checking = false;
		}

		//グループ内の再描画
		this.updateGroup = function(){
		}
	}
});