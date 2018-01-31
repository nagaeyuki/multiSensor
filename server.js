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
var gyro_interval = 100;

var gyro_angle = [0, 0, 0];
var pregyro = [0, 0, 0];

var angle = [0, 0, 0];
var time = 0;
var gyro;
var select = 0;
var gyro_store = 0;
var GyroFrag;

var sample = 0;

var array = [0, 1, 2];
createTwoDimensionalArray(array);
var bufferAccele = [0, 1, 2];
createTwoDimensionalArray(bufferAccele);
var bufferGyro = [0, 1, 2];
createTwoDimensionalArray(bufferGyro);
var aveAccele = [0, 1, 2];
var aveGyro = [0, 1, 2];


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
        if (bufferAccele[0].length != 100) {
          preparatioSensor(bufferAccele, aveAccele, x, y, z, 100);
        }else{


          

          
          // var X = x - aveAccele[0];
          // var Y = y - aveAccele[1];
          // var Z = z - aveAccele[2];

        console.log("処理後 X: " + x + " Y: " + y + " Z: " + z);


        // io.sockets.emit("accele", { x: x, y: y, z: z, sensorIdNumber: deviceList.indexOf(sensorTag.uuid)});
        // io.sockets.emit("ondata", { x: x, y: y, z: z });

        //   // 値がおかしいセンサがあった時の処理
        //   if (3.8 < Math.abs(X) || 3.8 < Math.abs(Y) || 3.8 < Math.abs(Z)) {
        //     if (X <= 0.6 && X >= -0.6 && Y <= 0.6 && Y >= -0.6 && Z >= 3.8) {
        //       deviceList[sensorTag.uuid].nowFront = 1;
        //     } else if (X <= -3.8 && Y <= 0.6 && Y >= -0.6 && Z >= -0.6 && Z <= 0.6) {
        //       deviceList[sensorTag.uuid].nowFront = 2;
        //     } else if (X <= 0.6 && X >= -0.6 && Y >= 3.8 && Z <= 0.6 && Z >= -0.6) {
        //       deviceList[sensorTag.uuid].nowFront = 3;
        //     } else if (X <= 0.6 && X >= -0.6 && Y <= -3.8 && Z <= 0.6 && Z >= -0.6) {
        //       deviceList[sensorTag.uuid].nowFront = 4;
        //     } else if (X >= 3.8 && Y <= 061 && Y >= -0.6 && Z >= -0.6 && Z <= 0.6) {
        //       deviceList[sensorTag.uuid].nowFront = 5;
        //     } else if (X <= 0.6 && X >= -0.6 && Y <= 0.6 && Y >= -0.6 && Z <= 3.8) {
        //       deviceList[sensorTag.uuid].nowFront = 6;
        //     }
        //   } else {
        //     if (X <= 0.1 && X >= -0.1 && Y <= 0.1 && Y >= -0.1 && Z >= 0.9) {
        //       deviceList[sensorTag.uuid].nowFront = 1;
        //     } else if (X <= -0.9 && Y <= 0.1 && Y >= -0.1 && Z >= -0.1 && Z <= 0.1) {
        //       deviceList[sensorTag.uuid].nowFront = 2;
        //     } else if (X <= 0.1 && X >= -0.1 && Y >= 0.9 && Z <= 0.1 && Z >= -0.1) {
        //       deviceList[sensorTag.uuid].nowFront = 3;
        //     } else if (X <= 0.1 && X >= -0.1 && Y <= -0.9 && Z <= 0.1 && Z >= -0.1) {
        //       deviceList[sensorTag.uuid].nowFront = 4;
        //     } else if (X >= 0.9 && Y <= 0.1 && Y >= -0.1 && Z >= -0.1 && Z <= 0.1) {
        //       deviceList[sensorTag.uuid].nowFront = 5;
        //     } else if (X <= 0.1 && X >= -0.1 && Y <= 0.1 && Y >= -0.1 && Z <= -0.9) {
        //       deviceList[sensorTag.uuid].nowFront = 6;
        //     }

        //   }
        //   // console.log(++sample, sensorTag.uuid + ':\tx = %d G', x.toFixed(1), '\ty = %d G', y.toFixed(1), '\tz = %d G', z.toFixed(1));

        //   //一回目目のセンシング
        //   if (deviceList[sensorTag.uuid].beforeFront == "") {
        //     io.sockets.emit("acceledata", { nowFront: deviceList[sensorTag.uuid].nowFront, sensorIdNumber: deviceList.indexOf(sensorTag.uuid) });
        //   }
        //   if (deviceList[sensorTag.uuid].beforeFront != deviceList[sensorTag.uuid].nowFront) {
        //     // console.log(sensorTag.uuid + ":今=" + deviceList[sensorTag.uuid].nowFront + "前=" + deviceList[sensorTag.uuid].beforeFront);
        //     io.sockets.emit("acceledata", { nowFront: deviceList[sensorTag.uuid].nowFront, sensorIdNumber: deviceList.indexOf(sensorTag.uuid) });
        //   }
        //   deviceList[sensorTag.uuid].beforeFront = deviceList[sensorTag.uuid].nowFront;
      }
      });

      sensorTag.setAccelerometerPeriod(accele_interval, function (error) {
        setTimeout(callback, 2000);
        // console.log('notifyAccelerometer');
        // sensorTag.notifyAccelerometer(function (error) {
        //   // setTimeout(function () {
        //     console.log('unnotifyAccelerometer');
        //     sensorTag.unnotifyAccelerometer(callback);
        //   // }, 5000);
        // });
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
 

        if (bufferGyro[0].length != 100) {
          preparatioSensor(bufferGyro, aveGyro, x, y, z, 100);
        }else{

          console.log("処理前 X: " + x + " Y: " + y + " Z: " + z);
          console.log("平均 X: " + aveGyro[0] + " Y: " + aveGyro[1] + " Z: " + aveGyro[2]);
          var adjust = calibrationSensor(aveGyro,x, y, z);
          var X = x - aveGyro[0] + adjust[0];
          var Y = y - aveGyro[1] + adjust[1];
          var Z = z - aveGyro[2] + adjust[2];

          console.log("処理後 X: " + X + " Y: " + Y + " Z: " + Z);

        }
        // console.log(aveGyro);
        // console.log("X:" + X);
        //         console.log("Y:" + Y);
        //         console.log("Z:" + Z);

        // console.log('\tx = %d °/s', x-aveX);
        // console.log('\ty = %d °/s', y-aveY);
        // console.log('\tz = %d °/s', z-aveZ);
        //angle +=  Z * gyro_interval;

        // var temp;
        // switch (deviceList[sensorTag.uuid].nowFront) {
        //   case 2:
        //     temp = -X;
        //     X = Z;
        //     Z = temp;
        //     break;
        //   case 3:
        //     temp = Y;
        //     Y = Z;
        //     Z = temp;
        //     break;
        //   case 4:
        //     temp = -Y;
        //     Y = Z;
        //     Z = temp;
        //     break;
        //   case 5:
        //     temp = X;
        //     X = -Z;
        //     Z = temp;
        //     break;
        //   case 6:
        //     Z = -Z;
        //     break;
        // }

        deviceList[sensorTag.uuid].gyro += gyro_interval;
        // angleCalculateGyro(X,  0);
        // angleCalculateGyro(Y,  1);
        // angleCalculateGyro(Z,  2);
        // io.sockets.emit("gyrodata", { angle: angle, sensorIdNumber: deviceList.indexOf(sensorTag.uuid) });
        // console.log("X: " + X + " Y:" + Y  + " Z: " + Z);
        // console.log("X: " +  Math.abs(X - aveX) + " Y:" +  Math.abs(Y - aveY) + " Z: " +  Math.abs(Z - aveZ));
        // io.sockets.emit("gyrodata", { X: Math.abs(X - aveX), Y: Math.abs(Y - aveY), Z: Math.abs(Z-aveZ)});
        // console.log("回った角度:" + angle + " id:" + deviceList.indexOf(sensorTag.uuid));
        // console.log("soto", angle);



      });

      console.log('setGyroscopePeriod');
      sensorTag.setGyroscopePeriod(gyro_interval, function (error) {
        console.log('notifyGyroscope');
        sensorTag.notifyGyroscope(function (error) {
          // setTimeout(function() {
          //   console.log('unnotifyGyroscope');
          // sensorTag.unnotifyGyroscope(callback);
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
  function angleCalculateGyro(gyro, axis) {

    // angle[axis] += gyro * gyro_interval;  
    // console.log("first:", angle);  
    if (pregyro[axis] == 0) {
      angle[axis] += gyro * gyro_interval / 2;
    } else {
      angle[axis] += (parseInt(pregyro[axis]) + parseInt(gyro)) * gyro_interval / 2;
    }
    pregyro[axis] = gyro;


    if (deviceList[sensorTag.uuid].gyro == 1000) {

      angle[axis] = (angle[axis] / 1000);
      if (-2 < angle[axis] && angle[axis] < 2) {
        angle[axis] = 0;
      }
      if (Math.abs(angle[2]) > 5) {
        io.sockets.emit("gyrodata2", { angle: angle, axis: axis, sensorIdNumber: deviceList.indexOf(sensorTag.uuid) });
      }
      // console.log(angle);

      // console.log("naka:" + angle[axis]);
      pregyro[axis] = 0;
      if (axis == 2) {
        deviceList[sensorTag.uuid].gyro = 0;
      }
    }

    if (array[axis].length < 10) {
      array[axis].push(gyro);
    } else {
      array[axis].push(array[axis][9] * 0.9 + gyro * 0.1);
      array[axis].shift();
      // console.log(axis + ":" + array[axis]);
      // console.log("soto:" + angle[axis]);
    }
  }
}

// SensorTag.discover(onDiscover);
SensorTag.discoverAll(onDiscover);



function createTwoDimensionalArray(array, average) {
  for (var i = 0; i < array.length; i++) {
    array[i] = [];
  }
}
function preparatioSensor(array, average, X, Y, Z, interval) {
  if (array[0].length < interval) {
    array[0].push(X);
    array[1].push(Y);
    array[2].push(Z);
  }
  // console.log("X: " + X);
  // console.log("Y: " + Y);
  // console.log("Z: " + Z);
  if (array[0].length == interval) {
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < interval; j++) {
        average[i] += array[i][j];
      }
    }
    average[0] = average[0] / interval;
    average[1] = average[1] / interval;
    average[2] = average[2] / interval;
    // console.log(average);
  }
}
function calibrationSensor(average, X, Y, Z){
  // console.log("処理前 X: " + x + " Y: " + y + " Z: " + z);
  // console.log("平均 X: " + average[0] + " Y: " + average[1] + " Z: " + average[2]);
var adjust = [0,0,0];
  var max = Math.max(Math.abs(average[0]), Math.abs(average[1]), Math.abs(average[2]));
  var axis = Math.max(average.indexOf(max), average.indexOf(-max));
  adjust[axis] = 1;
  return adjust;
  // var axis = [0,0,0];
  // for(var i = 0; i < aveAccele.length; i++){
  //   var max=0;
  //   if (max < Math.abs(aveAccele[i])){
  //     max = Math.abs(aveAccele[i]);
  //     axis[i] = i;
  //   }
  // }
}
