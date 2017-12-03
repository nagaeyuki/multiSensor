var socket = io.connect(location.origin);

var test = 0;
var courseNum = 0;
var courseName = new Array(10);
var season = new Array(10);
var time = new Array(10);
var place = new Array(10);
var content = new Array(10);
var start = 0;
var end = 0;
var seasonItem = "時期:   ";
var timeItem = "時間:   ";
var placeItem = "場所:   ";
var contentItem = "内容:   <br/>";

var connect = 1;
var check = 1;

var urlTransition = ["http://localhost:5000/signage/mainSignage.html"];

$(function () {

	$(".courseSignage").hide();
	$(".courseDetailSignage").show();
	


	var dt = new Date();
	//var month = dt.getMonth()+1;
	//var date = dt.getDate();
	var month = 6;
	var date = 1;


	//CSVファイルを読み込む関数getCSV()の定義
    function getCSV(){
        var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
        req.open("get", "../csv/course_2016.csv", true); // アクセスするファイルを指定
        req.send(null); // HTTPリクエストの発行

        // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ
        req.onload = function(){
    	convertCSVtoArray(req.responseText); // 渡されるのは読み込んだCSVデータ
        }
    }

    // 読み込んだCSVデータを二次元配列に変換する関数convertCSVtoArray()の定義
    function convertCSVtoArray(str){ // 読み込んだCSVデータが文字列として渡される
        var result = []; // 最終的な二次元配列を入れるための配列
        var tmp = str.split("\n"); // 改行を区切り文字として行を要素とした配列を生成

        // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
        for(var i=0;i<tmp.length;++i){
            result[i] = tmp[i].split(',');
        }

		courseSelect();
		console.log("a:"+ start + "b:" + end);
		
		// ulタグを生成してinsertに追加
		var insert = $('<ol>').addClass('list');
 
		for(var i = start; i <= end; i++) {
        // liタグを生成してテキスト追加
        var newLi = $('<li>').text(result[i][3]+" "+" "+" "+" "+"時期："+result[i][4]);
        // insertに生成したliタグを追加
            insert.append(newLi);
        }
        
      
        for (var i = 0; i < 10; i++) {
            courseName[i] = result[start + i][3];
            season[i] = result[start + i][4];
            content[i] = result[start + i][5];
			place[i] = result[start + i][6];
			time[i] = result[start + i][7];
            //console.log(time[i]);
        }

 
    // insertを#sample内に追加
		$('.courseSignage').append(insert);
    }
	
	function courseSelect() {
		switch(month) {
		case 4:
		case 5:
			start = 1;
			end = 10;
			break;
		case 6:
			start = 3;
			end = 12;
			break;
		case 7:
			start = 5;
			end = 14;
			break;
		case 8:
		case 9:
		case 10:
			start = 8;
			end = 17;
			break;
		case 11:
			start = 9;
			end = 18;
			break;
		case 12:
			if(date == 1) {
				start = 10;
				end = 19;
				break;
			} else {
				start = 11;
				end = 20;
				break;
			}
		case 1:
			start = 13;
			end = 21;
			break;
		case 2:
			start = 14;
			end = 21;
			break;
		case 3:
			start = 18;
			end = 21;
			break;
		}
	}

	console.log("できてます");
    getCSV(); //最初に実行される




	socket.on("courseNumberFromServer", function (data) {
        courseNum = data.courseNum;
		
		$(".courseSignage").hide();
		$(".courseDetailSignage").show();
		
		if(test == 0) {
            switch (courseNum) {
                case 1: detail1();
				test = 1;
				console.log("case1");
				break;
			case 2: detail2();
				test = 1;
				console.log("case2");
				break;
			case 3: detail3();
				test = 1;
				console.log("case3");
				break;
			case 4: detail4();
				test = 1;
				break;
			case 5: detail5();
				test = 1;
				break;
			case 6: detail6();
				test = 1;
				break;
			case 7: detail7();
				test = 1;
				break;
			case 8: detail8();
				test = 1;
				break;
			case 9: detail9();
				test = 1;
				break;
			case 10: detail10();
				test = 1;
				break;
			}
		}
	});
	
	socket.on("courseReturnFromServer", function (data) {
		window.location.href = urlTransition[0];
	});

	socket.on("courseBeforeFromServer", function (data) {
		test = 0;
		$(".courseSignage").show();
		$(".courseDetailSignage").hide();
	});
	
	socket.on("Restart", function (data) {
		window.location.href = urlTransition[0];
	});
	
	
	//接続解除命令が来た時
	socket.on("ConnectCut", function (data) {
        if (connect == 1) {
            socket.emit("EndConnect");
            window.location.href = urlTransition[0];
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
	
	
	function detail1() {
        $("#courseName").text(courseName[0]);
        $("#season").text(seasonItem+season[0]);
		$("#time").text(timeItem+time[0]);
		$("#place").text(placeItem+place[0]);
        $("#content").html(contentItem+content[0]);
	}
	function detail2() {
        $("#courseName").text(courseName[1]);
		$("#season").text(seasonItem+season[1]);
		$("#time").text(timeItem+time[1]);
		$("#place").text(placeItem+place[1]);
        $("#content").html(contentItem+content[1]);
	}
	function detail3() {
        $("#courseName").text(courseName[2]);
        $("#season").text(seasonItem+season[2]);
		$("#time").text(timeItem+time[2]);
		$("#place").text(placeItem+place[2]);
        $("#content").html(contentItem+content[2]);
	}
	function detail4() {
        $("#courseName").text(courseName[3]);
        $("#season").text(seasonItem+season[3]);
		$("#time").text(timeItem+time[3]);
		$("#place").text(placeItem+place[3]);
        $("#content").html(contentItem+content[3]);
	}
	function detail5() {
        $("#courseName").text(courseName[4]);
        $("#season").text(seasonItem+season[4]);
		$("#time").text(timeItem+time[4]);
		$("#place").text(placeItem+place[4]);
        $("#content").html(contentItem+content[4]);
	}
	function detail6() {
        $("#courseName").text(courseName[5]);
        $("#season").text(seasonItem+season[5]);
		$("#time").text(timeItem+time[5]);
		$("#place").text(placeItem+place[5]);
        $("#content").html(contentItem+content[5]);
	}
	function detail7() {
        $("#courseName").text(courseName[6]);
        $("#season").text(seasonItem+season[6]);
		$("#time").text(timeItem+time[6]);
		$("#place").text(placeItem+place[6]);
        $("#content").html(contentItem+content[6]);
	}
	function detail8() {
        $("#courseName").text(courseName[7]);
        $("#season").text(seasonItem+season[7]);
		$("#time").text(timeItem+time[7]);
		$("#place").text(placeItem+place[7]);
        $("#content").html(contentItem+content[7]);
	}
	function detail9() {
        $("#courseName").text(courseName[8]);
        $("#season").text(seasonItem+season[8]);
		$("#time").text(timeItem+time[8]);
		$("#place").text(placeItem+place[8]);
        $("#content").html(contentItem+content[8]);
	}
	function detail10() {
        $("#courseName").text(courseName[9]);
        $("#season").text(seasonItem+season[9]);
		$("#time").text(timeItem+time[9]);
		$("#place").text(placeItem+place[9]);
	    $("#content").html(contentItem+content[9]);
	}
});