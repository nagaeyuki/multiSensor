var socket = io.connect(location.origin);

var num = 0;
var topPos = 0;
var leftPos = 0;

var connect = 1;
var check = 1;

// var urlTransition = ["https://iothis.aitech.ac.jp/signage/mainSignage.html",
//  "https://iothis.aitech.ac.jp/DigitalSignage2.html"];

$(function() {

    $('html,body').offset({
        top: -190,
        left: -350
    });

    //CSVファイルを読み込む関数getCSV()の定義
    function getCSV() {
        var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
        req.open("get", "../csv/kyujinTest.csv", true); // アクセスするファイルを指定
        req.send(null); // HTTPリクエストの発行

        // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ
        req.onload = function() {
            convertCSVtoArray(req.responseText); // 渡されるのは読み込んだCSVデータ
        }
    }

    // 読み込んだCSVデータを二次元配列に変換する関数convertCSVtoArray()の定義
    function convertCSVtoArray(str) { // 読み込んだCSVデータが文字列として渡される
        var result = []; // 最終的な二次元配列を入れるための配列
        var tmp = str.split("\n"); // 改行を区切り文字として行を要素とした配列を生成

        // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
        for (var i = 0; i < tmp.length; ++i) {
            result[i] = tmp[i].split(',');
        }

        for (var i = 1; i <= 80; i++) {

            //$(".kyujin" + i).text(result[i][1]);
            //$(".kyujin" + i).append($("<img/>").attr({ "src": "../picture/pin005.png" }));
            // $("img").attr('id', 'img'+i);
            //$("img").addClass("img");

            $(".kyujin" + i).append('<h1>' + result[i][1] + '</h1>');
            $('h1').addClass("company");
            $(".detail" + i).append('<p>' + result[i][2] + '</p>');
            $(".detail" + i).append('<p>' + result[i][3] + '</p>');
            $(".detail" + i).append('<p>' + result[i][4] + '</p>');
            $(".detail" + i).append('<p>' + result[i][5] + '</p>');
            $(".detail" + i).append('<p>' + result[i][6] + '</p>');
            $(".detail" + i).append('<p>' + result[i][7] + '</p>');
            $(".kyujin" + i).append('<h2>コントローラのURLボタンで企業のホームページを見られます</h2>');
            $('h2').addClass("urlText");


            if (result[i][9] == 1) {
                $(".kyujin" + i).append('<p>キャリアセンターにパンフレットあります</p>');
                $('p:last').addClass("text");
            }
        }
    }

    //console.log("ok");
    getCSV(); //最初に実行される


    socket.on("kyujinSelectFromServer", function(data) {
        num = data.selectNum;
        console.log(num);
        selectCheck(num);
    });

    function selectCheck() {
        var off = $('.kyujin' + num).offset();
        topPos = off.top - 50;
        leftPos = off.left - 200;
        console.log("top:" + topPos + "left:" + leftPos);
        $('html,body').animate({
            scrollTop: topPos + "px",
            scrollLeft: leftPos + "px"
        }, 2000, "swing");
    }

    socket.on("ReturnFromServer", function(data) {
        document.location.href = "http://" + IpAddress + "/signage/mainSignage.html";
        console.log("Restart");
    });

    socket.on("Restart", function(data) {
        document.location.href = "http://" + IpAddress + "/DigitalSignage2.html";
        console.log("mainRestart");
    }); //接続解除命令が来た時    socket.on("ConnectStop", function (data) {        window.location.href = urlTransition[1];    });

    moveArrow2();

    function moveArrow2() {
        $("#arrow")
            .animate({
                'margin-left': '-50px',
            }, 2000)
            .animate({
                opacity: 0
            }, 500)
            .animate({
                'margin-left': '0px',
                opacity: 1
            }, 0);
        setTimeout(moveArrow2, 1500); //アニメーションを繰り返す間隔
    }

});
