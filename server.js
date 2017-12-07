//Server
var express = require('express');
var app = express();

app.listen(80, function () {
  console.log('listening on port 80');
});
app.use(express.static(__dirname + '/public'));
console.log('Point your browser to http://localhost:' + 80);

var http = require("http");
var server = http.Server(app);
var socketIO = require("socket.io"); // socket.ioの読み込み
var io = socketIO.listen(server); // サーバーでSocket.IOを使える状態にする

//SensorTag
var util = require('util');
var async = require('async');
var SensorTag = require('./index').CC2650;

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
var preSelect = -1;
var showModal = false;
var deviceList = [];


function onDiscover(sensorTag) {
  console.log('discovered: ' + sensorTag.uuid + ', type = ' + sensorTag.type);
  deviceList.push(sensorTag.uuid);
  deviceList[sensorTag.uuid] = [];
  deviceList[sensorTag.uuid] = {nowState:'', beforeState:''};  
  console.log(deviceList);
  console.log(deviceList.length);


  sensorTag.on('disconnect', function () {
    deviceList.splice(deviceList.indexOf(sensorTag.uuid),1);
    console.log('切断されました:' + sensorTag.uuid);
    console.log(deviceList);
    console.log(deviceList.length);
  });

  async.series([
    function (callback) {
      console.log(sensorTag.uuid + 'connectAndSetUp');
      sensorTag.connectAndSetUp(callback);
    },
    function (callback) {
      sensorTag.notifyAccelerometer(callback);
      console.log(sensorTag.uuid +"accelerometer setup");
    },
    function (callback) {
      console.log('enableAccelerometer');
      sensorTag.enableAccelerometer(callback);
    },
    function (callback) {
      setTimeout(callback, 2000);
    },
    function (callback) {
      if (USE_READ) {
        console.log(sensorTag.uuid +'readAccelerometer');
        sensorTag.readAccelerometer(function (error, x, y, z) {
          //console.log('\tx = %d G', x.toFixed(1));
          //console.log('\ty = %d G', y.toFixed(1));
          //console.log('\tz = %d G', z.toFixed(1));
          callback();
        });
      } else {
        console.log(sensorTag.uuid +'setAccelerometerPeriod');
        sensorTag.on('accelerometerChange', function (x, y, z) {
          //console.log('\tx = %d G', x.toFixed(1));
          //console.log('\ty = %d G', y.toFixed(1));
          //console.log('\tz = %d G', z.toFixed(1));
          // var X = x.toFixed(1);
          // var Y = y.toFixed(1);
          // var Z = z.toFixed(1);
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
            deviceList[sensorTag.uuid].nowState = now_state;
   
            if (deviceList[sensorTag.uuid].beforeState != deviceList[sensorTag.uuid].nowState) {
              console.log(sensorTag.uuid + ":今=" + deviceList[sensorTag.uuid].nowState + "前=" + deviceList[sensorTag.uuid].beforeState);
            }

            before_state = now_state;
            deviceList[sensorTag.uuid].beforeState = before_state;
          }
        });
        sensorTag.setAccelerometerPeriod(1000, function (error) {
          //console.log('notifyAccelerometer');
          sensorTag.notifyAccelerometer(function (error) { //5秒後に実行1回実行
            setTimeout(function () {
              //console.log("a");
              //console.log('unnotifyAccelerometer');
              sensorTag.unnotifyAccelerometer(callback);
            }, 5000);
          });
        });
      }
    },

  ]);
}

SensorTag.discoverAll(onDiscover);


// SensorTag.discover(function(sensorTag) {
//   console.log('discovered: ' + sensorTag);
//   //  console.log('discovered: ' + SensorTag.uuid + ', type = ' + sensorTag.type);
//   device.push(sensorTag);
//   console.log("device:" + device);
//
//   sensorTag.on('disconnect', function() {
//     console.log('切断されました');
//     process.exit(0);
//   });
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



//     async.series([
//       function(callback) {
//         console.log('connectAndSetUp');
//         sensorTag.connectAndSetUp(callback);
//       },
//       function(callback) {
//         sensorTag.notifySimpleKey(callback);
//         console.log('key change waiting...');
//       },
//       function(callback) {
//         sensorTag.notifyAccelerometer(callback);
//         console.log("accelerometer setup");
//       },
//       function(callback) {
//         console.log('enableAccelerometer');
//         sensorTag.enableAccelerometer(callback);
//       },
//       function(callback) {
//         setTimeout(callback, 2000);
//       }, //ちょっと待たないと一回目にデータ取得できない
//       function(callback) {
//         if (USE_READ) {
//           console.log('readAccelerometer');
//           sensorTag.readAccelerometer(function(error, x, y, z) {
//             //console.log('\tx = %d G', x.toFixed(1));
//             //console.log('\ty = %d G', y.toFixed(1));
//             //console.log('\tz = %d G', z.toFixed(1));
//             callback();
//           });
//         } else {
//           console.log('setAccelerometerPeriod');
//           sensorTag.on('accelerometerChange', function(x, y, z) {
//             //console.log('\tx = %d G', x.toFixed(1));
//             //console.log('\ty = %d G', y.toFixed(1));
//             //console.log('\tz = %d G', z.toFixed(1));
//             var X = x.toFixed(1);
//             var Y = y.toFixed(1);
//             var Z = z.toFixed(1);
//
//             if (time++ == 10) {
//               //console.log("X:" + X + "  Y:" + Y + "  Z:" + Z);
//               time = 0;
//               if (X <= 0.1 && X >= -0.1 && Y <= 0.1 && Y >= -0.1 && Z >= 0.9) {
//                 now_state = 1;
//               } else if (X <= -0.9 && Y <= 0.1 && Y >= -0.1 && Z >= -0.1 && Z <= 0.1) {
//                 now_state = 2;
//               } else if (X <= 0.1 && X >= -0.1 && Y >= 0.9 && Z <= 0.1 && Z >= -0.1) {
//                 now_state = 3;
//               } else if (X <= 0.1 && X >= -0.1 && Y <= -0.9 && Z <= 0.1 && Z >= -0.1) {
//                 now_state = 4;
//               } else if (X >= 0.9 && Y <= 0.1 && Y >= -0.1 && Z >= -0.1 && Z <= 0.1) {
//                 now_state = 5;
//               } else if (X <= 0.1 && X >= -0.1 && 　Y <= 0.1 && Y >= -0.1 && Z <= -0.9) {
//                 now_state = 6;
//               }
//               io.sockets.emit("now_state", now_state);
//               if (before_state != now_state) {
//                 console.log(now_state);
//               }
//               before_state = now_state;
//             }
//           });
//           sensorTag.setAccelerometerPeriod(100, function(error) {
//             //console.log('notifyAccelerometer');
//             sensorTag.notifyAccelerometer(function(error) { //5秒後に実行1回実行
//               setTimeout(function() {
//                 //console.log("a");
//                 //console.log('unnotifyAccelerometer');
//                 sensorTag.unnotifyAccelerometer(callback);
//               }, 5000);
//             });
//           });
//         }
//       },
//       function(callback) {
//         console.log('enableGyroscope');
//         sensorTag.enableGyroscope(callback);
//       },
//       function(callback) {
//         setTimeout(callback, 2000);
//       },
//       function(callback) {
//         if (USE_READ) {
//           console.log('readGyroscope');
//           sensorTag.readGyroscope(function(error, x, y, z) {
//             console.log('\tx = %d °/s', x.toFixed(1));
//             console.log('\ty = %d °/s', y.toFixed(1));
//             console.log('\tz = %d °/s', z.toFixed(1));
//
//             callback();
//           });
//         } else {
//           sensorTag.on('gyroscopeChange', function(x, y, z) {
//
//             //console.log(GyroFrag);
//             var X = x.toFixed(1);
//             var Y = y.toFixed(1);
//             var Z = z.toFixed(1);
//
//             //console.log('\tx = %d °/s', x.toFixed(1));
//             //console.log('\ty = %d °/s', y.toFixed(1));
//             //console.log('\tz = %d °/s', z.toFixed(1));
//             //angle +=  Z * gyro_interval;
//             var temp;
//             switch (now_state) {
//               case 2:
//                 temp = -X;
//                 X = Z;
//                 Z = temp;
//                 break;
//               case 3:
//                 temp = Y;
//                 Y = Z;
//                 Z = temp;
//                 break;
//               case 4:
//                 temp = -Y;
//                 Y = Z;
//                 Z = temp;
//                 break;
//               case 5:
//                 temp = X;
//                 X = -Z;
//                 Z = temp;
//                 break;
//               case 6:
//                 Z = -Z;
//                 break;
//             }
//
//
//             if (pregyro == 0) {
//               angle = Z * gyro_interval / 2;
//             } else {
//               angle += (parseInt(pregyro) + parseInt(Z)) * gyro_interval / 2;
//             }
//             gyro_time += gyro_interval;
//             pregyro = Z;
//             if (gyro_time == 1000) {
//               //console.log(pregyro + Z);
//               angle = -angle / 1000;
//               if (70 <= angle) {
//                 select += (Math.ceil(angle / 40));
//               } else if (20 < angle && angle < 70) {
//                 select++;
//               } else if (-70 >= angle) {
//                 select += (Math.ceil(angle / 40));
//               } else if (-70 <= angle && -20 >= angle) {
//                 select--;
//               }
//               if (-5 <= angle && angle <= 5) {
//                 if (preSelect != select || preSelect == -1) {
//                   io.sockets.emit("NoOperation", select);
//                 }
//                 preSelect = select;
//               }
//
//               if (select > 32) {
//                 select = 0;
//               } else if (select < 0) {
//                 select = 32;
//               }
//               console.log(angle);
//               console.log("select:" + select);
//
//               gyro_time = 0;
//               pregyro = 0;
//               io.sockets.emit("select", select);
//
//             }
//           });
//
//           console.log('setGyroscopePeriod');
//           sensorTag.setGyroscopePeriod(gyro_interval, function(error) {
//             console.log('notifyGyroscope');
//             sensorTag.notifyGyroscope(function(error) {
//               // setTimeout(function() {
//               //   console.log('unnotifyGyroscope');
//               //   sensorTag.unnotifyGyroscope(callback);
//               // }, 10000);
//             });
//           });
//         }
//       },
//       function(callback) {
//         console.log('disableGyroscope');
//         sensorTag.disableGyroscope(callback);
//       },
//       function(callback) {
//         console.log('disconnect');
//         sensorTag.disconnect(callback);
//         //console.log('disableAccelerometer');
//         //sensorTag.enableAccelerometer(callback);
//         //sensorTag.disableAccelerometer(callback);
//       }
//     ]);
// });