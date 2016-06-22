var SsaAnimater = enchant.Class.create({
    initialize: function(assets, image_dir){
        this.assets = assets;
        this.motion_data = {};
    }
    
    //モーション追加
    addMotion: function(ssa_json){
    	if(!ssa_json[0].name in this.motion_data){
    		//モーション配列に存在しなければ追加
    		
    		
    		
	    	this.motion_data[ssa_json[].name] = 
	    }
    }
});