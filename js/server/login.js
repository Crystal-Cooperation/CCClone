var mongoose = require("./node_modules/mongoose");
var port     = 13531;
var Schema   = mongoose.Schema;

process.on("uncaughtException", function (err) {
    console.log(err);
});

// スキーマの定義

// ユーザーマスタ
var UserMasterSchema = new Schema({
  id:   String,
  pass: String
});

// スキーマ定義を登録
mongoose.model("user_master", UserMasterSchema);

// DB接続処理
mongoose.connect("mongodb://localhost:" + port + "/cc", function(err){
  if (err) {
    console.log(err);
  } else {
    console.log("connection succeed.");
  }
});

// サーバー作成
var server = require("http").createServer(function (req, res) {}).listen(port);
var io     = require("socket.io").listen(server);

/*
// ユーザー情報取得
function getUserMaster(data) {
  var UserMaster = mongoose.model("user_master");
  
  // ユーザーID、パスワードが一致するデータを返却
  UserMaster.find({id:data.id, pass:data.password}, function(err, doc){
    if (err) {
      // エラー発生時は返却値にエラー内容を追記
      console.log(err);
      doc.err = err;
    } else if (doc.length == 0) {
      doc.err = "ユーザーIDまたはパスワードが異なります。";
    }
    return doc;
  });
}

// ユーザーIDチェック
function checkUserId(data) {
  var UserMaster = mongoose.model('UserMaster');
  
  // ユーザーIDが一致するデータを返却
  UserMaster.find({id:data.id}, function(err, doc){
    if (err) {
      // エラー発生時は返却値にエラー内容を追記
      console.log(err);
      doc.err = err;
    } else if (doc.length > 0) {
      doc.err = "入力されたユーザーIDは既に使用済みです。";
    }
    return doc;
  });
}

// イベントの定義
io.sockets.on("connection", function (socket) {

  // 接続開始
  socket.on("connected", function () {
    console.log("connected");
  });

  // ユーザー認証
  socket.on("authentification", function (id, pass) {
    // ユーザー情報を取得
    var user = getUserMaster(id, pass);
    var result = null;

    if (user.err) {
      // エラーあり
      result = ({err:true, value:user.err});
    } else {
      // エラーなし
      result = ({err:false, value:""});
    }

    // 認証結果を送信
    socket.emit("authentification", result);
  });

  // ユーザー登録
  socket.on("Registration", function (id, pass) {
    var user = checkUserId(id);
    var result = null;
    
    if (user.err) {
      // エラーあり
      result = ({err:true, value:user.err});
      socket.emit("Registration", result);
      return;
    }
 
    // 引数の内容でユーザー情報を登録
    var UserMaster = mongoose.model('UserMaster');
    var user       = new UserMaster();
    
    user.id   = id;
    user.pass = pass;
    user.save(function (err) {
      if (err) {
        // エラーあり
        console.log(err);
        result = ({err:false, value:user.err});
      } else {
        result = ({err:true, value:""});
      }
      socket.emit("Registration", result);
    });    
  });

  // 接続終了組み込みイベント(接続元ユーザを削除し、他ユーザへ通知)
  socket.on("disconnect", function () {
    console.log("disconnect");
  });
});
*/
