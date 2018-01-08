//Server
var express = require('express');
var app = express();

var http = require("http");
var server = http.Server(app);
var fs = require("fs");

var path = require("path");
var socketIO = require("socket.io"); // socket.ioの読み込み
var io = socketIO.listen(server); // サーバーでSocket.IOを使える状態にする
server.listen(80);

// app.listen(80, function () {
//   console.log('listening on port 80');
// });
app.use(express.static(__dirname + '/public'));
console.log('Point your browser to http://localhost:' + 80);


io.sockets.on("connection", function (socket) {
});


//SensorTag
var util = require('util');
var async = require('async');
var SensorTag = require('./index').CC2650;
var deviceList = [];

var accele_interval = 100;
var gyro_interval = 200;

var angle = 0;
var pregyro = 0;
var time = 0;
var gyro;
var select = 0;
var gyro_store = 0;
var GyroFrag;

var sample = 0;
var array = [];


function onDiscover(sensorTag) {
  console.log('discovered: ' + sensorTag.uuid + ', type = ' + sensorTag.type);
  deviceList.push(sensorTag.uuid);
  deviceList[sensorTag.uuid] = [];
  deviceList[sensorTag.uuid] = {
    nowFront: '',
    beforeFront: '',
    gyro: 0
  };
  console.log(deviceList);

  sensorTag.on('disconnect', function () {
    deviceList.splice(deviceList.indexOf(sensorTag.uuid), 1);
    console.log('切断されました:' + sensorTag.uuid);
    console.log(deviceList);
  });

  async.series([
    function (callback) {
      console.log(sensorTag.uuid + ':connectAndSetUp');
      sensorTag.connectAndSetUp(callback);
    },
    function (callback) {
      sensorTag.notifyAccelerometer(callback);
      console.log(sensorTag.uuid + ":accelerometer setup");
    },
    function (callback) {
      console.log('enableAccelerometer');
      sensorTag.enableAccelerometer(callback);
    },
    function (callback) {
      setTimeout(callback, 2000);
    },
    function (callback) {
      
        console.log(sensorTag.uuid + ':setAccelerometerPeriod');
        sensorTag.on('accelerometerChange', function (x, y, z) {
          var X = x.toFixed(1);
          var Y = y.toFixed(1);
          var Z = z.toFixed(1);
            io.sockets.emit("ondata", { x: X, y: Y, z: Z});

          //値がおかしいセンサがあった時の処理
          if(3.8 < Math.abs(X) || 3.8 < Math.abs(Y) || 3.8 < Math.abs(Z)){
            if (X <= 0.6 && X >= -0.6 && Y <= 0.6 && Y >= -0.6 && Z >= 3.8) {
              deviceList[sensorTag.uuid].nowFront = 1;
            } else if (X <= -3.8 && Y <= 0.6 && Y >= -0.6 && Z >= -0.6 && Z <= 0.6) {
              deviceList[sensorTag.uuid].nowFront = 2;
            } else if (X <= 0.6 && X >= -0.6 && Y >= 3.8 && Z <= 061 && Z >= -0.6) {
              deviceList[sensorTag.uuid].nowFront = 3;
            } else if (X <= 0.6 && X >= -0.6 && Y <= -3.8 && Z <= 0.6 && Z >= -0.6) {
              deviceList[sensorTag.uuid].nowFront = 4;
            } else if (X >= 3.8 && Y <= 061 && Y >= -0.6 && Z >= -0.6 && Z <= 0.6) {
              deviceList[sensorTag.uuid].nowFront = 5;
            } else if (X <= 0.6 && X >= -0.6 && Y <= 0.6 && Y >= -0.6 && Z <= 3.8) {
              deviceList[sensorTag.uuid].nowFront = 6;
            }
          }else{
            if (X <= 0.1 && X >= -0.1 && Y <= 0.1 && Y >= -0.1 && Z >= 0.9) {
              deviceList[sensorTag.uuid].nowFront = 1;
            } else if (X <= -0.9 && Y <= 0.1 && Y >= -0.1 && Z >= -0.1 && Z <= 0.1) {
              deviceList[sensorTag.uuid].nowFront = 2;
            } else if (X <= 0.1 && X >= -0.1 && Y >= 0.9 && Z <= 0.1 && Z >= -0.1) {
              deviceList[sensorTag.uuid].nowFront = 3;
            } else if (X <= 0.1 && X >= -0.1 && Y <= -0.9 && Z <= 0.1 && Z >= -0.1) {
              deviceList[sensorTag.uuid].nowFront = 4;
            } else if (X >= 0.9 && Y <= 0.1 && Y >= -0.1 && Z >= -0.1 && Z <= 0.1) {
              deviceList[sensorTag.uuid].nowFront = 5;
            } else if (X <= 0.1 && X >= -0.1 && Y <= 0.1 && Y >= -0.1 && Z <= -0.9) {
              deviceList[sensorTag.uuid].nowFront = 6;
            }
            
          }
          console.log(++sample, sensorTag.uuid  + ':\tx = %d G', x.toFixed(1), '\ty = %d G', y.toFixed(1), '\tz = %d G', z.toFixed(1));

          //一回目目のセンシング
          if (deviceList[sensorTag.uuid].beforeFront == ""){
            // io.sockets.emit("acceledata", { nowFront: deviceList[sensorTag.uuid].nowFront, sensorIdNumber: deviceList.indexOf(sensorTag.uuid) });
          }
          if (deviceList[sensorTag.uuid].beforeFront != deviceList[sensorTag.uuid].nowFront) {
            // console.log(sensorTag.uuid + ":今=" + deviceList[sensorTag.uuid].nowFront + "前=" + deviceList[sensorTag.uuid].beforeFront);
            // io.sockets.emit("acceledata", { nowFront: deviceList[sensorTag.uuid].nowFront, sensorIdNumber: deviceList.indexOf(sensorTag.uuid)});
          }
          deviceList[sensorTag.uuid].beforeFront = deviceList[sensorTag.uuid].nowFront;
        });

      sensorTag.setAccelerometerPeriod(accele_interval, function (error) {
          // setTimeout(callback, 2000);
          // console.log('notifyAccelerometer');
          // sensorTag.notifyAccelerometer(function (error) {
          //   // setTimeout(function () {
          //     console.log('unnotifyAccelerometer');
          //     sensorTag.unnotifyAccelerometer(callback);
          //   // }, 5000);
          // });
        });
    },
    // function (callback) {
    //   console.log('enableGyroscope');
    //   sensorTag.enableGyroscope(callback);
    // },
    // function (callback) {
    //   setTimeout(callback, 2000);
    // },
    // function (callback) {
      
    //     sensorTag.on('gyroscopeChange', function (x, y, z) {
    //       var X = x.toFixed(1);
    //       var Y = y.toFixed(1);
    //       var Z = z.toFixed(1);
    //       //console.log('\tx = %d °/s', x.toFixed(1));
    //       //console.log('\ty = %d °/s', y.toFixed(1));
    //       //console.log('\tz = %d °/s', z.toFixed(1));
    //       //angle +=  Z * gyro_interval;

    //       var temp;
    //       switch (deviceList[sensorTag.uuid].nowFront) {
    //         case 2:
    //           temp = -X;
    //           X = Z;
    //           Z = temp;
    //           break;
    //         case 3:
    //           temp = Y;
    //           Y = Z;
    //           Z = temp;
    //           break;
    //         case 4:
    //           temp = -Y;
    //           Y = Z;
    //           Z = temp;
    //           break;
    //         case 5:
    //           temp = X;
    //           X = -Z;
    //           Z = temp;
    //           break;
    //         case 6:
    //           Z = -Z;
    //           break;
    //       }
          
      
    //       if (-4 <= Z && Z <= 4){
    //         // Z = 0;
    //       }
    //       array.push(Z);
    //       if (pregyro == 0) {
    //         angle += Z * gyro_interval / 2;
    //       } else {
    //         angle += (parseInt(pregyro) + parseInt(Z)) * gyro_interval / 2;
    //       }
    //       deviceList[sensorTag.uuid].gyro += gyro_interval;
          
    //       pregyro = Z;
    //       if (deviceList[sensorTag.uuid].gyro == 1000) {

    //         angle = angle / 1000;
    //         if(-5 < angle && angle < 5){
    //           angle = 0;
    //         }
    //         if(angle != 0){
    //         console.log("回った角度:" + angle + " id:" + deviceList.indexOf(sensorTag.uuid));
    //           io.sockets.emit("gyrodata", { angle: angle, sensorIdNumber: deviceList.indexOf(sensorTag.uuid) });
    //         }
    //         pregyro = 0;
    //         deviceList[sensorTag.uuid].gyro=0;
    //       }
    //       if(array.length == 10){
    //         array.shift();
    //       }
          
    //     });

        // console.log('setGyroscopePeriod');
        // sensorTag.setGyroscopePeriod(gyro_interval, function (error) {
        //   console.log('notifyGyroscope');
        //   sensorTag.notifyGyroscope(function (error) {
        //     // setTimeout(function() {
        //     //   console.log('unnotifyGyroscope');
        //       // sensorTag.unnotifyGyroscope(callback);
        //     // }, 10000);
        //   });
        // });
      
    // },
    function (callback) {
      console.log('disableGyroscope');
      sensorTag.disableGyroscope(callback);
    },
    function (callback) {
      console.log('disconnect');
      sensorTag.disconnect(callback);
      console.log('disableAccelerometer');
      // sensorTag.enableAccelerometer(callback);
      // sensorTag.disableAccelerometer(callback);
    }


  ]);
}
// SensorTag.discover(onDiscover);
SensorTag.discoverAll(onDiscover);