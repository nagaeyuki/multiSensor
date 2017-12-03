var socket = io.connect(location.origin);


$(function() {
  var preSelect = 0;
  // socket.on("select", function(data) {
  //   //console.log(data);
  //   //socket.emit("SendGyroStop");
  //   switch (Math.abs(data - preSelect)) {
  //     case 0:
  //       $('.mainSignage ul li').eq(data).css("border", "3px solid #ff0000");
  //       break;
  //     case 1:
  //
  //       $('.mainSignage ul li').eq(preSelect).css("border", "");
  //       $('.mainSignage ul li').eq(data).css("border", "3px solid #ff0000");
  //       break;
  //
  //     case 2:
  //       $('.mainSignage ul li').eq(preSelect).css("border", "");
  //       if (data > preSelect) {
  //         $('.mainSignage ul li').eq(preSelect + 1).css("border", "3px solid #ff0000");
  //         setTimeout(function() {
  //           $('.mainSignage ul li').eq(data - 1).css("border", "");
  //           $('.mainSignage ul li').eq(data).css("border", "3px solid #ff0000");
  //         }, 400);
  //       } else {
  //         $('.mainSignage ul li').eq(preSelect - 1).css("border", "3px solid #ff0000");
  //         setTimeout(function() {
  //           $('.mainSignage ul li').eq(data + 1).css("border", "");
  //           $('.mainSignage ul li').eq(data).css("border", "3px solid #ff0000");
  //         }, 400);
  //       }
  //       break;
  //     case 3:
  //       $('.mainSignage ul li').eq(preSelect).css("border", "");
  //       if (data > preSelect) {
  //         $('.mainSignage ul li').eq(preSelect + 1).css("border", "3px solid #ff0000");
  //         setTimeout(function() {
  //           $('.mainSignage ul li').eq(data - 2).css("border", "");
  //           $('.mainSignage ul li').eq(data - 1).css("border", "3px solid #ff0000");
  //         }, 400);
  //         setTimeout(function() {
  //           $('.mainSignage ul li').eq(data - 1).css("border", "");
  //           $('.mainSignage ul li').eq(data).css("border", "3px solid #ff0000");
  //         }, 800);
  //       } else {
  //         $('.mainSignage ul li').eq(preSelect - 1).css("border", "3px solid #ff0000");
  //         setTimeout(function() {
  //           $('.mainSignage ul li').eq(data + 2).css("border", "");
  //           $('.mainSignage ul li').eq(data - 1).css("border", "3px solid #ff0000");
  //         }, 400);
  //         setTimeout(function() {
  //           $('.mainSignage ul li').eq(data + 1).css("border", "");
  //           $('.mainSignage ul li').eq(data).css("border", "3px solid #ff0000");
  //         }, 800);
  //       }
  //       break;
  //     case 5:
  //       $('.mainSignage ul li').eq(preSelect).css("border", "");
  //       $('.mainSignage ul li').eq(data).css("border", "3px solid #ff0000");
  //   }
  //   preSelect = data;
  // });

  socket.on("now_state", function(data) {
    switch (data) {
      case 1:
        document.location.href = "http://localhost/sensor/SensorSignage1.html";
        break;
      case 2:
        document.location.href = "http://localhost/sensor/SensorSignage2.html";
        break;
      case 3:
        document.location.href = "http://localhost/sensor/SensorSignage3.html";
        break;
      case 4:
        document.location.href = "http://localhost/sensor/SensorSignage4.html";
        break;
      case 5:
        document.location.href = "http://localhost/sensor/SensorSignage5.html";
        break;
    }
  });

});
