var socket = io.connect(location.origin);
var clientID = Math.floor(Math.random() * 1000) + (Math.floor(Math.random() * 10) + 1) * 1000;
var company = new Array(80);
var obog = new Array(80);
var url = new Array(80);
var num = 0;

var roomID;
var flag;
var test = 1;
var test2 = 1;
var testTimer;
var testTimer2;

var CutState = false;
var paringState = false;

var socketCut = 0;
var connection = 0;
var check = 0;

$(function() {
  // URLのアンカー（#以降の部分）を取得
  var urlHash = location.hash;
  // URLにアンカーが存在する場合
  switch (urlHash) {
    case "#main":
      mainSet();
      break;
    case "#calendar":
      setDatePicker(function() {
        getcourseCSV();
      });
      calendarSet();
      break;
    case "#accordion":
      accordionSet();
      getkyujinCSV();
      break;
    case "#faq":
      faqSet();
      break;
    case "#last":
      lastSet();
      break;
    default:
      pairingSet();
  }
  getcourseCSV();
  console.log("urlHash" + urlHash);
  $('body').on('touchend mousedown', function() {
    var Hash = location.hash;
    if (Hash == "#main" || Hash == "#calendar" || Hash == "#accordion" || Hash == "#faq") {
      socket.emit("ConnectNow");
    }

  });
  socket.on("ConnectCheck", function() {
    //alert("操作を続けますか？");
    var result = confirm("操作を続けますか？");
    //window.confirm("操作を続けますか？");
    if (result) {
      if (location.hash != "#last") {
        socket.emit("ConnectNow");
        //socket.emit("ok");
      }
    } else {
      //  socket.emit("cancelclick");
      ConnectStop();
    }
    //socket.emit("ConnectContinue");
  });

  socket.on("ConnectStop", function() {
    ConnectStop();
    location.hash = '#last';
  });
  //pairingSet();

  $("dl dt").click(function() {
    $(this).nextUntil("dt", "dd").slideToggle();
    $(this).nextUntil("dd").siblings("dd").slideUp();
    $(this).toggleClass("open");
    $(this).siblings("dt").removeClass("open");
  });

  $("dd").click(function() {
    var clickNum = $(this).data("n");
    //socketでおくる
    socket.emit("kyujinSelect", {
      "clickNum": clickNum
    });
    $(".company").text(company[clickNum - 1]);
    $(".number").text('OB・OG数：' + obog[clickNum - 1] + "名");
    num = clickNum;
    console.log("clickNum:" + clickNum);
  });


  $(".url").click(function() {
    window.open(url[num - 1]);
  });


  // ボタンクリック
  $(".pairingButton").click(function() {
    if (paringState) {
      alert("他の端末が操作中です");
    } else {
      test = 2;
      //console.log("test:" + test);
      roomID = $("#roomID").val();
      socket.emit("pairingFromController", {"roomID": roomID}, {"clientID":clientID});
      console.log("roomID:" + roomID);
    }
  });

socket.on("paringNow", function(){
  paringState=true;

});
  socket.on("pairingFailure", function(data) {
    test = 1;
    if(location.hash==""){
    alert("入力したコードが間違っています");
  }
    console.log("pairingFailure:" + test);
  });


  // ペアリングに成功
  socket.on("pairingCompletion", function(data) {
    console.log(test);
    console.log("connection:" + connection);
    if (test == 2) {

    }
    if(location.hash=="" ){
    location.hash="#main";
    //document.location.href = "http://" + IpAddress + "/controller/controller.html#main";
    mainSet();
  }
    //socket.emit("paringNow");
  });


  $(".menuBtn1").click(function() {
    calendarSet();


    socket.emit("courseStartFromController");
    setDatePicker(function() {
      getcourseCSV();
    });




    //     $.when(
    //       getcourseCSV(),
    //       calendarSet()
    //     ).done(function(){
    //       setDatePicker();
    //     })
    //     .fail(function() {
    //     // エラーがあった時
    //  console.log('error');
    // });


  });
  $(".menuBtn2").click(function() {
    socket.emit("kyujinStartFromController");
    accordionSet();
    getkyujinCSV();
  });
  $(".menuBtn3").click(function() {
    socket.emit("faqStartFromController");
    faqSet();
  });

  function setDatePicker() {
    $.datepicker.setDefaults($.datepicker.regional["ja"]);
    $('#datepicker').datepicker({

      // 土日祝日色変更
      beforeShowDay: function(date) {
        var dateStr = createDateStr(date);
        if (DateList.indexOf(dateStr) != -1) {
          console.log("DateAssociationList:" + DateAssociationList);
          return [true, '', ''];
        } else {
          //  }
          return [false, '', ''];
        }
        //for (var i = 0; i < DateList.length; i++) {
        //var datelist = new Date();
        //datelist.setTime(Date.parse(DateList[i]));
        //console.log(datelist.setTime(Date.parse(DateList[i])));
        // if (datelist.getYear() == date.getYear() && // 祝日の判定
        //     datelist.getMonth() == date.getMonth() &&
        //     datelist.getDate() == date.getDate()) {
        //     return [true, '', ''];
        // }
        //  }
        //console.log(DateList);
        // if (date.getDay() == 0) { // 日曜日
        //     return [false, 'class-sunday', '日曜日'];
        // } else if (date.getDay() == 6) { // 土曜日
        //     return [false, 'class-saturday', '土曜日'];
        // } else { // 平日
        //     return [false, 'class-weekday', '平日'];
        // }

      },
      dateFormat: 'yy-mm-dd',
      minDate: new Date(2017, 4 - 1, 1),
      maxDate: new Date(2018, 3 - 1, 31),
      onSelect: function(dateText, inst) {
        var dates = dateText.split('/');
        var year = parseInt(dates[0]);
        var month = parseInt(dates[1]);
        var day = parseInt(dates[2]);
        console.log(dates);
        console.log(year);
        console.log(month);
        console.log(day);
        //console.log(DateAssociationList);
        //console.log(DateAssociationList[dateText]);
        socket.emit("dateCalendar", {
          "dateText": DateAssociationList[dateText]
        });
      },
      onChangeMonthYear: function(year, month, inst) {
        // その月の休日情報をajaxで取得
        socket.emit("ChangeMonth", {
          "monthText": month
        });
        //console.log(month);
        //console.log(DateAssociationList);
      }
    })
  }

  function createDateStr(date) {
    var year = date.getYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (year < 2000) {
      year += 1900
    };
    if (month < 10) {
      month = "0" + month
    };
    if (day < 10) {
      day = "0" + day
    };

    var dateStr = year + "-" + month + "-" + day;
    return dateStr;
  }

  $(".faqBtn1").click(function() {
    socket.emit("faqNumberFromController", {
      "faqNumber": 1
    });
  });
  $(".faqBtn2").click(function() {
    socket.emit("faqNumberFromController", {
      "faqNumber": 2
    });
  });
  $(".faqBtn3").click(function() {

    socket.emit("faqNumberFromController", {
      "faqNumber": 3
    });
  });


  $(".mainRelease").click(function() {
    socket.emit("FlagReset");
    lastSet();
    socketCut = 1;
    //socket.disconnect();
  });

  $(".Return").click(function() {
    //if (socketCut == 0) {
    mainSet();
    socket.emit("ReturnFromController");
    //}
  });

  $(".Release").click(function() {
    //if (socketCut == 0) {
    socket.emit("FlagReset");
    lastSet();
    socketCut = 1;
    //socket.disconnect();
    //}
  });


  //クリックしたときのファンクションをまとめて指定
  $('.tab li').click(function() {

    //.index()を使いクリックされたタブが何番目かを調べ、
    //indexという変数に代入します。
    var index = $('.tab li').index(this);

    //コンテンツを一度すべて非表示にし、
    $('.content li').css('display', 'none');

    //クリックされたタブと同じ順番のコンテンツを表示します。
    $('.content li').eq(index).css('display', 'block');
    //一度タブについているクラスselectを消し、
    $('.tab li').removeClass('select');


    //クリックされたタブのみにクラスselectをつけます。
    $(this).addClass('select');
  });




  // if (window.navigator.userAgent.toLowerCase().indexOf('chrome') != -1) {
  //   var bodyStyle, p2rfixStyle;
  //
  //   document.getElementsByTagName('html')[0].style.height = '100%';
  //
  //   bodyStyle = document.getElementsByTagName('body')[0].style;
  //   bodyStyle.height = '100%';
  //   bodyStyle.overflowY = 'hidden';
  //
  //   p2rfixStyle = document.getElementById('p2rfix').style;
  //   p2rfixStyle.height = '100%';
  //   p2rfixStyle.overflow = 'auto';
  // }

});

function ConnectStop() {
  $("#controller").hide();
  $('.content li').css('display', 'none');
  $('.content li').eq(1).css('display', 'block');
  $(".mainReset").hide();
  $(".Reset").hide();
  socket.emit("TimerStop");
  console.log("timer");
  paringState = false;
}

function pairingSet() {
  $(".pairingController").show();
  $(".mainController").hide();
  $(".mainReset").hide();
  $("#datepicker").hide();
  $(".accordionController").hide();
  $(".faqController").hide();
  $(".Reset").hide();
  $(".tab").hide();
  $(".content").hide();
}

function mainSet() {
  $(".pairingController").hide();
  $(".mainController").show();
  $(".mainReset").show();
  $("#datepicker").hide();
  $(".accordionController").hide();
  $(".faqController").hide();
  $(".Reset").hide();
  $(".tab").show();
  $(".content").show();
}

function calendarSet() {
  $(".pairingController").hide();
  $(".mainController").hide();
  $(".mainReset").hide();
  $("#datepicker").show();
  $(".accordionController").hide();
  $(".faqController").hide();
  $(".Reset").show();
  $(".tab").show();
  $(".content").show();
}

function accordionSet() {
  $(".pairingController").hide();
  $(".mainController").hide();
  $(".mainReset").hide();
  $("#datepicker").hide();
  $(".accordionController").show();
  $(".faqController").hide();
  $(".Reset").show();
  $(".tab").show();
  $(".content").show();
}

function faqSet() {
  $(".pairingController").hide();
  $(".mainController").hide();
  $(".mainReset").hide();
  $("#datepicker").hide();
  $(".accordionController").hide();
  $(".faqController").show();
  $(".Reset").show();
  $(".tab").show();
  $(".content").show();
}

function lastSet() {
  $(".pairingController").hide();
  $(".mainController").hide();
  $(".mainReset").hide();
  $("#datepicker").hide();
  $(".accordionController").hide();
  $(".faqController").hide();
  $(".Reset").hide();
  $(".tab").show();
  $(".content").show();
  $(".select").hide();
  $(".hide").show();

}

// window.onload=function() {
// switch(state){
//   case "pairing":
//   pairingSet();
//   break;
//   case "main":mainSet();
//   break;
// }
//pairingSet();

//};

var DateList = [];
var DateAssociationList = new Object();

function getcourseCSV() {
  var req = new XMLHttpRequest();
  req.open("get", "../csv/courseData2017.csv", true);
  req.send(null);
  req.onload = function() {
    convertcourseCSVtoArray(req.responseText);
  }
}

function convertcourseCSVtoArray(str) {
  var result = [];
  var tmp = str.split("\n");
  for (var i = 0; i < tmp.length; ++i) {
    result[i] = tmp[i].split(',');
  }
  for (var i = 1; i < result.length - 2; i++) {
    var list = getDate(result, i);
    for (var j = 0; j < list.length; j++) {
      DateAssociationList[result[i][1] + "-" + getMonth(result, i) + "-" + list[j]] = result[i][0];
      DateList.push(result[i][1] + "-" + getMonth(result, i) + "-" + list[j]);
    }
  }


}

function getkyujinCSV() {
  var req = new XMLHttpRequest();
  req.open("get", "../csv/kyujinTest.csv", true);
  req.send(null);
  req.onload = function() {
    convertkyujinCSVtoArray(req.responseText);
  }
}

function convertkyujinCSVtoArray(str) {
  var result = [];
  var tmp = str.split("\n");
  for (var i = 0; i < tmp.length; ++i) {
    result[i] = tmp[i].split(',');
  }
  for (var i = 1; i <= 80; i++) {
    $(".company" + i).text(result[i][1]);
    $(".company" + i).hide();
    company[i - 1] = result[i][1];
    obog[i - 1] = result[i][8];
    url[i - 1] = result[i][7];
    //console.log(obog[i - 1]);
  }
}

function getMonth(result, i) {
  //csvの時期欄から何月の予定かをmonthNumberに格納
  switch (result[i][3].indexOf("月")) {
    case 1:
      return "0" + result[i][3].substr(0, 1);
    case 2:
      return result[i][3].substr(0, 2);
    case -1:
      return -1;
  }
}

function getDate(result, i) {
  var list = [];
  do {
    if (result[i][2].indexOf("、") == -1) {
      if (result[i][2].length == 1) {
        list.push("0" + result[i][2]);
      } else {
        list.push(result[i][2]);
      }

      result[i][2] = [];
    } else {
      if (result[i][2].substr(0, result[i][2].indexOf("、")).length == 1) {
        list.push("0" + result[i][2].substr(0, result[i][2].indexOf("、")));
      } else {
        list.push(result[i][2].substr(0, result[i][2].indexOf("、")));
      }

      result[i][2] = result[i][2].substr(result[i][2].indexOf("、") + 1, result[i][2].length);
    }
  } while (result[i][2].length)
  //console.log(list);
  return list;
}
