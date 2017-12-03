//var roomID = Math.floor(Math.random() * 10000);
var roomID = 2650;
var socket = io.connect(location.origin);
var number = 0;

var test = 1;
var connect = 1;
var test2 = 1;

var connect = 1;
var check = 1;


var urlTransition = ["https://192.168.53.41:443/signage/mainSignage.html", "https://192.168.53.41:443/DigitalSignage2.html"];

// roomIDに入室
socket.emit("pairingFromSignage", { "roomID": roomID });


$(function () {
    
    //roomID = $("#roomID").val();
    //var roomID = 1234;
	console.log("1234");
    
    
    var elem = document.getElementById("pairingCode");
    elem.textContent = roomID;
    
    
    // サーバーからpairingSuccessというデータを受信
    socket.on("pairingSuccess", function (data) {
        loginSuccessHandler();
        test = 2;
        console.log(test);
    });
    
    socket.on("pairingFault", function (data) {
        
        if (test != 2) {
            socket.emit("pairingFaultFromSignage");
            console.log(test);
        }
    });
    
    socket.on("Restart", function (dataFromServer) {
        document.location.href = "http://iothis.aitech.ac.jp/DigitalSignage2.html";
    });
    
	//接続解除命令が来た時
	socket.on("ConnectCut", function (data) {
        if (connect == 1) {
            socket.emit("EndConnect");
            window.location.href = urlTransition[1];
            console.log("miss");
        }
        
        if (check = 2) {
            connect = 1;
            check = 1;
        } else {
            connect = 2;
            check = 2;
        }
    });
    
	//ユーザが反応して接続解除をやめさせる時
    socket.on("DontStop", function (data) {
        connect = 2;
    });



    function loginSuccessHandler() {
        //ペアリング完了した時の処理
        socket.emit("pairingSuccessFromSignage");
        //console.log(number);
        //テストページに遷移
        document.location.href = "https://iothis.aitech.ac.jp/signage/mainSignage.html";
        console.log("ペアリング完了しました");
        //console.log(roomID);
        //number = 1;
    }
    
});
