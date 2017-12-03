
var socket = io.connect(location.origin);
var IpAddress;
socket.emit("IpAddress");

socket.on("IpAddress", function(address){
  IpAddress = address;
    console.log(IpAddress);
});
