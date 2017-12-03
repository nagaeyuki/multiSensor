var socket = io.connect('/');
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
// var grayImage=document.getElementById('grayImage');
// var imageCanvas=document.getElementById('imageCanvas');
// var imagectx=imageCanvas.getContext('2d');
// var grayctx=grayImage.getContext('2d');
var distance = document.getElementById('distance');
var state = document.getElementById('state');
var range = document.getElementById('range');
//var approach = document.getElementById('approach');
var target = document.getElementById('target');
var zero = document.getElementById('zero');
var one = document.getElementById('one');
var two = document.getElementById('two');
var three = document.getElementById('three');
var four = document.getElementById('four');
var five = document.getElementById('five');
var bodyNumbertext = document.getElementById('bodyNumbertext');
var img_0 = document.getElementById('img_0');
var img_1 = document.getElementById('img_1');
var img_2 = document.getElementById('img_2');
var img_3 = document.getElementById('img_3');
var img_4 = document.getElementById('img_4');
var img_5 = document.getElementById('img_5');
var gray = document.getElementById('gray');
//var averageText = document.getElementById('averageList');

//depth
var imageProcessing = false;
var imageWorkerThread = new Worker("js/GrayscaleImageWorker.js");

socket.emit("max", max);
socket.emit("min", min);
$(function() {
  $('#exec').click(function() {
    min = $('#min').val();
    max = $('#max').val();
    //middle = $('#middle').val();
    socket.emit("max", max);
    socket.emit("min", min);
    console.log(min);
  })
});

imageWorkerThread.addEventListener("message", function(event) {
  if (event.data.message === 'imageReady') {
    ctx.putImageData(event.data.imageData, 0, 0);
    imageProcessing = false;
  }
});

imageWorkerThread.postMessage({
  "message": "setImageData",
  "imageData": ctx.createImageData(canvas.width, canvas.height)
});

socket.on('depthFrame', function(imageBuffer) {
  if (!imageProcessing) {
    imageProcessing = true;
    imageWorkerThread.postMessage({
      "message": "processImageData",
      "imageBuffer": imageBuffer
    });
  }
});

var colors = ['red.png', 'green.png', 'blue.png', 'yellow.png', 'lightblue.png', 'pink.png']
var frame = 30;
//var middle = 90;
var min = 80; //表示切替をする距離
var max = 200;
var move = 40;
var flag = false;
//var count = 0;
var listX = [0, 1, 2, 3, 4, 5];
for (var y = 0; y < listX.length; y++) {
  listX[y] = [];
}
var listZ = [0, 1, 2, 3, 4, 5];
for (var y = 0; y < listZ.length; y++) {
  listZ[y] = [];
}
var bodyNumber = 0;
var sum = 0;
var averageList = [0, 1, 2, 3, 4, 5];
for (var y = 0; y < averageList.length; y++) {
  averageList[y] = [];
}
var averageList2 = [];
var targetNumber;
var recognition = "";


socket.on('bodyFrame', function(bodyFrame) {
  //ctx.clearRect(0, 0, canvas.width, canvas.height);
  var index = 0;
  var bodyNumberList = [];


  bodyFrame.bodies.forEach(function(body) {
    if (body.tracked) {
      flag = true;
      bodyNumber = body.bodyIndex;

      if (bodyNumberList.indexOf(bodyNumber) == -1) {
        bodyNumberList.push(bodyNumber);
        //console.log("1:" + bodyNumberList);
      }

      var SpineMidZ = Math.floor(bodyFrame.bodies[bodyNumber].joints[1].cameraZ * 100);
      // var SpineMidY = Math.floor(bodyFrame.bodies[bodyNumber].joints[1].cameraY * 100);
      // var SpineMidX = Math.floor(bodyFrame.bodies[bodyNumber].joints[1].cameraX * 100);
      var SpineMidY = Math.floor(bodyFrame.bodies[bodyNumber].joints[1].depthY * 100);
      var SpineMidX = Math.floor(bodyFrame.bodies[bodyNumber].joints[1].depthX * 100);

      listZ[bodyNumber].push(SpineMidZ);
      listX[bodyNumber].push(SpineMidX);


      if (listZ[bodyNumber].length == frame + 1) {
        listZ[bodyNumber].shift();
        listX[bodyNumber].shift();
      }
      // updateHandState(body.leftHandState, body.joints[7]);
      // updateHandState(body.rightHandState, body.joints[11]);
      index++;

    }
    //count = 0;

  });

  //配列の長さが1短い
  if (targetNumber != null && listZ[targetNumber].length == frame) {
    distance.innerHTML = listZ[targetNumber][frame - 1];
    //if (min < SpineMidZ && SpineMidZ < max) {
    //var ratio = 1 - (SpineMidZ - min) / (max - min);
    var ratio = 1 - (listZ[targetNumber][frame - 1] - min) / (max - min);
    if (listZ[targetNumber][frame - 1] <= min) {
      //�����~�܂��Ă����Ȃ�
      if (Math.abs(listZ[targetNumber][0] - listZ[targetNumber][frame - 1]) < move) {
        state.innerHTML = "stop";
        range.innerHTML = "true";
        // approach.innerHTML = "stop";
        if (recognition != "stop") {
          socket.emit("stop");
        }
        recognition = "stop";
        socket.emit("distancedata", listZ[targetNumber][frame - 1]);

        // if (bodyNumber == targetNumber) {
        //   $('#img_' + bodyNumber).css({
        //     opacity: 1,
        //     top: bodyFrame.bodies[bodyNumber].joints[1].depthY * canvas.height - 230,
        //     left: bodyFrame.bodies[bodyNumber].joints[1].depthX * canvas.width - 250,
        //     width: $('#gray').width(),
        //     height: $('#gray').height()
        //   });
        //
        //   $('#gray').css({
        //     opacity: 0
        //   });
        // }

      }

    } else if (min < listZ[targetNumber][frame - 1] && listZ[targetNumber][frame - 1] <= max) {
      state.innerHTML = "move";
      range.innerHTML = "true";
      //approach.innerHTML = "move";
      if (recognition != "move") {
        socket.emit("move");
      }
      recognition = "move";

      socket.emit("distance", listZ[targetNumber][frame - 1]);

      //console.log("2:" + bodyNumberList);
      bodyNumberList.forEach(function(number) {
        if (number == targetNumber) {
          //console.log(number);
          $('#img_' + number).css({
            opacity: 0.5,
            top: bodyFrame.bodies[number].joints[1].depthY * canvas.height - 230,
            left: bodyFrame.bodies[number].joints[1].depthX * canvas.width - 250,
            width: $('#gray').width() * ratio,
            height: $('#gray').height() * ratio,
            margin: ($('#gray').height() / 2 - $('#gray').height() / 2 * ratio)
          });
          //console.log($('#gray_'+index).height() / 2);
          $('#gray').css({
            opacity: 0.5,
            top: bodyFrame.bodies[number].joints[1].depthY * canvas.height - 230,
            left: bodyFrame.bodies[number].joints[1].depthX * canvas.width - 250,
            margin: 0
          });
        } else {
          $('#img_' + number).css({
            // margin: '',
            opacity: 1,
            width: $('#gray').width() / 2,
            height: $('#gray').height() / 2,
            top: bodyFrame.bodies[number].joints[1].depthY * canvas.height - 290,
            left: bodyFrame.bodies[number].joints[1].depthX * canvas.width - 290,


          });
        }
      });

    } else if (listZ[targetNumber][frame - 1] > max) {
      range.innerHTML = "false";
      state.innerHTML = "none";
      // approach.innerHTML = "none";
      if (recognition != "none") {
        socket.emit("none");
      }
      recognition = "none";
    }

    listZ[targetNumber].shift();
    listX[targetNumber].shift();
  }
  //�������牺�͔z���̒�����44�ɂȂ��Ă���

  bodyNumbertext.innerHTML = bodyNumberList;

  for (var i = 0; i < bodyNumberList.length; i++) {
    for (var j = 0; j < listZ[bodyNumberList[i]].length; j++) {
      sum += listZ[bodyNumberList[i]][j];
    }
    averageList[bodyNumberList[i]] = Math.floor(sum / listZ[bodyNumberList[i]].length);
    sum = 0;
  }

  for (var i = 0; i < 6; i++) {
    if (bodyNumberList.indexOf(i) == -1) {
      averageList[i] = [];
      listZ[i] = [];
      $('#img_' + i).css({
        opacity: 0
      });
    } else {
      averageList2.push(averageList[i]);
    }
  }
  var minimum = Math.min.apply(null, averageList2);
  for (var i = 0; i < averageList.length; i++) {
    if (minimum == averageList[i]) {
      targetNumber = i;
      target.innerHTML = targetNumber;
    }
  }
  target.innerHTML = targetNumber;
  for (var i = 0; i < 6; i++) {
    if (bodyNumberList.indexOf(i) == -1) {
      switch (i) {
        case 0:
          zero.innerHTML = [];
          break;
        case 1:
          one.innerHTML = [];
          break;
        case 2:
          two.innerHTML = [];
          break;
        case 3:
          three.innerHTML = [];
          break;
        case 4:
          four.innerHTML = [];
          break;
        case 5:
          five.innerHTML = [];
          break;
      }
    } else {
      switch (i) {
        case 0:
          zero.innerHTML = listZ[i];
          break;
        case 1:
          one.innerHTML = listZ[i];
          break;
        case 2:
          two.innerHTML = listZ[i];
          break;
        case 3:
          three.innerHTML = listZ[i];
          break;
        case 4:
          four.innerHTML = listZ[i];
          break;
        case 5:
          five.innerHTML = listZ[i];
          break;
      }

    }
  }

  //averageText.innerHTML = averageList;
  averageList2 = [];

});

// function SetTaegetImage(bodyNumber){
//                         $('#img_' + sampleNumber).css({
//                             opacity: 1,
//                             top: bodyFrame.bodies[targetNumber].joints[1].depthY * canvas.height - 230,
//                             left: bodyFrame.bodies[targetNumber].joints[1].depthX * canvas.width - 250,
//                             width: $('#gray_'+sampleNumber).width(),
//                             height: $('#gray_'+sampleNumber).height()
//                           })
//                           $('#gray_'+sampleNumber).css({
//                             opacity: 0
//                           })
//
//                     }
//                   }


setInterval(function() {
  if (flag) {
    flag = false;
  } else {
    for (var i = 0; i < 6; i++) {
      listZ[i] = [];
      listX[i] = [];
      $('#img_' + i).css({
        opacity: '0'
      });

    }

    targetNumber = null;
    if (recognition != "none") {
      socket.emit("none");
    }
    recognition = "none";
    $('#gray').css({
      opacity: '0'
    });

    // $('#gray').css({
    //   opacity: '0'
    // });
    // $('#img_0').css({
    //   opacity: '0'
    // });

  }
}, 1000);
