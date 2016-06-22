// 1.モジュールオブジェクトの初期化
var fs = require("fs");
process.on('uncaughtException', function(err) {
    console.log(err);
});
var server = require("http").createServer(function(req, res) {
     var content = "";
     var encode  = "utf-8";
     var file    = "";

     file = "../.." + req.url;

     if (file.indexOf(".htm") > 0) {
       content = "text/html";
     } else if (file.indexOf(".js") > 0) {
       content = "text/javascript";
     } else if (file.indexOf(".css") > 0) {
       content = "text/css";
     } else if (file.indexOf(".png") > 0) {
       content = "image/png";
       encode = "binary";
     } else if (file.indexOf(".gif") > 0) {
       content = "image/gif";
       encode = "binary";
     } else if (file.indexOf(".ico") > 0) {
       content = "image/x-icon";
       encode = "binary";
     }

     if (content != "") {
//     console.log(file + " " + content);
       res.writeHead(200, {"Content-Type":content});
       var output = fs.readFileSync(file, encode);
//     console.log("read ok.");
       res.write(output, encode);
     }
     
     res.end();
       
}).listen(8081);

var io = require("socket.io").listen(server);

// ユーザ管理ハッシュ
var userHash = {};
var initX = 350;
var initY = 220;
var initZ = 220 + 48;
var initScaleX = -1;
var initMotionId = "wait";

// 2.イベントの定義
io.sockets.on("connection", function (socket) {

  // 接続開始カスタムイベント(接続元ユーザを保存し、他ユーザへ通知)
  socket.on("connected", function () {
    console.log("connected");
    // ログインユーザーの処理を開始
    io.sockets.to(socket.id).emit("connected", ({id:socket.id, x:initX, y:initY, z:initZ, scaleX:initScaleX, motionId:initMotionId}));
    // ハッシュに追加
    userHash[socket.id] = ({id:socket.id, x:initX, y:initY, z:initZ, scaleX:initScaleX, motionId:initMotionId});
  });

  // メッセージ送信カスタムイベント
  socket.on("publish", function (data) {
    // ハッシュを更新
    userHash[socket.id] = ({id:data.id, name:data.name, x:data.x, y:data.y, z:data.z, scaleX:data.scaleX, motionId:data.motionId});
  
    // 他のプレイヤーに描画を通知
    socket.broadcast.emit("publish", ({id:data.id, name:data.name, x:data.x, y:data.y, z:data.z, scaleX:data.scaleX, motionId:data.motionId}));
  });

  // 接続終了組み込みイベント(接続元ユーザを削除し、他ユーザへ通知)
  socket.on("disconnect", function () {
    console.log("disconnect");
    if (userHash[socket.id]) {
      delete userHash[socket.id];
      socket.broadcast.emit("disconnected", {id: socket.id});
    }
  });
});
