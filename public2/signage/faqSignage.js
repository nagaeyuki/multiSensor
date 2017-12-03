var socket = io.connect(location.origin);

var test = 0;
var faqNum = 0;

var connect = 1;
var check = 1;
var faqSelect = 1;

// var urlTransition = ["https://iothis.aitech.ac.jp/signage/mainSignage.html",
//  "https://iothis.aitech.ac.jp/DigitalSignage2.html"];

$(function() {
    console.log("start");
    $("#faqTitle").text("Q&A - キャリアセンター編");
    $(".faq2").hide();
    $(".faq3").hide();


    //CSVファイルを読み込む関数getCSV()の定義
    function getCSV() {
        var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
        req.open("get", "../csv/FAQ.csv", true); // アクセスするファイルを指定
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

        for (var i = 1; i <= 18; i++) {
            $(".faqDetail" + i).append('<h1>Q. ' + result[i][1] + '</h1>');
            $('h1').addClass("question");
            $(".faqDetail" + i).append('<h2>A. ' + result[i][2] + '</h2>');
            $('h2').addClass("answer");

        }
    }

    console.log("できてます");
    getCSV(); //最初に実行される


    socket.on("faqNumberFromServer", function(data) {
        faqNum = data.faqNum;
        if (faqNum == 1) {
            $("#faqTitle").text("Q&A - キャリアセンター編");
            $(".faq1>div").css('background-color', '#d6eaff');
        } else if (faqNum == 2) {
            $("#faqTitle").text("Q&A - 就活全般編");
            $(".faq2>div").css('background-color', '#fcd6ff');
        } else if (faqNum == 3) {
            $("#faqTitle").text("Q&A - 先輩の疑問編");
            $(".faq3>div").css('background-color', '#e0ffd6');
        }
        slideCheck(faqNum);
        console.log(faqSelect);
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


    function slideCheck(faqNum) {
        if (faqSelect == 1) {
            if (faqNum == 2) {
                if ($(".faq1").hasClass('slideReverse')) {
                    $(".faq1").removeClass('slideReverse');
                }
                if ($(".faq2").hasClass('slideFoward')) {
                    $(".faq2").removeClass('slideFoward');
                }
                $(".faq1").addClass('slideFoward');
                $(".faq2").addClass('slideReverse');
                $(".faq1").slideUp();
                $(".faq2").slideDown();
            } else if (faqNum == 3) {
                if ($(".faq1").hasClass('slideFoward')) {
                    $(".faq1").removeClass('slideFoward');
                }
                if ($(".faq3").hasClass('slideReverse')) {
                    $(".faq3").removeClass('slideReverse');
                }
                $(".faq1").addClass('slideReverse');
                $(".faq3").addClass('slideFoward');
                $(".faq1").slideUp();
                $(".faq3").slideDown();

            }

        } else if (faqSelect == 2) {
            if (faqNum == 3) {
                if ($(".faq2").hasClass('slideReverse')) {
                    $(".faq2").removeClass('slideReverse');
                }
                if ($(".faq3").hasClass('slideFoward')) {
                    $(".faq3").removeClass('slideFoward');
                }
                $(".faq2").addClass('slideFoward');
                $(".faq3").addClass('slideReverse');
                $(".faq2").slideUp();
                $(".faq3").slideDown();

            } else if (faqNum == 1) {
                if ($(".faq1").hasClass('slideReverse')) {
                    $(".faq1").removeClass('slideReverse');
                }
                if ($(".faq2").hasClass('slideFoward')) {
                    $(".faq2").removeClass('slideFoward');
                }
                $(".faq1").addClass('slideFoward');
                $(".faq2").addClass('slideReverse');
                $(".faq1").slideDown();
                $(".faq2").slideUp();
            }

        } else if (faqSelect == 3) {
            if (faqNum == 1) {
                if ($(".faq1").hasClass('slideFoward')) {
                    $(".faq1").removeClass('slideFoward');
                }
                if ($(".faq3").hasClass('slideReverse')) {
                    $(".faq3").removeClass('slideReverse');
                }
                $(".faq1").addClass('slideReverse');
                $(".faq3").addClass('slideFoward');
                $(".faq1").slideDown();
                $(".faq3").slideUp();

            } else if (faqNum == 2) {
                if ($(".faq2").hasClass('slideReverse')) {
                    $(".faq2").removeClass('slideReverse');
                }
                if ($(".faq3").hasClass('slideFoward')) {
                    $(".faq3").removeClass('slideFoward');
                }
                $(".faq2").addClass('slideFoward');
                $(".faq3").addClass('slideReverse');
                $(".faq2").slideDown();
                $(".faq3").slideUp();
            }

        }
        faqSelect = faqNum;
    }

    moveArrow();

    function moveArrow() {
        $("#arrow")
            .animate({
                'margin-left': '100px',
            }, 2000)
            .animate({
                opacity: 0
            }, 500)
            .animate({
                'margin-left': '150px',
                opacity: 1
            }, 0);
        setTimeout(moveArrow, 1500); //アニメーションを繰り返す間隔
    }

});
