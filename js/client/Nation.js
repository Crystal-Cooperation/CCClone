enchant();

var Nation = enchant.Class.create({
    initialize: function (name, description, baseColor, imagePath) {
		this.name        = name;
		this.description = description;
		this.baseColor   = baseColor;
		this.imagePath   = imagePath;
	}
});
