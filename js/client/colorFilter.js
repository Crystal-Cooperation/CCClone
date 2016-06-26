enchant();

var ColorFilter = enchant.Class.create({
    initialize: function(red, green, blue){

		this.R = red;
		this.G = green;
		this.B = blue;
	},
    //色を加算
	addColor: function(color, color_id){
		var this_color = 0;
		var ret = 0;
	
		switch(color_id){
			case 'R' : this_color = this.R; break;
			case 'G' : this_color = this.G; break;
			case 'B' : this_color = this.B; break;
		}
	
		ret = color + this_color;
	
		if(ret < 0){
			ret = 0;
		} else if(ret > 255){
			ret = 255;
		}
		
		return ret;
	},
	//色指定で加算
	addR: function(color){
		return this.addColor(color, 'R');
	},
	addG: function(color){
		return this.addColor(color, 'G');
	},
	addB: function(color){
		return this.addColor(color, 'B');
	}
});