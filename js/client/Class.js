enchant();

var Class = enchant.Class.create({
    initialize: function (name, imagePath, description, baseColor) {
		this.name        = name;
		this.imagePath   = imagePath;
		this.description = description;
		this.baseColor   = baseColor;
	}
});
