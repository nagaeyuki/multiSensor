  var result = [];
function getCSV(fileName) {
    var req = new XMLHttpRequest();
    req.open("get", "../csv/"+fileName, true);
    req.send(null);
    req.onload = function () {
        convertCSVtoArray(req.responseText);
    }
}
function convertCSVtoArray(str) {

    var tmp = str.split("\n");
    for (var i = 0; i < tmp.length; ++i) {
        result[i] = tmp[i].split(',');
    }
  }

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
