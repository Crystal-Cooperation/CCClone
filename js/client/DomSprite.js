enchant();

var DomSprite = enchant.Class.create(Sprite, {
    initialize: function (width, height, tag) {
		Sprite.call(this, width, height);

		var $dom = $(tag).width(width).height(height);

		if (arguments.length == 4) {
			//第4引数指定時はCSSとして処理
			$dom.css(arguments[3]);
		}

		//_elementに設定
		this._element = $dom.get(0);
	}
});
