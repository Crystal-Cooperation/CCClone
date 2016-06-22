enchant();

var SsCachedImageList = enchant.Class.create(SsImageList, {
	initialize: function(image_cache, imageFiles, aFileRoot, loadImmediately, aOnLoad){
		this.fileRoot = aFileRoot;
		this.imagePaths = new Array();
		this.images = new Array();
		this.imageFiles = imageFiles;

		// ロード完了時に呼ばれるコールバック
		// Callback that is called when the load is finished.
		this.onLoad = aOnLoad;

		// 全部読み込まれた場合のみユーザーが設定したコールバックを呼ぶ
		// Only when it is all loaded, is called a callback set by the user.
/*
		this.onLoad_ = function(this_func){
			for (var i in this_func.images) {
				if (i != null && i.complete == false) {
					return;
				}
			}
			if (this_func.onLoad != undefined && this_func.images.length == this_func.imageFiles.length){
//		this_func.onLoad();
			}
		}
*/

		//画像の読み込み。
		for (var i = 0; i < imageFiles.length; i++) {
			var path = this.fileRoot + imageFiles[i];
			var index = -1;

			if(image_cache != null){
				index = image_cache.imagePaths.indexOf(path)
			}

			this.imagePaths.push(path);

			if(index >= 0){
				//image_cacheに存在する場合、画像への参照を取得する。
				this.images.push(image_cache.images[index]);
//				this.onLoad_();
			} else {
				//image_cacheに存在しない場合は、読み込み後に参照を追加。
				if (loadImmediately){
					var image = new Image();
					this.images.push(image);
//					image.onload = this.onLoad_(this);
					image.src = path;
				}

				//image_cacheにも追加
				if(image_cache != null){
					image_cache.images.push(image);
					image_cache.imagePaths.push(path);
				}
			}
		}
	},

	//画像ロード確認
	checkLoadImages: function(){
		var retry = false;
		
		for (var i in this.images) {
			if (this.images[i] != null && this.images[i].complete == false) {
				retry = true;
				break;
			}
		}
		if (this.onLoad != undefined && this.images.length == this.imageFiles.length && retry == false){
			this.onLoad();
		} else {
			var this_obj = this;
			setTimeout(function(){
				this_obj.checkLoadImages();
			}, 300);
		}
	},

	// 画像イメージをリストに追加
	addImage: function (image, path) {
		image.onload= this.onLoad_;
		this.images.push(image);
		this.imagePaths.push(path);
	},
	
	// 指定したインデックスの画像イメージを差し替える。(※パスは差し替えない)
	setImageReference: function (index, image) {
		if (index < 0 || index >= this.images.length) return null;
		this.images[index] = image;
		this.images[index].onload = this.onLoad_;
	},
	
	// 指定したパスに一致する画像イメージを取得する。
	getImageFromPath: function (path) {
		for(key in this.imagePaths){
			if(this.imagePaths[key] === path){
				return this.images[key];
			}
		}
	}

});
