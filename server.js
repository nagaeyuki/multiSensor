﻿  //express.HTTPServer のインスタンスを生成するには createServer() メソッドを呼び出すだけです
  var express = require('express');
  var app = express();

  app.listen(80, function(){
    console.log('listening on port 80');
  });
  app.use(express.static(__dirname + '/public'));
    console.log('Point your browser to http://localhost:' + 80);


  // var server = require('http').createServer(app),
  //io = require('socket.io').listen(server),
  // zlib = resquire('zlib');
// httpモジュールの読み込み
var http = require("http");
// fsモジュールの読み込み
// var fs = require("fs");
// pathモジュールの読み込み
// var path = require("path");
var server = http.Server(app);
// socket.ioの読み込み
var socketIO = require("socket.io");
// サーバーでSocket.IOを使える状態にする
var io = socketIO.listen(server);
// server.listen(80);
// var http_port = 80;


/**
 * サーバーにリクエストがあった際に実行される関数
 */
// function requestListener(request, response) {
//
//   var requestURL = request.url;
//   // リクエストのあったファイルの拡張子を取得
//   // リクエストがあったファイル
//   var extensionName = path.extname(requestURL);
//   // ファイルの拡張子に応じてルーティング処理
//   switch (extensionName) {
//     case ".html":
//       readFileHandler(requestURL, "text/html", false, response);
//       break;
//     case ".css":
//       readFileHandler(requestURL, "text/css", false, response);
//       break;
//     case ".js":
//     case ".ts":
//       readFileHandler(requestURL, "text/javascript", false, response);
//       break;
//     case ".png":
//       readFileHandler(requestURL, "image/png", true, response);
//       break;
//     case ".jpg":
//       readFileHandler(requestURL, "image/jpeg", true, response);
//       break;
//     case ".gif":
//       readFileHandler(requestURL, "image/gif", true, response);
//       break;
//
//     default:
//       // どこにも該当しない場合は、controller.htmlを読み込む
//       readFileHandler("controller.html", "text/html", false, response);
//
//       break;
//   }
// }


/**
 * ファイルの読み込み
 */
// function readFileHandler(fileName, contentType, isBinary, response) {
//   // エンコードの設定
//   var encoding = !isBinary ? "utf8" : "binary";
//   var filePath = __dirname + "public" + fileName;
//
//   fs.exists(filePath, function(exits) {
//     if (exits) {
//       fs.readFile(filePath, {
//         encoding: encoding
//       }, function(error, data) {
//         if (error) {
//           response.statusCode = 500;
//           response.end("Internal Server Error");
//         } else {
//           response.statusCode = 200;
//           response.setHeader("Content-Type", contentType);
//           if (!isBinary) {
//             response.end(data);
//           } else {
//             response.end(data, "binary");
//           }
//         }
//       });
//     } else {
//       // ファイルが存在しない場合は400エラーを返す。
//       response.statusCode = 400;
//       response.end("400 Error");
//     }
//   });
// }

// サーバーへのアクセスを監視。アクセスがあったらコールバックが実行
// io.sockets.on("connection", function(socket) {
//   socket.on("showModal",function(){
//     showModal =true;
//   });
// });

var util = require('util');
var async = require('async');
var CC2650SensorTag = require('./index').CC2650;

var USE_READ = true;
var USE_READ = false;
var before_state = 0;
var now_state = 0;
var time = 0;
var gyro_interval = 100;
var gyro_time = 0;
var angle = 0;
var pregyro = 0;
var gyro;
var select = 0;
var gyro_store = 0;
var GyroFrag;
var preSelect=-1;
var showModal=false;
CC2650SensorTag.discover(function(sensorTag) {
  console.log('discovered: ' + sensorTag);

  sensorTag.on('disconnect', function() {
    console.log('disconnected!');
    process.exit(0);
  });
  // sensorTag.on('simpleKeyChange', function(left, right, reedRelay) {
  //   if (right) {
  //     console.log('right: down');
  //   } else {
  //     console.log('right: up');
  //   }
  //   if (left) {
  //     console.log('disconnected!');
  //     process.exit(0);
  //   }
  // });

   

  async.series([
    function(callback) {
      console.log('connectAndSetUp');
      sensorTag.connectAndSetUp(callback);
    },
    // // function(callback) {
    // //   sensorTag.notifySimpleKey(callback);
    // //   console.log('key change waiting...');
    // // },
    function(callback) {
      sensorTag.notifyAccelerometer(callback);
      console.log("accelerometer setup");
    },
    function(callback) {
      console.log('enableAccelerometer');
      sensorTag.enableAccelerometer(callback);
    },
    function(callback) {
      setTimeout(callback, 2000);
    }, //ちょっと待たないと一回目にデータ取得できない
    function(callback) {
      if (USE_READ) {
        console.log('readAccelerometer');
        sensorTag.readAccelerometer(function(error, x, y, z) {
          //console.log('\tx = %d G', x.toFixed(1));
          //console.log('\ty = %d G', y.toFixed(1));
          //console.log('\tz = %d G', z.toFixed(1));
          callback();
        });
      } else {
        console.log('setAccelerometerPeriod');
        sensorTag.on('accelerometerChange', function(x, y, z) {
          //console.log('\tx = %d G', x.toFixed(1));
          //console.log('\ty = %d G', y.toFixed(1));
          //console.log('\tz = %d G', z.toFixed(1));
          var X = x.toFixed(1);
          var Y = y.toFixed(1);
          var Z = z.toFixed(1);

          if (time++ == 10) {
            //console.log("X:" + X + "  Y:" + Y + "  Z:" + Z);
            time = 0;
            if (X <= 0.1 && X >= -0.1 && Y <= 0.1 && Y >= -0.1 && Z >= 0.9) {
              now_state = 1;
            } else if (X <= -0.9 && Y <= 0.1 && Y >= -0.1 && Z >= -0.1 && Z <= 0.1) {
              now_state = 2;
            } else if (X <= 0.1 && X >= -0.1 && Y >= 0.9 && Z <= 0.1 && Z >= -0.1) {
              now_state = 3;
            } else if (X <= 0.1 && X >= -0.1 && Y <= -0.9 && Z <= 0.1 && Z >= -0.1) {
              now_state = 4;
            } else if (X >= 0.9 && Y <= 0.1 && Y >= -0.1 && Z >= -0.1 && Z <= 0.1) {
              now_state = 5;
            } else if (X <= 0.1 && X >= -0.1 && 　Y <= 0.1 && Y >= -0.1 && Z <= -0.9) {
              now_state = 6;
            }
            io.sockets.emit("now_state", now_state);
            if (before_state != now_state) {
              console.log(now_state);
            }
            before_state = now_state;
          }
        });
        sensorTag.setAccelerometerPeriod(100, function(error) {
          //console.log('notifyAccelerometer');
          sensorTag.notifyAccelerometer(function(error) { //5秒後に実行1回実行
            setTimeout(function() {
              //console.log("a");
              //console.log('unnotifyAccelerometer');
              sensorTag.unnotifyAccelerometer(callback);
            }, 5000);
          });
        });
      }
    },
    function(callback) {
      console.log('enableGyroscope');
      sensorTag.enableGyroscope(callback);
    },
    function(callback) {
      setTimeout(callback, 2000);
    },
    function(callback) {
      if (USE_READ) {
        console.log('readGyroscope');
        sensorTag.readGyroscope(function(error, x, y, z) {
          console.log('\tx = %d °/s', x.toFixed(1));
          console.log('\ty = %d °/s', y.toFixed(1));
          console.log('\tz = %d °/s', z.toFixed(1));

          callback();
        });
      } else {
        sensorTag.on('gyroscopeChange', function(x, y, z) {

          //console.log(GyroFrag);
          var X = x.toFixed(1);
          var Y = y.toFixed(1);
          var Z = z.toFixed(1);

          //console.log('\tx = %d °/s', x.toFixed(1));
          //console.log('\ty = %d °/s', y.toFixed(1));
          //console.log('\tz = %d °/s', z.toFixed(1));
          //angle +=  Z * gyro_interval;
          var temp;
          switch (now_state) {
            case 2:
              temp = -X;
              X = Z;
              Z = temp;
              break;
            case 3:
              temp = Y;
              Y = Z;
              Z = temp;
              break;
            case 4:
              temp = -Y;
              Y = Z;
              Z = temp;
              break;
            case 5:
              temp = X;
              X = -Z;
              Z = temp;
              break;
            case 6:
              Z = -Z;
              break;
          }


          if (pregyro == 0) {
            angle = Z * gyro_interval / 2;
          } else {
            angle += (parseInt(pregyro) + parseInt(Z)) * gyro_interval / 2;
          }
          gyro_time += gyro_interval;
          pregyro = Z;
          if (gyro_time == 1000) {
            //console.log(pregyro + Z);
            angle = -angle / 1000;
            if (70 <= angle) {
              select += (Math.ceil(angle / 40));
            } else if (20 < angle && angle < 70) {
              select++;
            }else if (-70 >= angle) {
              select += (Math.ceil(angle / 40));
            }else if (-70 <= angle && -20 >= angle) {
                select--;
            }
            if(-5 <= angle && angle <=5){
              if(preSelect != select || preSelect==-1){
                io.sockets.emit("NoOperation", select);
              }
                preSelect = select;
              }

            if (select > 32) {
              select = 0;
            } else if (select < 0) {
              select = 32;
            }
            console.log(angle);
            console.log("select:" + select);

            gyro_time = 0;
            pregyro=0;
            io.sockets.emit("select", select);

        }
        });

        console.log('setGyroscopePeriod');
        sensorTag.setGyroscopePeriod(gyro_interval, function(error) {
          console.log('notifyGyroscope');
          sensorTag.notifyGyroscope(function(error) {
            // setTimeout(function() {
            //   console.log('unnotifyGyroscope');
            //   sensorTag.unnotifyGyroscope(callback);
            // }, 10000);
          });
        });
      }
    },
    function(callback) {
      console.log('disableGyroscope');
      sensorTag.disableGyroscope(callback);
    },
    function(callback) {
      console.log('disconnect');
      sensorTag.disconnect(callback);
      //console.log('disableAccelerometer');
      //sensorTag.enableAccelerometer(callback);
      //sensorTag.disableAccelerometer(callback);
    }
  ]);
});
