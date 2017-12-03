

//var socket = io.connect(location.origin);
$(function() {
    // var off = $("#image1").offset();
    // var top = off.top + 150;
    // var left = off.left + 150;
    var max =200;
    var min =80;
    socket.on("max", function(data) {
        max = data;
    });
    socket.on("min", function(data) {
        min = data;
    });

    socket.on("stop", function(data) {
        var url = "http://" + IpAddress + "/controller/controller.html"
        var shortenurl = convertBitly(url);
        socket.emit("shortenurl", shortenurl);

        document.location.href = "http://" + IpAddress + "/DigitalSignage2.html";
    });
    socket.on("none", function(data) {
        $(function() {
            $('#image2').css({
                'width': '0px',
                'height': '0px'
            });
        });
    });
    socket.on("distance", function(distance) {
        //現在の距離に対する画像のパーセンテージ
        var ratio = 1 - (distance - min) / (max - min);
        console.log(ratio);
        console.log($('#image2').width());
        $(function() {
            $('#image2').css({
                'width': $('#image1').width() * ratio,
                'height': $('#image1').height() * ratio,
                'margin': $('#image1').height() / 2 - $('#image1').height() / 2 * ratio

            });
        });
        // var size = ($("#image1").width() - data) * 2;
        // var size2 = size / 2;
        // $(function () {
        //     $('#image2').css({
        //         'width': size, 'height': size
        //     });
        //     $('#image2').offset({ top: top - size2, left: left - size2 });
        // });
    });
});

function convertBitly(url) {
    //var apiKey = "R_89cee86d99a54f9e879ba510e0debf4b";
    //var login = "yuki0312";
    var acces_token = "6849994a494c2efa0e26747ab0bb557007a99658";
    var bitly = "https://api-ssl.bitly.com/v3/shorten?access_token=" + acces_token + "&longUrl=" + url;
    var xh = new XMLHttpRequest();
    xh.open("GET", bitly, false);
    xh.send();
    var obj = JSON.parse(xh.responseText);
    //var obj = xh.responseText;
    //  for (var i in obj.results){
    //      var shortenurl = obj.results[i].shortUrl;
    //  }
    return obj.data.url;
}

function getCSV() {
    var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
    req.open("get", "csv/event2.csv", true); // アクセスするファイルを指定
    req.send(null); // HTTPリクエストの発行
    // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ
    req.onload = function() {
        convertCSVtoArray(req.responseText); // 渡されるのは読み込んだCSVデータ
    };
}


// 読み込んだCSVデータを二次元配列に変換する関数convertCSVtoArray()の定義
function convertCSVtoArray(str) { // 読み込んだCSVデータが文字列として渡される
    var result = []; // 最終的な二次元配列を入れるための配列
    var tmp = str.split("\n"); // 改行を区切り文字として行を要素とした配列を生成

    // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
    for (var i = 0; i < tmp.length; ++i) {
        result[i] = tmp[i].split(',');
    }
    list_view(result);
}

function list_view(result) {
    var ul = document.getElementById('ul');
    ul.innerHTML = "";
    var li = "";
    for (var i = 1; i < result.length - 1; i++) {
        li = "<li>"
        for (var j = 0; j < result[i].length; j++) {
            li += result[i][j] + "<br>";
        }
        li += "</li>";
        ul.innerHTML += li;
        li = "";
    }
    switch_view();
}

function switch_view() {
    var $setElm = $('#viewer'),
        fadeSpeed = 1500,
        switchDelay = 7000;
    $setElm.each(function() {
        var targetObj = $(this);
        var findUl = targetObj.find('ul');
        var findLi = targetObj.find('li');
        var findLiFirst = targetObj.find('li:first');
        findLi.css({
            display: 'block',
            opacity: '0',
            zIndex: '99'
        });
        findLiFirst.css({
            zIndex: '100'
        }).stop().animate({
            opacity: '1'
        }, fadeSpeed);
        setInterval(function() {
            findUl.find('li:first-child').animate({
                opacity: '0'
            }, fadeSpeed).next('li').css({
                zIndex: '100'
            }).animate({
                opacity: '1'
            }, fadeSpeed).end().appendTo(findUl).css({
                zIndex: '99'
            });
        }, switchDelay);
    });
}
