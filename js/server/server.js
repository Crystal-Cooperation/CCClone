//例外処理
process.on('uncaughtException', function(err) {
	console.log(err);
});

var fs = require('fs');
var mongoose = require('./node_modules/mongoose');

var port  = 13531;
var err_id  = '__system_error_occured__';
var new_id  = '__character_not_found__';

//スキーマの定義
var UserMasterSchema = require('./mongoose_schema/UserMasterSchema.js');
var CharacterInfoSchema = require('./mongoose_schema/CharacterInfoSchema.js');
var MakingNameSchema = require('./mongoose_schema/MakingNameSchema.js');

// コレクションへの参照を取得
var UserMaster = mongoose.model('user_master', UserMasterSchema(mongoose));
var CharacterInfo = mongoose.model('character_info', CharacterInfoSchema(mongoose));
var MakingName = mongoose.model('making_name', MakingNameSchema(mongoose));

// DB接続処理
mongoose.connect('mongodb://localhost:' + port + '/cc', function(err){
	if (err) {
		console.log(err);
	} else {
		console.log('connection succeed.');
	}
});

//キャラクター情報取得用関数
function GetCharacterInfo(socket, result, data, eventname){
	//キャラクター情報を取得して送信
	CharacterInfo.find({id:data.id}).sort({seq: 'asc'}).exec(function(err, docs){
		var results = new Array(2);
		var records = new Array(6);
		
//		console.log(data);
		
		if (err) {
			docs = {id:err_id, name:err};
		} else {
			//キャラクター情報を新規作成
			for (var i=0; i<records.length; i++) {
				records[i] = null;
				
				//取得済のデータを調査
				for (var j=0; j<docs.length; j++) {
					if (docs[j].seq == i) {
						records[i] = docs[j];
						records[i].socket_id = socket.id;
						break;
					}
				}
				
				//データが取得出来なかった場合はインスタンスを作成
				if (records[i] == null) {
					records[i] = new CharacterInfo();
					records[i].socket_id = socket.id;
					records[i].id = data.id;
					records[i].seq = i;
				}
//				console.log(records[i]);
			}
		}
		results[0] = result;
		results[1] = records;

		//登録結果を送信
		socket.emit(eventname, results);
	});
}

var server = require('http').createServer(function(req, res) {
		 var content = '';
		 var encode	= 'utf-8';
		 var file		= '';

		 file = '../..' + req.url;

		 if (file.indexOf('.htm') > 0) {
			 content = 'text/html';
		 } else if (file.indexOf('.js') > 0) {
			 content = 'text/javascript';
		 } else if (file.indexOf('.css') > 0) {
			 content = 'text/css';
		 } else if (file.indexOf('.png') > 0) {
			 content = 'image/png';
			 encode = 'binary';
		 } else if (file.indexOf('.gif') > 0) {
			 content = 'image/gif';
			 encode = 'binary';
		 } else if (file.indexOf('.ico') > 0) {
			 content = 'image/x-icon';
			 encode = 'binary';
		 } else if (file.indexOf('.mp4') > 0) {
			 content = 'video/mp4';
			 encode = 'binary';
		 } else if (file.indexOf('.wav') > 0) {
			 content = 'audio/wav';
			 encode = 'binary';
		 } else if (file.indexOf('.ogg') > 0) {
			 content = 'audio/ogg';
			 encode = 'binary';
		 } else if (file.indexOf('.mp3') > 0) {
			 content = 'audio/mp3';
			 encode = 'binary';
		 }

		 if (content != '') {
//		 console.log(file + ' ' + content);
			 res.writeHead(200, {'Content-Type':content});
			 var output = fs.readFileSync(file, encode);
//		 console.log('read ok.');
			 res.write(output, encode);
		 }
		 
		 res.end();
			 
}).listen(8080);

// サーバー起動
var io = require('socket.io').listen(server);

// ユーザ管理ハッシュ
var userHash = {};
var initX = 350;
var initY = 220;
var initZ = 220 + 48;
var initScaleX = -1;
var initMotionId = 'wait';
var chat_log = new Array();
var log_count = 0;
var log_max = 50;

// イベントの定義
var lobby = io.sockets.on('connection', function (socket) {

	// ロビー参加
	socket.on('join', function (data) {
		var room_no = data.lobby_nation * 1000 + data.lobby_street * 100 + data.lobby_no;
		userHash[socket.id] = data;
		data.id = '';
		
		console.log('join room_no=' + room_no);
		socket.join(room_no);
		
		socket.broadcast.to(room_no).emit('published', data)
	});

	// ロビー退室
	socket.on('leave', function (data) {
		var room_no = data.lobby_nation * 1000 + data.lobby_street * 100 + data.lobby_no;
		var deleted_id = socket.id;
		console.log('leave socket.id=' + socket.id);
		if (userHash[socket.id]) {
			delete userHash[socket.id];
			socket.leave(room_no);
			console.log('leave from ' + room_no);
			io.sockets.connected[deleted_id].emit('leaved', {socket_id: deleted_id});
			console.log('disconnect broadcast');
			io.sockets.in(room_no).emit('disconnected', {socket_id: deleted_id});
		}
	});

	// メッセージ送信カスタムイベント
	socket.on('publish', function (data) {
		var room_no = data.lobby_nation * 1000 + data.lobby_street * 100 + data.lobby_no;

		// ハッシュを更新
		console.log('room_no=' + room_no);
		console.log('publish socket_id=' + data.socket_id);
		userHash[socket.id] = data;
	
		// 他のプレイヤーに描画を通知(※IDは消しておく)
		data.id = '';
		socket.broadcast.to(room_no).emit('published', data);
	});

	// 接続終了組み込みイベント(接続元ユーザを削除し、他ユーザへ通知)
	socket.on('disconnect', function () {
		var deleted_id = socket.id;
		console.log('disconnect socket.id=' + socket.id);
		if (userHash[socket.id]) {
			console.log('disconnect broadcast');
			delete userHash[socket.id];
			socket.broadcast.emit('disconnected', {socket_id: deleted_id});
		}
	});
	
	// チャットイベント
	socket.on('chat', function (data) {
		var chat_string = '';
		console.log('chat room=' + data.room);

		if (chat_log[data.room] === undefined) {
			chat_log[data.room] = new Array();
		}

		// 最大保存行数を越した場合、先頭のログを削除
		if (chat_log[data.room].length >= log_max) {
			chat_log[data.room].splice(0,1);
		}
		
		chat_log[data.room][chat_log[data.room].length] = data.value + '<br>';
		
		for (var i=0; i<chat_log[data.room].length; i++) {
			chat_string += chat_log[data.room][i];
		}
		io.sockets.in(data.room).emit('chated', {value:chat_string});
	});
	
	// ユーザー認証
	socket.on('login_authentification', function (data) {
		// ユーザー情報を取得
		UserMaster.find({id:data.id, pass:data.pass}).exec(function (err, doc) {
//			console.log('id = ' + data.id + ', pass = ' + data.pass);
//			console.log('doc = [' + doc + ']');
			var results = new Array(2);

			if (err) {
				// エラー発生時は返却値にエラー内容を設定
				console.log(err);
				results[0] = {value:err};
				results[1] = null;
				socket.emit('login_authentification', results);
			} else if (doc == '') {
				// ドキュメントが取得できなかった場合はエラーを返却
				results[0] = {value:'nodata'};
				results[1] = null;
				socket.emit('login_authentification', results);
			} else {
				// データ取得(正常)
				GetCharacterInfo(socket, {value:''}, doc[0], 'login_authentification');
			}
		});
	});

	//ユーザー登録
	socket.on('login_registration', function (data) {
		// ユーザーIDが一致するデータを返却
		UserMaster.find({id:data.id}, function(err, doc){
			var results = new Array(2);
			var user = new UserMaster();
//			console.log('doc = ' + doc);
			if (err) {
				//エラー発生時は返却値にエラー内容を追記
				console.log(err);
				results[0] = {value:err};
				results[1] = null;
				socket.emit('login_registration', results);
			} else if (doc != '') {
				//ユーザーID重複
//				console.log('exsts');
				results[0] = {value:'このIDは既に使用されています。'};
				results[1] = null;
				socket.emit('login_registration', results);
			} else {
//				console.log('save');
				
				//登録処理
				user.id = data.id;
				user.pass = data.pass;

				//ドキュメントを保存
				user.save(function (err) {
					if (err) {
						console.log(err);
						results[0] = {value:err};
						results[1] = null;
						//登録結果を送信
						socket.emit('login_registration', results);
					} else {
						//保存成功
						GetCharacterInfo(socket, {value:''}, user, 'login_registration');
					}
				});
			}
		});
	});
	

	//キャラクター作成
 	socket.on('character_create', function (data) {
 		var result = {value:''};
		var character = new CharacterInfo();
		
		//プロパティの値を全てコピー
		for(props in data){
			console.log('propery = ' + props + ', value=' + data[props]);
			if (props in character){
				character[props] = data[props];
			}
		}
//		console.log('next step.');
	
		//データを保存
		character.save(function(err){
			if(err){
				result.value = 'データの保存に失敗しました。'
			}
			//作成中の名前を削除
			MakingName.remove({'id':data.id}).exec(function(err){
				if(err){
					result.value = '一時データの削除に失敗しました。';
				}
				socket.emit('character_created', result);
			});
		});
	});
	
	//キャラクター削除
 	socket.on('character_delete', function (data) {
		CharacterInfo.remove({'id':data.id, 'seq':data.seq}).exec(function(err){
//			console.log('remove.');
//			console.log(data);
			var results = new Array(2);
			results[0] = {value:''};
			results[1] = null;
			
			if (err) {
				results[0] = {value:err};
			} else {
				//削除後、初期データを返却
				results[1] = new CharacterInfo();
				results[1].id = data.id;
				results[1].seq = data.seq;
			}

			//登録結果を送信
			socket.emit('character_deleted', results);
		});
	});
	
	//名前の重複チェック
	socket.on('name_duplicate_check', function(data) {
		//キャラクター情報の名前を検索
		CharacterInfo.find({name:data.name}, function(err, doc){
			if (err) {
				//エラー発生時は返却値にエラー内容を追記
				console.log(err);
				socket.emit('name_duplicate_checked', {value:err});
			} else if (doc != '') {
				//ユーザー名重複
//				console.log('exsts');
				socket.emit('name_duplicate_checked', {value:'この名前は既に使用されています。'});
			} else {
				//作成中の名前を検索（※自分のIDを除く
				MakingName.find({'name':data.name, 'id':{$ne:data.id}}, function(err, doc){
				var result = null;
				console.log('doc=' + doc);
			
				if (err) {
					//エラー発生時は返却値にエラー内容を追記
					console.log(err);
					socket.emit('name_duplicate_checked', {value:err});
				} else if (doc != '') {
					//ユーザー名重複
//					console.log('exsts');
					socket.emit('name_duplicate_checked', {value:'この名前は既に使用されています。'});
				} else {
					//重複なし
					socket.emit('name_duplicate_checked', {value:''});
				}
				});
			}
		});
	});
	
	//作成中の名前を保存
	socket.on('name_save', function(data) {
		var save_name = new MakingName();
		var result = {value:''};
		
		save_name.id = data.id;
		save_name.name = data.name;
		save_name.save(function(err){
			if(err){
				result.value = err;
			}
			socket.emit('name_saved', result);
		});
		console.log('name_save emit');
	});
	
	//作成中の名前を削除
	socket.on('name_remove', function(data) {
		MakingName.remove({'id':data.id}).exec(function(err){
			console.log('remove id = ' + data.id);
			var result = {value:''};
			if (err) {
				result = {value:err};
			}
			//登録結果を送信
			socket.emit('name_removed', result);
		});
	});
});
