enchant();

var Step5Group = enchant.Class.create(Group, {
	initialize: function(width, height, character_data){
		Group.call(this);
		
		character_data.nation = 0;
		character_data.class = 0;
		
		//STEP5・確認
		var nation_name = ['イストリア王国','ギラード王国','ル・シェイン王国'];
		var nation_inner_name = ['estoria','gilard','rshein'];
		var nation_src = ['estoria.png','gilard.png','rshein.png'];
		var nation_rgb = ['66,109,122','174,114,104','94,127,48'];
		var class_name = ['ウォリアー','スカウト','プリースト','ソーサラー'];
		var class_inner_name = ['WARRIOR','SCOUT','PRIEST','SORCERER'];
		var class_src = ['warrior.png','scout.png','priest.png','sorcerer.png'];
		var class_rgb = ['98,134,140','103,132,84','131,95,88','131,95,88'];

		this._element = $('<div></div>').css('color','rgb(255,255,255)').get(0)
		this.width = width;
		this.height = height;
		this.checked = false;
		this.checking = false;

		//スタイル設定
		var explain_styles = {
			'font-size' : '25px',
			'text-align' : 'center',
			'color' : 'rgb(255,255,255)'
		}

		var class_name_styles = {
			'font-size' : '30px',
			'text-align' : 'center',
			'color' : 'rgb(255,255,255)'
		}

		var class_explain_styles = {
			'font-size' : '16px',
			'text-align' : 'center',
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
		}

		var sample_image_styles = {
			'position' : 'absolute',
			'left' : '0px',
			'top' : '0px',
			'z-index' : '1'
		}

		//画面説明
		var explain = new Entity();
		explain.width = this.width;
		explain.height = 50;
		explain._element = $('<div></div>', {
			'width' : explain.width + 'px',
			'height' : explain.height + 'px'
		}).css(explain_styles).text('この設定でゲームをはじめてよろしいですか？').get(0);

		//所属国イメージBOX
		var nation_box = new Entity();
		nation_box.width = 100;
		nation_box.height = 100;
		nation_box._element = $('<div></div>', {
			'width' : nation_box.width + 'px',
			'height' : nation_box.height + 'px',
		}).css(sample_styles).css('background-color','rgb(' + nation_rgb[character_data.nation] + ')').text(nation_inner_name[character_data.nation]).get(0);

		//所属国イメージ
		var nation_image = new Entity();
		nation_image.width = nation_box.width - 20;
		nation_image.height = nation_box.height - 20;
		nation_image._element = $('<img>',{
			'src' : Core.instance.IMAGE_DIR + nation_src[character_data.nation]
		}).css(sample_image_styles).get(0);

		//所属国名
		var nation_text = new Entity();
		nation_text.width = 200;
		nation_text.height = 50;
		nation_text._element = $('<div></div>', {
			'width' : nation_text.width + 'px',
			'height' : nation_text.height + 'px',
		}).css(explain_styles).text(nation_name[character_data.nation]).get(0);
		
		//クラスイメージBOX
		var class_box = new Entity();
		class_box.width = 55;
		class_box.height = 105;
		class_box._element = $('<div></div>', {
			'width' : class_box.width + 'px',
			'height' : class_box.height + 'px',
		}).css(sample_styles).css('background-color','rgb(' + class_rgb[character_data.class] + ')').text(class_inner_name[character_data.class]).get(0);

		//クラスイメージ
		var class_image = new Entity();
		class_image.width = class_box.width;
		class_image.height = class_box.height;
		class_image._element = $('<img>',{
			'src' : Core.instance.IMAGE_DIR + class_src[character_data.class]
		}).css(sample_image_styles).get(0);

		//クラス名
		var class_text = new Entity();
		class_text.width = 200;
		class_text.height = 50;
		class_text._element = $('<div></div>', {
			'width' : class_text.width + 'px',
			'height' : class_text.height + 'px',
		}).css(explain_styles).text(class_name[character_data.class]).get(0);

		//キャラクター名
		var character_name = new Entity();
		character_name.width = 160;
		character_name.height = 20;
		character_name._element = $('<div></div>', {
			'width' : character_name.width + 'px',
			'height' : character_name.height + 'px',
		}).css(class_explain_styles).text(character_data.name).get(0);
		
		//キャラクター表示用スプライト
		character_confirm = new Sprite(80,185);
		character_confirm._element = $('<canvas></canvas>').get(0);
		character_confirm._element.width = character_confirm.width;
		character_confirm._element.height = character_confirm.height;
		character_confirm.ctx = $(character_confirm._element)[0].getContext('2d');

		//グループに追加
		this.addChild(explain);
		this.addChild(nation_box);
		this.addChild(nation_image)
		this.addChild(nation_text);
		this.addChild(class_box);
		this.addChild(class_image)
		this.addChild(class_text);
		this.addChild(character_name);
		this.addChild(character_confirm);
		
		//表示部品の位置調整
		explain.y = 30;
		nation_box.x = 280;
		nation_box.y = 180;
		nation_image.x = nation_box.x + 10;
		nation_image.y = nation_box.y + 10;
		nation_text.x = nation_box.x + nation_box.width / 2 - nation_text.width / 2;
		nation_text.y = nation_box.y + nation_box.height + 30;

		character_name.x = nation_text.x + nation_text.width + 10;
		character_name.y = explain.y + explain.height + 80;
		character_confirm.x = character_name.x + character_name.width / 2 - character_class.width / 2;
		character_confirm.y = character_name.y + character_name.height + 10;

		class_text.x = character_name.x + character_name.width;
		class_text.y = nation_text.y;
		class_box.x = class_text.x + class_text.width / 2 - class_box.width / 2;;
		class_box.y = nation_box.y;
		class_image.x = class_box.x;
		class_image.y = class_box.y;

		//モーション描画
		$(function(){
		    setInterval(function(){
				character_confirm.ctx.putImageData(Core.instance.ctx.getImageData(0, 0, character_confirm.width, character_confirm.height), 0, 0);
		    },30);
		});

		//入力チェック
		this.checkInput = function(){
			this.checked = true;
			this.checking = false;
		}

		//グループ内の再描画
		this.updateGroup = function(){
	    	//所属国の設定を反映
	    	if(nation_inner_name[character_data.nation] != $(nation_box._element).text()){
		    	$(nation_box._element).css('background-color','rgb(' + nation_rgb[character_data.nation] + ')').text(nation_inner_name[character_data.nation]);
		    	$(nation_text._element).text(nation_name[character_data.nation]);
				$(nation_image._element).attr('src', Core.instance.IMAGE_DIR + nation_src[character_data.nation]);
		    }

	    	//クラスの設定を反映
	    	if(class_inner_name[character_data.class] != $(class_box._element).text()){
		    	$(class_box._element).css('background-color','rgb(' + class_rgb[character_data.class] + ')').text(class_inner_name[character_data.class]);
		    	$(class_text._element).text(class_name[character_data.class]);
				$(class_image._element).attr('src', Core.instance.IMAGE_DIR + class_src[character_data.class]);
			}
			
	    	//名前の設定を反映
			$(character_name._element).text(character_data.name);
		}
	}

});