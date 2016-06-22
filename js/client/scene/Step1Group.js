enchant();

var Step1Group = enchant.Class.create(Group, {
	initialize: function(width, height, character_data){
		Group.call(this);
		
		//STEP1・所属国選択
		character_data.nation = 0;
		
		this._element = $('<div></div>').css('color','rgb(255,255,255)').get(0)
		this.width = width;
		this.height = height;
		this.checked = false;
		this.checking = false;
		
		var map_src = [Core.instance.IMAGE_DIR + 'create1_estoria.png', Core.instance.IMAGE_DIR + 'create1_gilard.png', Core.instance.IMAGE_DIR + 'create1_rshein.png'];
		var emblem_src = [Core.instance.IMAGE_DIR + 'estoria.png', Core.instance.IMAGE_DIR + 'gilard.png', Core.instance.IMAGE_DIR + 'rshein.png'];
		var nation_text = ['イストリア王国','ギラード王国','ル・シェイン王国'];
		var explain_text = ['工業を主要産業とし、<br>首都ウィンスタークの中心に城があり、<br>それを取り囲むようにして大小様々な工場が立ち並ぶ。<br>市外は、この工場群の周囲に同心円状に広がり、<br>それがそのまま城下町となっている。<br><br>国王ライアスは覇王への野望に燃え、<br>戦による領土の拡大を続けている。',
							'クリスタルの含有量の多い山塊のふもとを崩して<br>大地から切り離し、<br>浮遊する巨大な岩盤を鎖で大地と結ぶことで自国の<br>領地とした、世界でも稀な存在である。<br>採掘職人たちの国として知られ、<br>クリスタル以外の鉱石の、魔法を用いた採掘と<br>加工などが主要産業となっている。<br>また、他国で有罪判決を受けた者――罪人を有償で<br>受け入れ、それを労働力として使役していることでも<br>知られている。<br><br>国王ンドゥヴはクリスタルに執着し、<br>その瞳は常に妖しい光を帯びる。',
							'国土の実に7割を森林が占め、<br>人々は樹上に住居を築き、そこで暮らしている。<br>一際大きな無数の樹木に支えられた王城は圧巻の<br>一言で、その勇壮にして荘厳な威容を一目見ようと、<br>大陸中から観光客が訪れている。<br><br>隣国のギラードとイストリアがル・シェインを<br>狙うのは、その国土に未だに豊富なクリスタルの<br>原石が眠っているからである。<br><br>国王代理ル・シアは平和を願いつつも、<br>自国の危機に健気に立ち向かっている。'];
		
		//国選択判定用座標
		var locale = [
			[[455,129],[428,162],[446,190],[464,242],[458,263],[431,292],[425,325],[363,345],[332,377],[305,403],[307,405],[281,405],[248,415]],
			[[476,130],[460,151],[450,158],[449,153],[465,178],[467,194],[476,215],[485,237],[487,252],[480,259],[477,270],[459,281],[447,297],[446,301],[443,310],[442,326],[478,338],[513,340],[534,348],[557,340],[567,364],[573,376],[575,400],[589,413],[588,438],[609,453],[651,410]],
			[[432,341],[400,349],[374,358],[372,358],[356,377],[341,392],[323,408],[288,421],[274,434],[278,455],[313,493],[459,345],[483,355],[509,353],[534,359],[553,353],[563,381],[562,402],[577,418],[576,432],[587,454],[606,465],[625,470]]
		]

		var selected = false;
		
		//所属国選択イメージ
		var select_map = new Entity();
		select_map.width = 590;
		select_map.height = this.height;
		select_map._element = $('<img>', {
			'width' : select_map.width + 'px',
			'height' : select_map.height + 'px',
			'src' : map_src[character_data.nation]
		}).get(0);

		$(select_map._element).on('click',function(e){
			if (selected == true){
				selected = false;
			} else {
				selected = true;
			}
		});

		$(select_map._element).on('mousemove',function(e){
			var min_distance = 99999;
			var selected_no = 0;
		
			if (selected == true){
				return;
			}

			for(var i=0; i<=locale.length-1; i++){
				for(var j=0; j<=locale[i].length-1; j++){
					var distance = 0;

					distance = Math.sqrt(Math.pow(e.pageX - locale[i][j][0],2) + Math.pow(e.pageY - locale[i][j][1],2));
					
					if (min_distance > distance) {
						selected_no = i;
						min_distance = distance;
					}
				}
			}
			
			if (character_data.nation != selected_no) {
				$(select_map._element).attr('src',map_src[selected_no]);
				$(emblem._element).attr('src',emblem_src[selected_no]);
				$(nation._element).html(nation_text[selected_no]);
				$(explain._element).html(explain_text[selected_no]);
				character_data.nation = selected_no;
			}
		});

		//所属国イメージ
		var emblem = new Entity();
		emblem.width = 64;
		emblem.height = 64;
		emblem._element = $('<img>', {
			'width' : select_map.width + 'px',
			'height' : select_map.height + 'px',
			'src' : emblem_src[character_data.nation]
		}).get(0);

		//所属国名
		var nation = new Entity();
		nation.width = Core.instance.width - select_map.width;
		nation.height = 50;
		nation._element = $('<div></div>', {
			'width' : nation.width + 'px',
			'height' : nation.height + 'px'
		}).css('font-size','40px').css('color','rgb(255,255,255)').text(nation_text[character_data.nation]).get(0);

		//所属国説明のスタイル設定
		var explain_styles = {
			'font-weight' : 'bold',
			'font-size' : '14px',
			'padding' : '8px',
			'color' : 'rgb(255,255,255)',
			'line-height' : '1.5em'
		}

		//所属国説明
		var explain = new Entity();
		explain.width = Core.instance.width - select_map.width;
		explain.height = select_map.height - 120;
		explain._element = $('<div></div>', {
			'width' : explain.width + 'px',
			'height' : explain.height + 'px'
		}).css(explain_styles).html(explain_text[character_data.nation]).get(0);
		
		//グループに子要素を追加
		this.addChild(select_map);
		this.addChild(explain);
		this.addChild(emblem);
		this.addChild(nation);

		//表示部品の位置調整
		explain.x = select_map.width;
		explain.y = 120;
		emblem.x = select_map.width;
		emblem.y = 56;
		nation.x = emblem.x + emblem.width;
		nation.y = 68;

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