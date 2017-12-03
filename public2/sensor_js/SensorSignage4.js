var socket = io.connect(location.origin);

$(function() {
  socket.on("now_state", function(data) {
    if(data == 6){
    document.location.href = "http://localhost/sensor/Sensor1.html";
  }
  });

});
