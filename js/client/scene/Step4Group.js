enchant();

var Step4Group = enchant.Class.create(Group, {
	initialize: function(width, height, character_data){
		Group.call(this);
		
		//STEP4・クラス選択
		character_data.class = 0;
		
		var selected_class_id = '';
		var classes = ['ウォリアー','スカウト','プリースト','ソーサラー'];
		var class_explain = new Array(4);
		class_explain[0] = '高い攻撃力・防御力を持ち、特に敵にダメージを与えることに適したクラス。<br>ある程度の速度を活かしつつ敵方へ攻めたり、スキルの使い方次第で柔軟な対応が可能。';
		class_explain[1] = '移動が速く、広い視界を持っており、斥候的な情報収集をこなせるクラス。<br>敵施設を占拠したり敵陣に潜伏したりできるが、直接の殴り合いには向かず、逃げて生きる。';
		class_explain[2] = '味方を回復したり、防御的な特殊効果をかけることに秀でたクラス。<br>直接の攻撃力は無いに等しい。あくまでもサポートに徹する。';
		class_explain[3] = '範囲の魔法攻撃など、さまざまな魔法を駆使して戦うクラス。<br>直接の攻撃力・防御力は無いに等しいが、状況を見極めつつ一撃に賭ける。';
		var image_prifixies = ['female','male'];

		this._element = $('<div></div>').css('color','rgb(255,255,255)').get(0)
		this.width = width;
		this.height = height;
		this.checked = false;
		this.checking = false;

		//性別に応じて表示画像を変更
		var image_prefix = 'female';
		
		if(character_data.sex==1){
			image_prefix = 'male';
		}
		
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
			'border-color' : 'rgb(255,255,255)',
			'background-color' : 'rgb(115,114,94)'
		}

		var sample_image_styles = {
			'position' : 'absolute',
			'left' : '0px',
			'top' : '0px',
			'z-index' : '1'
		}

		var input_styles = {
			'padding' : '2px',
			'background-color' : 'rgba(0, 0, 0, 0.8)',
			'opacity' : '0.5',
			'font-size' : '16px',
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
			var box_id = $(box).attr('id');
			var box_no =  box_id.substr(box_id.length - 1, 1);

			$(box).css(box_select_styles);

			//説明文を変更
			$(class_name._element).text(classes[box_no]);
			$(class_text._element).html(class_explain[box_no]);
		}

		//マウスアウトイベント用共通メソッド
		function mouse_out(box){
			var box_id = $(box).attr('id') + '';
			
			if(box_id != selected_class_id){
				$(box).css(box_unselect_styles);
			}
		}

		//クリックイベント用共通メソッド
		function element_click(box){
			var box_id = $(box).attr('id');
			
			character_data.class = box_id.substr(box_id.length - 1, 1);

			if(selected_class_id == ''){
				$(box).css(box_select_styles);
				selected_class_id = box_id;
			}else{
				var prev_id = '#' + selected_class_id;
				$(prev_id).css(box_unselect_styles);
				$(box).css(box_select_styles);
				selected_class_id = box_id;
			}
			
			var selected_no = box_id.substr(box_id.length - 1, 1);
		}

		//操作説明
		var explain = new Entity();
		explain.width = 700;
		explain.height = 50;
		explain._element = $('<div></div>', {
			'width' : explain.width + 'px',
			'height' : explain.height + 'px'
		}).css(explain_styles).text('クラスを選択してください。').get(0);

		//クラス名
		var class_name = new Entity();
		class_name.width = 700;
		class_name.height = 50;
		class_name._element = $('<div></div>', {
			'width' : class_name.width + 'px',
			'height' : class_name.height + 'px',
		}).css(class_name_styles).text(classes[0]).get(0);

		//クラスの説明
		var class_text = new Entity();
		class_text.width = 700;
		class_text.height = 50;
		class_text._element = $('<div></div>', {
			'width' : class_name.width + 'px',
			'height' : class_name.height + 'px',
		}).css(class_explain_styles).html(class_explain[0]).get(0);

		//キャラクター名
		var character_name = new Entity();
		character_name.width = 160;
		character_name.height = 20;
		character_name._element = $('<div></div>', {
			'width' : character_name.width + 'px',
			'height' : character_name.height + 'px',
		}).css(class_explain_styles).text(character_data.name).get(0);
		
		var class_blocks = new Array(classes.length);
		
		var class_color = [
			'98,134,140',
			'103,132,84',
			'131,95,88',
			'131,95,88'
		]

		var class_inner_text = [
			'WARRIOR',
			'SCOUT',
			'PRIEST',
			'SORCERER'
		]

		var image_src = [
			'warrior.png',
			'scout.png',
			'priest.png',
			'sorcerer.png'
		]
		
		//クラス選択用BOX
		for(var i=0;i<classes.length;i++){
			class_blocks[i] = new Entity();
			class_blocks[i].width = 55;
			class_blocks[i].height = 105;
			class_blocks[i]._element = $('<div></div>', {
				'id' : 'class_' + i,
				'width' : class_blocks[i].width + 'px',
				'height' : class_blocks[i].height + 'px',
			}).css(sample_styles).css('background-color','rgb(' + class_color[i] + ')').text(class_inner_text[i]).get(0);

			var class_image = $('<img>',{
				'src' : Core.instance.IMAGE_DIR + image_src[i]
			}).css(sample_image_styles).get(0);

			class_blocks[i]._element.appendChild(class_image);
			this.addChild(class_blocks[i]);
			
			//位置の調整
			class_blocks[i].x = 100 + class_blocks[i].width + (i * class_blocks[i].width) + i * class_blocks[i].width;
			class_blocks[i].y = 140;

			//イベント設定
			$(class_blocks[i]._element).on('click',function(){element_click(this)});
			$(class_blocks[i]._element).on('mouseover',function(){mouse_over(this)});
			$(class_blocks[i]._element).on('mouseout',function(){mouse_out(this)});
		}

		//キャラクター表示用スプライト
		character_class = new Sprite(80,185);
		character_class._element = $('<canvas></canvas>').get(0);
		character_class._element.width = character_class.width;
		character_class._element.height = character_class.height;
		character_class.ctx = $(character_class._element)[0].getContext('2d');
		character_class.imageList = new SsImageList(Core.instance.motion[image_prifixies[character_data.sex] + '_wait'][0].images, Core.instance.MOTIIN_IMAGE_DIR, true);
		character_class.animation = new SsAnimation(Core.instance.motion[image_prifixies[character_data.sex] + '_wait'][0].animation, character_class.imageList);
		character_class.sprite = new SsSprite(character_class.animation);
		character_class.sprite.x = 32;
		character_class.sprite.y = 80;

		var imageFiles = Core.instance.motion[image_prifixies[character_data.sex] + '_wait'][0].images;

		//グループに追加
		this.addChild(explain);
		this.addChild(class_name);
		this.addChild(class_text);
		this.addChild(character_name);
		this.addChild(character_class);
		
		//表示部品の位置調整
		explain.y = 30;
		class_name.y = 266;
		class_text.y = class_name.y + class_name.height + 10;
		character_name.x = class_text.x + class_text.width + 50;
		character_name.y = class_blocks[0].y;
		character_class.x = character_name.x + character_name.width / 2 - character_class.width / 2;
		character_class.y = 190;

		//モーション描画
		$(function(){
		    setInterval(function(){
				character_class.ctx.putImageData(Core.instance.ctx.getImageData(0, 0, character_class.width, character_class.height), 0, 0);
		    },30);
		});

		//入力チェック
		this.checkInput = function(){
			this.checked = true;
			this.checking = false;
		}

		//グループ内の再描画
		this.updateGroup = function(){
	    	//名前の設定を反映
	    	if(character_data.name != $(character_name._element).text()){
	    		$(character_name._element).text(character_data.name);
	    	}
		}
	}
});