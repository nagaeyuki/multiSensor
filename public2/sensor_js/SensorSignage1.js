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
    req.open("get", "../csv/courseDataDetail2017.csv", true); // アクセスするファイルを指定
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

      var insertUl = $('<ul style="list-style-type: none">').attr('id', 'csvid' + result[i][0]).addClass("line");;

      for (var j = 3; j < 8; j++) {
        // liタグを生成してテキスト追加
        var newLi2 = $('<li>').text(result[i][j]);
        if (j == 4) {
          newLi2.addClass("name");
        }
        if (j == 7) {
          newLi2.attr('id', 'Detail' + result[i][0]).addClass("Detail");
        }
        // insertに生成したliタグを追加
        insertUl.append(newLi2);
      }
      if (monthNumber == getMonth(result, i - 1)) {
        $('#csvid' + result[i - 1][0]).after(insertUl);
      } else {
        $("#c" + monthNumber).after(insertUl);
      }
    }
    // $('ul').wrap('<div style="display: none;" class = "divline"/>');
  }
  getCSV(); //最初に実行される
  console.log("start");


  $(function() {
    $(".inline_box").colorbox({
      width: "850px",
      maxHeight: "100%",
      inline: true,
      opacity: 0.7


    });
  });


  flag = false;
  //日付を押したときの処理
  var preSelect = 0;
  var selectCount = 0;
  var selectminusCount = 0;
  var PositionTopFrag = false;

  var timeoutID;
  var showModal = false;
  var timerState=false;
  socket.on("NoOperation", function(data) {
    var inline = document.getElementById("inline");
    var id = data + 1;
    var csv = "csvid" + id;
    inline.href = "#csvid" + id;

if(!timerState){
    timeoutID = setTimeout(function() {
      showmodal(id)
    }, 4000);
      timerState=true;
  }

    // if (showModal) {
    //   clearTimeout(timeoutID);
    // }
  });

  function showmodal(id) {
    showModal = true;
    $('#Detail' + id).css('display', 'block');
    $('#csvid' + id).css('color', 'blue');
    $('#csvid' + id).css('border', '');
    $(".inline_box").colorbox({
      open: true,
      scrolling:false
    });
    // socket.emit("showModal");

  }
  var road = false;
  $(document).ready(function(){
    road = true;

  });

  socket.on("select", function(data) {

    if(road){
socket.emit("reload");
      road = false;
      data = 0;
      preSelect = 0;
    }
    console.log("dataです:"+ data);
    var id = data + 1;

    var th = $("#csvid" + id).position();
    console.log("#csvid" + id);
    var sh = $(".scroll").scrollTop();
    var pos = th.top + sh + 1;

    var move = false;

    console.log("data:" + data + "  pre:" + preSelect)
    switch (Math.abs(data - preSelect)) {
      case 0:
        if (!showModal) {
          $("#csvid" + id).css("border", "3px solid #ff0000");
          // $('.scroll ul ').eq(data).css("border", "3px solid #ff0000");
        }
        break;
      case 1:
        if (!showModal) {
          $("#csvid" + (preSelect + 1)).css("border", "");
          $("#csvid" + id).css("border", "3px solid #ff0000");
        }
        if (data > preSelect) {
          if (selectCount < 0) {
            selectCount = -selectCount;
          }
          selectCount += 1;
        } else {
          if (selectCount < 0) {
            selectCount = selectCount--;
          } else {
            selectCount = -(selectCount + 1);
          }

        }
        move = true;
        break;

      case 2:
        if (!showModal) {
          $('.scroll ul').eq(preSelect).css("border", "");
          if (data > preSelect) {
            $('.scroll ul').eq(preSelect + 1).css("border", "3px solid #ff0000");
            setTimeout(function() {
              $('.scroll ul').eq(data - 1).css("border", "");
              $('.scroll ul').eq(data).css("border", "3px solid #ff0000");
            }, 400);
            if (selectCount < 0) {
              selectCount = -selectCount;
            }
            selectCount += 2;
          } else {
            $('.scroll ul').eq(preSelect - 1).css("border", "3px solid #ff0000");
            setTimeout(function() {
              $('.scroll ul').eq(data + 1).css("border", "");
              $('.scroll ul').eq(data).css("border", "3px solid #ff0000");
            }, 400);
            selectCount = -selectCount + 2;
          }
        }
        move = true;
        break;
      case 3:
        if (!showModal) {
          $('.scroll ul').eq(preSelect).css("border", "");
          if (data > preSelect) {
            $('.scroll ul').eq(preSelect + 1).css("border", "3px solid #ff0000");
            setTimeout(function() {
              $('.scroll ul').eq(data - 2).css("border", "");
              $('.scroll ul').eq(data - 1).css("border", "3px solid #ff0000");
            }, 400);
            setTimeout(function() {
              $('.scroll ul').eq(data - 1).css("border", "");
              $('.scroll ul').eq(data).css("border", "3px solid #ff0000");
            }, 800);
            if (selectCount < 0) {
              selectCount = -selectCount;
            }
            selectCount += 3;
          } else {
            $('.scroll ul').eq(preSelect - 1).css("border", "3px solid #ff0000");
            setTimeout(function() {
              $('.scroll ul').eq(data + 2).css("border", "");
              $('.scroll ul').eq(data - 1).css("border", "3px solid #ff0000");
            }, 400);
            setTimeout(function() {
              $('.scroll ul').eq(data + 1).css("border", "");
              $('.scroll ul').eq(data).css("border", "3px solid #ff0000");
            }, 800);
            selectCount = -selectCount + 3;
          }
        }
        move = true;
        break;
      case 32:
        console.log("32");
        if (!showModal) {
          $('.scroll ul').eq(preSelect).css("border", "");
          $('.scroll ul').eq(data).css("border", "3px solid #000000");
          selectCount = 0;
        }
        move = true;
    }
    if (move) {
      clearTimeout(timeoutID);
      timerState=false;
      showModal = false;
      $(".inline_box").colorbox.close();
      $('.Detail').css('display', 'none');
      $('#csvid' + (preSelect+1)).css('color', 'black');
      // $("#csvid" + id).css("border", "3px solid #ff0000");
    } else {
      // $('.scroll ul').eq(preSelect).css("border", "");
    }
    preSelect = data;

    // if (PositionTopFrag && selectCount < 0) {
    //   $(".scroll").animate({
    //     scrollTop: pos
    //   }, "slow", "swing");
    //   PositionTopFrag = true;
    // } else if (selectCount > 1 || selectCount < -1) {
    //   $(".scroll").animate({
    //     scrollTop: pos
    //   }, "slow", "swing");
    //   PositionTopFrag = true;
    //   selectCount = 0;
    //   selectCount = 0;
    // } else {
    //   PositionTopFrag = false;
    // }
    if(!showModal){
    $(".scroll").animate({
      scrollTop: pos
    }, "slow", "swing");
  }





});
  var pos = $("#c4").position();
  //$(".scroll").scrollTop(pos.top + 1);

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

  socket.on("now_state", function(data) {
    if (data == 6) {
      document.location.href = "http://localhost/sensor/Sensor1.html";
    }
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
