enchant();

var SsaSpriteGroup = enchant.Class.create(Group, {
	initialize: function(character_data, width, height){
		Group.call(this);

		this._element = $('<div></div>').get(0);
		this.data = character_data;

		var player = new SsaSprite(character_data, width, height);
		player.autoDraw = true;
		
		var me = this;
		
		var label_styles = {
			'font-size' : '12px',
			'color' : 'rgb(255,255,255)',
			'text-align' : 'left'
		}

		var class_src = ['warrior.png','scout.png','priest.png','sorcerer.png'];

		//クラスアイコン
		var class_image = new Entity();
		class_image.width = 24;
		class_image.height = 46;
		class_image._element = $('<img>',{
			'width' : class_image.width + 'px',
			'height' : class_image.height + 'px',
			'src' : Core.instance.IMAGE_DIR + class_src[character_data.class]
		}).get(0);

		//名前表示用ラベル
		var player_label = new Entity();
		player_label.width = player.width - class_image.width;
		player_label.height = 20;
		player_label._element = $('<div></div>',{
			'width' : player_label.width + 'px',
			'height' : player_label.height + 'px'
		}).css(label_styles).text(character_data.name).get(0);

		//プレイヤー当たり判定用スプライト(16x16)
		var player_hit = new Sprite(16, 16);
		player_hit.image = Core.instance.assets[Core.instance.IMAGE_DIR + 'dummy.png'];
		player_hit.x = player.width / 2 - player_hit.x / 2;
		player_hit.y = player.height + class_image.height - player_hit.height;
		player_hit.frame = 0;
		
		//プレイヤー表示用グループの設定
		this.socket_id = character_data.socket_id;
		this.x = player.parent_x;
		this.y = player.parent_y;
		this.z = player.parent_z;
		
		this.addChild(player);
		this.addChild(player_hit);
		this.addChild(player_label);
		this.addChild(class_image);
		this.width = player.width;
		this.height = player.height + class_image.height;
		
		class_image.x = 0;
		class_image.y = 30;
		player_label.x = class_image.x + class_image.width + 5;
		player_label.y = class_image.y + class_image.height / 2 - player_label.height / 2;
		player.x = 0;
		player.y = class_image.height; 
		
		//プレイヤー情報をJSONオブジェクトで返却
		this.getJsonData = function(){
			//x,y,z座標を更新
			player.parent_x = this.x;
			player.parent_y = this.y;
			player.parent_z = this.z;

			//プロパティの値を全てコピー
			for(props in player){
				if(!(typeof player[props] == 'function') && !(typeof player[props] == 'object')){
					me.data[props] = player[props];
				}
			}
			return me.data;
		}
	}
});