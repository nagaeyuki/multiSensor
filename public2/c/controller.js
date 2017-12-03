var socket = io.connect(location.origin);

var roomID;
var flag;
var test = 1;
var test2 = 1;
var connection = 0;
var connection2 = 0;
var testTimer;

$(function () {
    
    
    $("#Button1").hide();
    $("#Button2").hide();
    $("#Button3").hide();
    $("#Button4").hide();
    $("#Release").hide();
    
    
    if (window.confirm("ペアリングページに移動します")) {
        //window.alert('OKです'); // 警告ダイアログを表示
        socket.emit("ConnectOK");
    } else {
        //window.alert('キャンセルされました'); // 警告ダイアログを表示
        socket.emit("ConnectNG");
        //$("#roomID").hide();
        //$("#pairingButton").hide();
        connection2 = 1;
        history.back();
    }
    
    
    // ボタンクリック
    $("#pairingButton").click(function () {
        test = 2;
        //roomID = $("#roomID").val();
        //$(this).text((new Date()).toLocaleString());
        //alert(roomID);
        
        //console.log(test);
        roomID = $("#roomID").val();
        startPairing();
    });
    
    
    socket.on("failPairing", function (data) {
        test = 1;
        
        console.log(test);
	
	//alert("ペアリングコードが違います");
	
    });
    
    
    // ペアリングに成功
    socket.on("pairingOK", function (data) {
        //test2 = data.testNum;
        
        console.log(test);
        
        if (test == 2) {
            
            $("#roomID").hide();
            $("#pairingButton").hide();
            $("#Button1").show();
            $("#Button2").show();
            $("#Button3").show();
            $("#Button4").show();
            $("#Release").show();
            
            showControllWindow();
        }
			
        //$("#pairingIDText").text("Paring ID:" + roomID);
    });
    
    
    // PCとのペアリングに失敗
    /*socket.on("failPairingWithPC", function () {
        $("#pairingButton").show();
        //$("#paringMessage").hide();
    });*/

    // debug
    //socket.emit("pairingFromController", {
    //    "roomID": 1
    //});

    //$("#room")
    function startPairing() {
        //$("#pairingButton").hide();
        //$("#paringMessage").hide();
        
        socket.emit("pairingFromController", { "roomID": roomID });
        console.log(roomID);
    }
    
    
    function showControllWindow() {
        $("#Button1").click(function () {
            socket.emit("catalogFromController1");
            console.log("button1");
        });
        
        $("#Button2").click(function () {
            socket.emit("catalogFromController2");
            console.log("button2");
        });
        
        $("#Button3").click(function () {
            socket.emit("catalogFromController3");
            console.log("button3");
        });
        
        /*$("#Button4").click(function() {
            socket.emit("catalogFromController4");
            console.log("button4");
          });*/
		  
		  $("#Release").click(function () {
            test = 1;
            socket.emit("FlagReset");
            console.log("flag");
        });
    }
    
    
    
    testTimer = setInterval(function () {
        if (connection == 0) {
            /*if(window.confirm("繋がってます？")){
				//window.alert('OKです'); // 警告ダイアログを表示
				//socket.emit("ConnectOK");
				console.log("OKOK");
			} else{
				//window.alert('キャンセルされました'); // 警告ダイアログを表示
				socket.emit("FlagReset");
				socket.disconnect();
				connection++;
				//window.close();
				//history.back();
			}*/
			socket.emit("ConfirmTest");
            /*myRet = confirm("繋がってますか？");

			if(myRet == true){
				console.log("OKOK");
				socket.emit("ConnectNow");
			}else{
				socket.emit("FlagReset");
				socket.disconnect();
				connection++;     
			}*/
			alert("繋がってますかー？");
            socket.emit("ConnectNow");
            console.log("OOOOO");
        }

    }, 100000);
    
    
    socket.on("ConnectEnd", function (data) {
        //window.open('about:blank','_self').close();
        connection = 1;
        clearInterval(testTimer);
        console.log("ConnectEnd2");
    });
    
    /*socket.on("ConnectEnd2", function (data) {
        console.log("ConnectEnd3");
        //window.open('about:blank','_self').close();
        clearInterval(testTimer);
        socket.disconnect();
    });*/
  
});
