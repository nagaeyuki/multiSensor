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
var before_Top = 0;
var now_Top = 0;

var gyro_interval = 100;
var gyro_time = 0;
var angle = 0;
var pregyro = 0;


var time = 0;
var gyro;
var select = 0;
var gyro_store = 0;
var GyroFrag;
var preSelect = -1;
var showModal = false;

var array = [];


function onDiscover(sensorTag) {
  console.log('discovered: ' + sensorTag.uuid + ', type = ' + sensorTag.type);
  deviceList.push(sensorTag.uuid);
  deviceList[sensorTag.uuid] = [];
  deviceList[sensorTag.uuid] = {
    nowTop: '',
    beforeTop: ''
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
          // console.log(sensorTag.uuid);          
          // if (time++ == 10) {
          if (X <= 0.1 && X >= -0.1 && Y <= 0.1 && Y >= -0.1 && Z >= 0.9) {
            deviceList[sensorTag.uuid].nowTop = 1;
          } else if (X <= -0.9 && Y <= 0.1 && Y >= -0.1 && Z >= -0.1 && Z <= 0.1) {
            deviceList[sensorTag.uuid].nowTop = 2;
          } else if (X <= 0.1 && X >= -0.1 && Y >= 0.9 && Z <= 0.1 && Z >= -0.1) {
            deviceList[sensorTag.uuid].nowTop = 3;
          } else if (X <= 0.1 && X >= -0.1 && Y <= -0.9 && Z <= 0.1 && Z >= -0.1) {
            deviceList[sensorTag.uuid].nowTop = 4;
          } else if (X >= 0.9 && Y <= 0.1 && Y >= -0.1 && Z >= -0.1 && Z <= 0.1) {
            deviceList[sensorTag.uuid].nowTop = 5;
          } else if (X <= 0.1 && X >= -0.1 && 　Y <= 0.1 && Y >= -0.1 && Z <= -0.9) {
            deviceList[sensorTag.uuid].nowTop = 6;
          }
         
          if (deviceList[sensorTag.uuid].beforeTop != deviceList[sensorTag.uuid].nowTop) {
            console.log(sensorTag.uuid + ":今=" + deviceList[sensorTag.uuid].nowTop + "前=" + deviceList[sensorTag.uuid].beforeTop);
            io.sockets.emit("nowTop", deviceList[sensorTag.uuid].nowTop);
          }
          deviceList[sensorTag.uuid].beforeTop = deviceList[sensorTag.uuid].nowTop;
        });
        sensorTag.setAccelerometerPeriod(1000, function (error) {
          console.log('notifyAccelerometer');
          sensorTag.notifyAccelerometer(function (error) {
            setTimeout(function () {
            //   //console.log('unnotifyAccelerometer');
              sensorTag.unnotifyAccelerometer(callback);
            }, 2000);
          });
        });
    },
    function (callback) {
      console.log('enableGyroscope');
      sensorTag.enableGyroscope(callback);
    },
    function (callback) {
      setTimeout(callback, 2000);
    },
    function (callback) {
      
        sensorTag.on('gyroscopeChange', function (x, y, z) {
          //console.log(GyroFrag);
          var X = x.toFixed(1);
          var Y = y.toFixed(1);
          var Z = z.toFixed(1);
          //console.log('\tx = %d °/s', x.toFixed(1));
          //console.log('\ty = %d °/s', y.toFixed(1));
          //console.log('\tz = %d °/s', z.toFixed(1));
          //angle +=  Z * gyro_interval;

          var temp;
          switch (deviceList[sensorTag.uuid].nowTop) {
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
          
          
          
       
          if (-4 <= Z && Z <= 4){
            Z = 0;
          }
          array.push(Z);
          if (pregyro == 0) {
            angle += Z * gyro_interval / 2;
          } else {
            angle += (parseInt(pregyro) + parseInt(Z)) * gyro_interval / 2;
          }
          gyro_time += gyro_interval;
          pregyro = Z;
          if (gyro_time == 1000) {
            angle = -angle / 1000;
            // console.log("角度:" + angle);

            // if (70 <= angle) {
            //   select += (Math.ceil(angle / 40));
            // } else if (20 < angle && angle < 70) {
            //   select++;
            // } else if (-70 >= angle) {
            //   select += (Math.ceil(angle / 40));
            // } else if (-70 <= angle && -20 >= angle) {
            //   select--;
            // }
            // if (-5 <= angle && angle <= 5) {
            //   if (preSelect != select || preSelect == -1) {
            //     io.sockets.emit("NoOperation", select);
            //   }
            //   preSelect = select;
            // }

            // if (select > 32) {
            //   select = 0;
            // } else if (select < 0) {
            //   select = 32;
            // }
            // console.log(angle);
            // console.log("select:" + select);

            gyro_time = 0;
            pregyro = 0;
            
            // io.sockets.emit("select", select);
            // console.log(array);
            io.sockets.emit("test", angle);
          }
          if(array.length == 10){
            array.shift();
          }
        });

        console.log('setGyroscopePeriod');
        sensorTag.setGyroscopePeriod(gyro_interval, function (error) {
          console.log('notifyGyroscope');
          sensorTag.notifyGyroscope(function (error) {
            // setTimeout(function() {
            //   console.log('unnotifyGyroscope');
            //   sensorTag.unnotifyGyroscope(callback);
            // }, 10000);
          });
        });
      
    },
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

SensorTag.discoverAll(onDiscover);