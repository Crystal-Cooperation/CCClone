enchant();

var LobbyScene = enchant.Class.create(Scene, {
	initialize: function(socketio, player_info, selected_no){
		Scene.call(this);

		this.width = 2048;
		this.height = 544;
		this._element = $('<div></div>',{
			'width' : this.width,
			'height' : this.height
		}).get(0);

		var me = this;

		//ロビー画面用処理
		var map_path = ['lobby_estoria.png', 'lobby_gilard.png', 'lobby_rshein.png'];
		var map_bgm = ['estoria', 'gilard', 'rshein'];
		var class_src = ['warrior.png','scout.png','priest.png','sorcerer.png'];
		var nation_src = ['estoria.png','gilard.png','rshein.png'];
		var nation_name = ['イストリア王国','ギラード王国','ル・シェイン王国'];
		var nation_rgb = ['66,109,122','174,114,104','94,127,48'];
		var street_name = [
			['エルヴァージュ市','ウィンスターク市','ラグナス市','シェルム市'],
			['ヴェルドナ市','ソルタナ市','ギガール市','ハーシェル市'],
			['エルフォニア市','ナージェム市','シルマール市','エルガルド市']
		];
		var test_flg = false;
		var player_data = player_info[selected_no];
		var nation = player_data.nation;
		var map_offsetY = 0;
		var lobby_nation_to = 0;
		var lobby_street_to = 0;
		var leaved = false;
		var nation_toggle = false;
		var street_toggle = false;
		


		//ロビー情報(追加)
		if(player_data.lobby_nation === undefined){
			player_data.lobby_nation = player_data.nation;
		}
		if(player_data.lobby_street === undefined){
			player_data.lobby_street = 0;
		}
		if(player_data.lobby_no === undefined){
			player_data.lobby_no = 1;
		}

		//BGM
		var bgm = new Entity();
		bgm._element = $('<audio></audio>', {
			title: map_bgm[player_data.lobby_nation] + ' bgm',
			poster: Core.instance.IMAGE_DIR + 'dummy.png',
			preload: 'auto',
			loop: 'true'
		}).get(0);

		var source1 = new Entity();
		source1._element = $('<source>', {
			src: Core.instance.SOUND_DIR + map_bgm[player_data.lobby_nation] + '.wav',
			type: 'audio/wav'
		}).get(0);
		
		var source2 = new Entity();
		source2._element = $('<source>', {
			src: Core.instance.SOUND_DIR + map_bgm[player_data.lobby_nation] + '.mp3',
			type: 'audio/mp3'
		}).get(0);
		
		var source3 = new Entity();
		source3._element = $('<source>', {
			src: Core.instance.SOUND_DIR + map_bgm[player_data.lobby_nation] + '.ogg',
			type: 'audio/ogg'
		}).get(0);

		//DOMをelementに格納
		$(bgm._element).append($(source1._element));
		$(bgm._element).append($(source2._element));
		$(bgm._element).append($(source3._element));

		//背景の一枚絵を読み込み
		var bg_image = new Entity();
		bg_image.width = this.width;
		bg_image.height = this.height;
		bg_image._element = $('<img>',{
			'width' : bg_image.width,
			'height' : bg_image.height,
			'src' : Core.instance.IMAGE_DIR + map_path[player_data.lobby_nation]
		}).get(0);
		
		//マップオブジェクト（当たり判定）
		var map = new Map(16, 16);
		var map_image = '';
		
		//当たり判定表示用イメージ
		if (test_flg == true) {
			map_image = 'hit_test.png';
		} else {
			map_image = 'dummy.png';
		}
		
		map.image = Core.instance.assets[Core.instance.IMAGE_DIR + map_image];
		map.collisionData = Core.instance.lobby_map[player_data.lobby_nation];
		map.loadData(Core.instance.lobby_map[nation]);

		//スプライト管理用配列
		var sprites = new Array();

		//プレイヤー表示用スプライト(185x185)
		var player_group = new SsaSpriteGroup(player_data, 185, 185);
		var player = player_group.childNodes[0];
		var player_hit = player_group.childNodes[1];
		var player_label = player_group.childNodes[2];

		sprites.push(player_group);
			
		//他プレイヤーの描画処理
		socketio.on('published', function(data){
			var objChild = null;
			var obj = null;
			var flg = false;

			if (data.socket_id == player.socket_id) {
				return;
			}

			var room_no1 = data.lobby_nation * 1000 + data.lobby_street * 100 + data.lobby_no;
			var room_no2 = player_data.lobby_nation * 1000 + player_data.lobby_street * 100 + player_data.lobby_no;

			if(room_no1 != room_no2){
				return;
			}

			//スプライト配列から該当するIDのスプライトを取得
			for (var i=0; i<sprites.length; i++) {
				if (sprites[i].childNodes[0].socket_id == data.socket_id) {
					//プレイヤーが既に存在する場合は、プロパティの値をコピー
					objChild = sprites[i];
					obj = objChild.childNodes[0];
					obj.scaleX = data.scaleX;
					obj.motion = data.motion;
					objChild.x = data.parent_x;
					objChild.y = data.parent_y;
					objChild.z = data.parent_z;
					return;
				}
			}
			
			//画面上に該当プレイヤーが存在しない場合は、スプライトを追加
			if (objChild == null) {
				//プレイヤー表示用スプライト(185x185)
				objChild = new SsaSpriteGroup(data, 185,185);
				obj = objChild.childNodes[0];

				//追加前に位置を調整
				objChild.x = 0;
				objChild.y = -1 * Core.instance.height;
				objChild.z = 0;
				
				//ノードに追加
				main_group.addChild(objChild);
				objChild.x = data.parent_x;
				objChild.y = data.parent_y;
				objChild.z = data.parent_z;

				sprites.push(objChild);

				//自分自身の情報を送信
				socketio.json.emit('publish', player_group.getJsonData());
			}
		});

		//UI
		
		//チャット入力
		var text_styles = {
			'border-radius' : '3px',
			'-webkit-border-radius' : '3px',
			'-moz-border-radius' : '3px',
			'border-style' : 'solid',
			'border-width' : '2px',
			'border-color' : 'rgb(255,255,255)',
			'background-color' : 'transparent',
			'color' : 'rgb(255,255,255)',
			'font-weight' : 'bold'
		}
		
		var chat_textbox = new Entity();
		
		chat_textbox.width = 300;
		chat_textbox.height = 20;
		chat_textbox._element = $('<input>',{
			'type' : 'text',
			'width' : chat_textbox.width + 'px',
			'height' : chat_textbox.height + 'px'
		}).css(text_styles).get(0);

		//チャット送信
		$(chat_textbox._element).on('keydown',function(e){
			var room_no = player_data.lobby_nation * 1000 + player_data.lobby_street * 100 + player_data.lobby_no;
		
			if (e.keyCode == 13) {
				if ($.trim($(this).val()) != '') {
					socketio.json.emit('chat', {room:room_no, value:$(player_label._element).text() + ':' + $(this).val()});
					$(this).val('');
				}
			}
		});
		
		var textarea_styles = {
			'overflow-y' : 'auto',
			'word-wrap' : 'break-all',
			'overflow-wrap' : 'break-all',
			'background-color' : 'transparent',
			'color' : 'rgb(255,255,255)',
			'font-weight' : 'bold'
		}

		var chat_textarea = new Entity();
		
		chat_textarea.width = 300;
		chat_textarea.height = 250;
		chat_textarea._element = $('<div></div>',{
			'width' : chat_textarea.width + 'px',
			'height' : chat_textarea.height + 'px'
		}).css(textarea_styles).css('max-width', chat_textarea.width + 'px').get(0);

		//チャット受信
		socketio.on('chated',function(data){
			$(chat_textarea._element).html(data.value);
			$(chat_textarea._element).scrollTop($(chat_textarea._element)[0].scrollHeight);
		});

		//他プレイヤーの削除処理
		socketio.on('disconnected',function(data){
			//スプライト配列から該当するIDのスプライトを取得
			for (var i=0; i<sprites.length; i++) {
				if (sprites[i].socket_id == data.socket_id) {
					main_group.removeChild(sprites[i]);
					sprites.splice(i, 1);
					break;
				}
			}
		});
		
		//ロビー移動
		socketio.on('leaved',function(data){
			if (leaved == false) {
				//ロビー情報を移動先に変更
				player_info[selected_no].lobby_nation = lobby_nation_to;
				player_info[selected_no].lobby_street = lobby_street_to;
				Core.instance.removeScene(Core.instance.scenes['LobbyScene']);
				delete Core.instance.scenes['LobbyScene'];
				Core.instance.scenes['LobbyScene'] = new LobbyScene(socketio, player_info, selected_no);
				Core.instance.pushScene(Core.instance.scenes['LobbyScene']);
				leaved = true;
			}
		});

		var player_name_styles = {
			'border-radius' : '3px',
			'-webkit-border-radius' : '3px',
			'-moz-border-radius' : '3px',
			'border-style' : 'solid',
			'border-width' : '1px',
			'border-color' : 'rgb(255,255,255)',
			'background-color' : 'rgb(112, 114, 126)',
			'font-size' : '10px',
			'color' : 'rgb(255,255,255)',
			'text-align' : 'center',
			'padding-top' : '2px'
		}

		//プレイヤー名表示欄(名前)
		var player_name = new Entity();
		player_name.width = 160;
		player_name.height = 14;
		player_name._element = $('<div></div>',{
			'width' : player_name.width + 'px',
			'height' : player_name.height + 'px'
		}).css(player_name_styles).text(player_data.name).get(0);

		var star_styles = {
			'font-size' : '11px',
			'color' : 'rgb(245,217,92)',
			'text-align' : 'left'
		}

		//プレイヤー名表示欄(★)
		var star = new Entity();
		star.width = 16;
		star.height = 16;
		star._element = $('<div></div>',{
			'width' : star.width + 'px',
			'height' : star.height + 'px'
		}).css(star_styles).text('★').get(0);
		
		//プレイヤー名表示欄(クラス画像)
		var player_class = new Entity();
		player_class.width = 12;
		player_class.height = 24;
		player_class._element = $('<img>',{
			'width' : player_class.width + 'px',
			'height' : player_class.height + 'px',
			'src' : Core.instance.IMAGE_DIR + class_src[player_data.class]
		}).get(0);
		
		//ロビー情報(国アイコン)
		var nation_image = new Entity();
		nation_image.width = 55;
		nation_image.height = 55;
		nation_image._element = $('<img>',{
			'width' : nation_image.width + 'px',
			'height' : nation_image.height + 'px',
			'src' : Core.instance.IMAGE_DIR + nation_src[player_data.lobby_nation]
		}).get(0);

		$(nation_image._element).on('click',function(){
			if(nation_toggle == false){
				//国移動メニュー表示
				me.addNationMenu();
				nation_toggle = true;
			} else {
				//国移動メニュー非表示
				me.removeNationMenu();
				nation_toggle = false;
			}
		});

		var nations = new Array();

		for(var i=0; i<nation_src.length; i++){
			nations[i] = new Entity();
			nations[i].width = 55;
			nations[i].height = 55;
			nations[i]._element = $('<img>',{
				'id' : 'nation_' + i,
				'width' : nations[i].width + 'px',
				'height' : nations[i].height + 'px',
				'src' : Core.instance.IMAGE_DIR + nation_src[i]
			}).get(0);

			$(nations[i]._element).on('click', function(){
				//現在のロビーから退室
				lobby_nation_to = $(this).attr('id').replace('nation_', '');
				lobby_street_to = 0;
				socketio.json.emit('leave', player_data);
			});
		}

		var nation_image_group = new Group();
		nation_image_group._element = $('<div></div>').get(0);

		//ロビー情報(国名)
		var nation_name_label_styles = {
			'font-size' : '20px',
			'color' : 'rgb(255,255,255)',
			'text-align' : 'left',
			'font-weight' : 'bold'
		}

		var nation_name_label = new Entity();
		nation_name_label.width = 160;
		nation_name_label.height = 20;
		nation_name_label._element = $('<div></div>',{
			'width' : nation_name_label.width + 'px',
			'height' : nation_name_label.height + 'px'
		}).css(nation_name_label_styles).text(nation_name[player_data.lobby_nation]).get(0);

		//ロビー情報(展開用ボタン)
		var street_label_styles = {
			'border-radius' : '3px',
			'-webkit-border-radius' : '3px',
			'-moz-border-radius' : '3px',
			'border-style' : 'solid',
			'border-width' : '1px',
			'border-color' : 'rgb(255,255,255)',
			'background-color' : 'rgb(' + nation_rgb[player_data.lobby_nation] + ')'
		}

		var street_label = new Entity();
		street_label.width = 12;
		street_label.height = 12;;
		street_label._element = $('<div></div>',{
			'width' : street_label.width + 'px',
			'height' : street_label.height + 'px'
		}).css(street_label_styles).get(0);
		
		$(street_label._element).on('click',function(){
			if(street_toggle == false){
				//通り移動メニュー表示
				me.addStreetMenu();
				street_toggle = true;
			} else {
				//通り移動メニュー非表示
				me.removeStreetMenu();
				street_toggle = false;
			}
		});

		//ロビー情報(ロビー名)
		var street_name_label_styles = {
			'font-size' : '12px',
			'font-weight' : 'bold',
			'color' : 'rgb(255,255,255)',
			'text-align' : 'left'
		}

		var street_name_label = new Entity();
		street_name_label.width = 120;
		street_name_label.height = 16;
		street_name_label._element = $('<div></div>',{
			'width' : street_name_label.width + 'px',
			'height' : street_name_label.height + 'px'
		}).css(street_name_label_styles).text(street_name[player_data.lobby_nation][player_data.lobby_street]).get(0);

		//ロビー情報(n番通り)
		var street_no_label_styles = {
			'font-size' : '12px',
			'font-weight' : 'bold',
			'color' : 'rgb(255,255,255)',
			'text-align' : 'left'
		}

		var street_no_label = new Entity();
		street_no_label.width = 100;
		street_no_label.height = 16;
		street_no_label._element = $('<div></div>',{
			'width' : street_no_label.width + 'px',
			'height' : street_no_label.height + 'px'
		}).css(street_no_label_styles).text(player_data.lobby_no + '番通り').get(0);

		//移動先ロビー情報
		var streets = new Array();
		
		var streets_group = new Group();
		streets_group._element = $('<div></div>').get(0);
		
		for(var i=0; i<street_name[player_data.lobby_nation].length; i++){
			streets[i] = new Group();
			streets[i].width = 140;
			streets[i].height = 16;
			streets[i]._element = $('<div></div>').get(0);
			 
			//ロビーの混雑状況
			var styles = {
				'border-radius' : '3px',
				'-webkit-border-radius' : '3px',
				'-moz-border-radius' : '3px',
				'border-style' : 'solid',
				'border-width' : '1px',
				'border-color' : 'rgb(255,255,255)',
				'background-color' : 'rgb(65,233,252)',
				'opacity' : '0.2',
				'font-size' : '12px',
				'font-weight' : 'bold',
				'color' : 'rgb(255,255,255)',
				'text-align' : 'center',
				'padding-top' : '2px'
			}
			
			var lobby_status = new Entity();
			lobby_status.width = 40;
			lobby_status.height = 16;
			lobby_status._element = $('<div></div>',{
				'width' : lobby_status.width + 'px',
				'height' : lobby_status.height + 'px'
			}).css(styles).text('通常').get(0);
			
			//ロビー名
			styles = {
				'font-size' : '12px',
				'font-weight' : 'bold',
				'color' : 'rgb(255,255,255)',
				'text-align' : 'left'
			}
			
			var street_name_list = new Entity();
			street_name_list.width = 100;
			street_name_list.height = 16;
			street_name_list._element = $('<div></div>',{
				'id' : 'street_' + i,
			 	'width' : street_name_list.width + 'px',
			 	'height' : street_name_list.height + 'px'
			}).css(styles).text(street_name[player_data.lobby_nation][i]).get(0);
			
			$(street_name_list._element).on('click', function(){
				//現在のロビーから退室
				lobby_nation_to = player_data.lobby_nation;
				lobby_street_to = $(this).attr('id').replace('street_', '');
				socketio.json.emit('leave', player_data);
			});
			
			streets[i].addChild(lobby_status);
			streets[i].addChild(street_name_list);
			
			//初期表示位置の調整
			lobby_status.x = 0;
			lobby_status.y = 0;
			street_name_list.x = lobby_status.x + lobby_status.width + 5;
			street_name_list.y = lobby_status.y + 3;

			streets[i].x = 0;
			streets[i].y = -1 * Core.instance.height;
		}
		
		//画面表示領域の設定
		var main_group = new Group();
		main_group._element = $('<div></div>').get(0);
		main_group.width = bg_image.width;
		main_group.height = bg_image.height;
		main_group.addChild(bg_image);
		main_group.addChild(map);
		main_group.addChild(player_group);
		
		this.addChild(bgm);
		this.addChild(main_group);
		this.addChild(chat_textbox);
		this.addChild(chat_textarea);
		this.addChild(player_name);
		this.addChild(player_class);
		this.addChild(star);
		this.addChild(nation_image);
		this.addChild(nation_name_label);
		this.addChild(street_label);
		this.addChild(street_name_label);
		this.addChild(street_no_label);
		this.addChild(streets_group);
		this.addChild(nation_image_group);
		
		//初期表示位置の調整
		player_group.x = 998;
		player_group.y = 256;
		player_group.z = player_group.y + player_group.width;
		main_group.x = -1 * player_group.x;
		main_group.y = Core.instance.height - main_group.height;

		chat_textbox.x = 5;
		chat_textbox.y = Core.instance.height - chat_textbox.height - 10;
		chat_textarea.x = 5;
		chat_textarea.y = chat_textbox.y - chat_textarea.height - 10;

		player_name.x = 5;
		player_name.y = main_group.y + 5;
		player_class.x = player_name.x + 2;
		player_class.y = player_name.y + player_name.height / 2 - player_class.height / 2;
		star.x = 5 + player_class.x + player_class.width;
		star.y = 3 + player_name.y + player_name.height / 2 - star.height / 2;

		nation_image.x = 5;
		nation_image.y = player_name.y + player_name.height + 5;
		nation_name_label.x = nation_image.x + nation_image.width + 5;
		nation_name_label.y = nation_image.y + 10;

		street_label.x = nation_image.x + nation_image.width + 5;
		street_label.y = nation_name_label.y + nation_name_label.height + 5;
		street_name_label.x = 8 + street_label.x + street_label.width;
		street_name_label.y = street_label.y;
		street_no_label.x = street_name_label.x + street_name_label.width;
		street_no_label.y = street_name_label.y;

		nation_image_group.x = 0;
		nation_image_group.y = 0;

		streets_group.x = 0;
		streets_group.y = 0;

		var prev_motion = player.motion;

		//国移動メニュー表示
		this.addNationMenu = function(){
			var add_count = 0;
			for(var i=0; i<nations.length; i++){
				if(i != player_data.lobby_nation){
					nation_image_group.addChild(nations[i]);
					//初期表示位置の調整
					nations[i].moveTo(nation_image.x, nation_image.y + nation_image.height + 5 + (nations[i].height + 5) * add_count);
					add_count++;
				}
			}
		},

		//国移動メニュー非表示
		this.removeNationMenu = function(){
			var length = nation_image_group.childNodes.length;
			for(var i=0; i<length; i++){
				nation_image_group.childNodes[0].x = 0;
				nation_image_group.childNodes[0].y = -1 * Core.instance.height;
				nation_image_group.removeChild(nation_image_group.childNodes[0]);
			}
		},

		//通り移動メニュー表示
		this.addStreetMenu = function(){
			var add_count = 0;
			for(var i=0; i<streets.length; i++){
				if(i != player_data.lobby_street){
					streets_group.addChild(streets[i]);
					//初期表示位置の調整
					streets[i].moveTo(street_label.x, street_label.y + street_label.height + 10 + (streets[i].height + 5) * add_count);
					add_count++;
				}
			}
		},

		//通り移動メニュー非表示
		this.removeStreetMenu = function(){
			var length = streets_group.childNodes.length;
			for(var i=0; i<length; i++){
				streets_group.childNodes[0].x = 0;
				streets_group.childNodes[0].y = -1 * Core.instance.height;
				streets_group.removeChild(streets_group.childNodes[0]);
			}
		},

		//重なり順の再描画
		this.repaintZindex = function(){
			var prevArray = new Array();
			var isChanged = false;
			
			//変更前のIDを配列にコピー
			for (var i=0; i<sprites.length; i++) {
				prevArray[i] = {socket_id:sprites[i].socket_id};
			}
			
			//スプライト管理グループをz座標の昇順でソート
			Core.instance.sortArray(sprites, 'z', true);
			
			//変更前のID配列と並び順を比較
			for (var i=0; i<sprites.length; i++) {
				if (sprites[i].socket_id != prevArray[i].socket_id) {
					isChanged = true;
					break;
				}
			}
			
			//並び順が変更されていれば、z座標の昇順で再描画
			if (isChanged == true) {
				me.repaintSprite();
			}
		},

		this.repaintSprite = function(){
			var length = sprites.length;
			var index = 0;
			for (i=0; i<length; i++) {
				var obj = sprites[i];
				for (j=0; j<obj.childNodes.length; j++) {
					$(obj.childNodes[j]._element).css('z-index', index);
				}
				index++;
			}
			//スクロールバーを一番上に変更
			$(chat_textarea._element).css('z-index', index);
		}

		this.addEventListener('enterframe', function(){
			var ax = 0;
			var ay = 0;
			var move_x = 0;
			var move_y = 0;
			
			if (Core.instance.input.right) ax += Core.instance.speedX;
			if (Core.instance.input.left) ax -= Core.instance.speedX;
			if (Core.instance.input.up) ay -= Core.instance.speedY;
			if (Core.instance.input.down) ay += Core.instance.speedY;
			
			//移動方向に応じて画像を反転
			if (ax > 0) player.scaleX = -1;
			if (ax < 0) player.scaleX = 1;
			
			//モーション切り替え
			if (ax != 0 || ay != 0) {
				player.motion = 'walk';
			} else {
				player.motion = 'wait';
			}
			
			//当たり判定
			base_x1 = Math.floor((player_group.x + player_hit.x)/16)*16;												//移動前：x1(原点)
			base_y1 = Math.floor((player_group.y + player_hit.y + (map_offsetY * -1))/16)*16;							//移動前：y1(原点)
			base_x2 = Math.floor((player_group.x + player_hit.x + player_hit.width)/16)*16;								//移動前：x2(矩形右端)
			base_y2 = Math.floor((player_group.y + player_hit.y + player_hit.height + (map_offsetY * -1))/16)*16;		//移動前：y2(矩形右端)
			move_x1 = Math.floor((player_group.x + player_hit.x + ax)/16)*16;											//移動後：x1(原点)
			move_y1 = Math.floor((player_group.y + player_hit.y + ay + (map_offsetY * -1))/16)*16;						//移動後：y1(原点)
			move_x2 = Math.floor((player_group.x + player_hit.x + player_hit.width + ax)/16)*16;						//移動後：x2(矩形右端)
			move_y2 = Math.floor((player_group.y + player_hit.y + player_hit.height + ay + (map_offsetY * -1))/16)*16;	//移動後：y2(矩形右端)
			
			if (ax > 0 && base_x2 != move_x2) {
				//右移動
				if (map.hitTest(move_x2, move_y1) == true || map.hitTest(move_x2, move_y2) == true || move_x2 >= this.width) {
					ax = 0;
				}
			} else if (ax < 0 && base_x1 != move_x1) {
				//左移動
				if (map.hitTest(move_x1, move_y1) == true || map.hitTest(move_x1, move_y2) == true || move_x1 <= player_hit.x * - 1) {
					ax = 0;
				}
			}
			if (ay < 0 && base_y1 != move_y1) {
				//上移動
				if (map.hitTest(move_x1, move_y1) == true || map.hitTest(move_x2, move_y1) == true) {
					ay = 0;
				}
			} else if (ay > 0 && base_y2 != move_y2) {
				//下移動
				if (map.hitTest(move_x1, move_y2) == true || map.hitTest(move_x2, move_y2) == true || move_y2 >= this.height) {
					ay = 0;
				}
			}
			//移動分を加算
			player_group.x += ax;
			player_group.y += ay;
			player_group.z = player_group.y + player_group.width;  //重なり順判定用Y座標
			
			//移動情報をサーバーに送信
			if (ax != 0 || ay != 0 || player.motion != prev_motion) {
				socketio.json.emit('publish', player_group.getJsonData());
				prev_motion = player.motion;
			}

			//スクロール処理
			var scroll_x = (Core.instance.width / 2) - (player_group.width / 2);
			var move_x = scroll_x - player_group.x;
			var move_max = (main_group.width - Core.instance.width) * -1;

			if(move_x >= move_max && main_group.x > move_x) {
				//右スクロール
				main_group.x = move_x;
			} else if (move_x < 0 && main_group.x < move_x) {
				//左スクロール
				main_group.x = move_x;
			}

			//重なり順の描画
			this.repaintZindex();
			
		});

		//シーン移動時の初回処理
		this.addEventListener('enter', function(){
			//ルームに参加
			socketio.json.emit('join', player_group.getJsonData());
			$(bgm._element).trigger('play');
		});

		this.addEventListener('exit', function(){
			$(bgm._element).trigger('stop');
		});
	}
});
