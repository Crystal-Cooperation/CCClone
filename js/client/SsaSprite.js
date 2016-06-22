enchant();

var SsaSprite = enchant.Class.create(Sprite, {
	initialize: function(character_data, width, height){
		Sprite.call(this, width, height);

		//プレイヤー情報を保存
		this.socket_id = character_data.socket_id;
		this.id = character_data.id;
		this.name = character_data.name;
		this.scaleX = character_data.scaleX;
		this.x = character_data.x;
		this.y = character_data.y;
		this.z = character_data.z;
		this.parent_x = character_data.parent_x;
		this.parent_y = character_data.parent_y;
		this.parent_z = character_data.parent_z;
		this.scaleX = character_data.scaleX;
		this.nation = character_data.nation;
		this.sex = character_data.sex;
		this.hair_color = character_data.hair_color;
		this.hair = character_data.hair;
		this.skin_color = character_data.skin_color;
		this.face = character_data.face;
		this.class = character_data.class;
		this.autoDraw = false;

		var prefix = ['female_', 'male_'];

		//elementにcanvasを設定
		this._element = $('<canvas></canvas>').get(0);
		this._element.width = this.width;
		this._element.height = this.height;
		this.ctx = $(this._element)[0].getContext('2d');
		
		//imageListはキャラクター毎に持つ必要あり？
		this.imageList = new Array();
		this.imageList['wait'] = new SsCachedImageList(Core.instance.cachedImages, Core.instance.motion[prefix[this.sex] + 'wait'][0].images, Core.instance.MOTIN_IMAGE_DIR, true);
		this.imageList['walk'] = new SsCachedImageList(Core.instance.cachedImages, Core.instance.motion[prefix[this.sex] + 'walk'][0].images, Core.instance.MOTIN_IMAGE_DIR, true);
		this.animation = new Array();
		this.animation['wait'] = new SsAnimation(Core.instance.motion[prefix[this.sex] + 'wait'][0].animation, this.imageList['wait']);
		this.animation['walk'] = new SsAnimation(Core.instance.motion[prefix[this.sex] + 'walk'][0].animation, this.imageList['walk']);
		this.sprite = new Array();
		this.sprite['wait'] = new SsSprite(this.animation['wait']);
		this.sprite['walk'] = new SsSprite(this.animation['walk']);
		this.sprite['wait'].x = this.width / 2;
		this.sprite['wait'].y = this.height / 2;
		this.sprite['walk'].x = this.width / 2;
		this.sprite['walk'].y = this.height / 2;
		
		//imageListを再構築
		this.motion = 'wait';
		this.restructImage();
		this.motion = 'walk';
		this.restructImage();
		this.motion = character_data.motion;
		
		//自動描画
		this.addEventListener('enterframe', function(){
			if (this.autoDraw == true) {
				this.draw();
			}
		});
	},

	//イメージリスト再構築
	restructImage: function(){
		var hair_file_name = '_hair';
		var face_file_name = '_face';
		var extension = '.png';
	
		for(var i=0; i<this.imageList[this.motion].imagePaths.length; i++){
			var path = this.imageList[this.motion].imagePaths[i];
			
			if(path.indexOf(hair_file_name) > -1){
				//髪型の場合
				var start_pos = path.indexOf(hair_file_name) + hair_file_name.length;
				var end_pos = path.lastIndexOf('_');
				path = path.substring(0, start_pos) + this.hair + path.substring(end_pos, path.length) + '?' + this.hair_color;
			} else if(path.indexOf(face_file_name) > -1 && path.indexOf('_blink') < 0) {
				//顔の場合
				var start_pos = path.indexOf(face_file_name) + face_file_name.length;
				var end_pos = path.indexOf(extension);
				path = path.substring(0, start_pos) + this.face + path.substring(end_pos, path.length) + '?' + this.skin_color;
			} else if (path.indexOf('_base_')) {
				path = path + '?' + this.skin_color;
			}
			
			var image = Core.instance.cachedImages.getImageFromPath(path);
			//パーツに対応するフィルタ済みのイメージをキャッシュから取得し、参照を設定
			if(image != undefined){
				this.imageList[this.motion].setImageReference(i, image);
			}
		}
	},

	//描画メソッド
	draw: function(){
		this.ctx.save();
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.sprite[this.motion].draw(this.ctx, new Date().getTime());
		this.ctx.restore();
	}
});
