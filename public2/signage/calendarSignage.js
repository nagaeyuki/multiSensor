var socket = io.connect(location.origin);

var dates = 0;
var month = 0;
var num = 0;
var number = 0;

var connect = 1;
var check = 1;
// var urlTransition = ["https://iothis.aitech.ac.jp/signage/mainSignage.html",
//  "https://iothis.aitech.ac.jp/DigitalSignage2.html"];


$(function() {
    //CSVファイルを読み込む関数getCSV()の定義
    function getCSV() {
        var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
        req.open("get", "../csv/courseData2017.csv", true); // アクセスするファイルを指定
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
        var flag = false;
        for (var i = 1; i < result.length - 1; i++) {
            var monthNumber = getMonth(result, i);

            // var insert = $('<ul style="list-style-type:none">').addClass("item");
            // for (var j = 3; j < 7; j++) {
            //     var newLi = $('<li>').text(result[0][j]);
            //     insert.append(newLi);
            // }

            var insertUl = $('<ul style="list-style-type: none">').attr('id', 'csvid' + result[i][0]).addClass("line");;
            for (var j = 3; j < 7; j++) {
                // liタグを生成してテキスト追加
                var newLi2 = $('<li>').text(result[i][j]);
                if (j == 4) {
                    newLi2.addClass("name");
                }
                // insertに生成したliタグを追加
                insertUl.append(newLi2);
            }
            if (monthNumber == getMonth(result, i - 1)) {
                $('#csvid' + result[i - 1][0]).after(insertUl);
              //  $('#csvid' + result[i - 1][0]).after(insert);
            } else {
                $("#c" + monthNumber).after(insertUl);
                //$("#c" + monthNumber).after(insert);
            }
        }
    }
    getCSV(); //最初に実行される
    console.log("start");


flag = false;
    //日付を押したときの処理
    socket.on("dateCalendarFromServer", function(data) {

        var dates = data.dateNum;

        var th = $("#csvid"+dates.dateText).position();
        var sh = $(".scroll").scrollTop();
        var pos = th.top + sh + 1;
        $(".scroll").animate({
            scrollTop: pos
        }, "slow", "swing");

        if(flag){
        $("#csvid"+selectArea).css("background-color","#d6eaff");
        selectArea = dates.dateText;
      }else{
        selectArea = dates.dateText;

        flag = true;
      }

      $("#csvid"+dates.dateText).css("background-color","#BCDDFF");
    });

    var pos = $("#c4").position();
    $(".scroll").scrollTop(pos.top + 1);

    socket.on("ChangeMonthFromServer", function(data) {
        month = data.monthNum;
        var target = "#c" + month;
        var th = $(target).position();
        var sh = $(".scroll").scrollTop();
        var pos = th.top + sh + 1;
        $(".scroll").animate({
            scrollTop: pos
        }, "slow", "swing");
        console.log(month);
    });

    socket.on("ReturnFromServer", function(data) {
        document.location.href = "http://" + IpAddress + "/signage/mainSignage.html";
        console.log("Restart");
    });

    socket.on("Restart", function(data) {
        document.location.href = "http://" + IpAddress + "/DigitalSignage2.html";
        console.log("mainRestart");
    });

    //接続解除命令が来た時
    socket.on("ConnectStop", function(data) {
        document.location.href = "http://" + IpAddress + "/DigitalSignage2.html";
    });


    moveArrow();
});


function getMonth(result, i) {
    //csvの時期欄から何月の予定かをmonthNumberに格納
    switch (result[i][3].indexOf("月")) {
        case 1:
            return result[i][3].substr(0, 1);
        case 2:
            return result[i][3].substr(0, 2);
        case -1:
            return -1;
    }
}

function moveArrow() {
    $("#arrow")
        .animate({
            'margin-left': '70px',
        }, 2000)
        .animate({
            opacity: 0
        }, 500)
        .animate({
            'margin-left': '120px',
            opacity: 1
        }, 0);
    setTimeout(moveArrow, 1500); //アニメーションを繰り返す間隔
}
