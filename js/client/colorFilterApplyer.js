enchant();

var ColorFilterApplyer = enchant.Class.create(Entity, {
    initialize: function(width, height){
		Entity.call(this);

		this.width = width;
		this.height = height;
		
		this._element = $('<canvas></canvas>').get(0);
		this._element.width = width;
		this._element.height = height;
		this.ctx = $(this._element)[0].getContext('2d');
		
	},
    //filter実行
	apply: function(image, filter, type){
		var new_image = $('<img>',{
			'width' : image.width,
			'height' : image.height
		});
		this._element.width = image.width;
		this._element.height = image.height;
		this.ctx.save();
		this.ctx.clearRect(0, 0, image.width, image.height);
		this.ctx.drawImage(image, 0, 0);
		new_image = this.ctx.getImageData(0, 0, image.width, image.height);
		for (var i = 0; i < image.width * image.height * 4; i += 4) {
			var myRed = new_image.data[i];
			var myGreen = new_image.data[i + 1];
			var myBlue = new_image.data[i + 2];
			new_image.data[i] = filter.addR(myRed);
			new_image.data[i + 1] = filter.addG(myGreen);
			new_image.data[i + 2] = filter.addB(myBlue);
		}
		this.ctx.putImageData(new_image, 0, 0);
		this.ctx.restore();

		//画像種類が未指定の場合はpng
		if(type == null){
			type = 'image/png';
		}

		//更新後の画像を返却
		return this._element.toDataURL(type);
	}
});