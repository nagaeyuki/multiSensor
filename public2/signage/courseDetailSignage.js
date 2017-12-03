 var socket = io.connect(location.origin);

var test = 0;
var courseDetail = 0;
var sample = 0;

$(function () {
	socket.on("courseDetailFromServer", function (data) {
        courseDetail = data.courseDetail;
		console.log("sample:"+ sample);
		
		if(test == 0) {
			switch(courseDetail) {
			case 1: detail1();
				test = 1;
				sample = 1;
				//socket.emit("courseDetailFromSignage",{ "courseDetail": 1 });
				console.log("detail1");
				break;
			case 2: detail2();
				test = 1;
				socket.emit("kyujinURL",{ "url": url[1] });
				console.log("case2");
				break;
			case 3: detail3();
				test = 1;
				socket.emit("kyujinURL",{ "url": url[2] });
				console.log("case3");
				break;
			case 4: detail4();
				test = 1;
				socket.emit("kyujinURL",{ "url": url[3] });
				break;
			case 5: detail5();
				test = 1;
				socket.emit("kyujinURL",{ "url": url[4] });
				break;
			case 6: detail6();
				test = 1;
				socket.emit("kyujinURL",{ "url": url[5] });
				break;
			case 7: detail7();
				test = 1;
				socket.emit("kyujinURL",{ "url": url[6] });
				break;
			case 8: detail8();
				test = 1;
				socket.emit("kyujinURL",{ "url": url[7] });
				break;
			case 9: detail9();
				test = 1;
				socket.emit("kyujinURL",{ "url": url[8] });
				break;
			}
		}
	});
	
	function detail1() {
		$("#company").text("株式会社エクセル・システムプロダクト");
		$("#business").text("業種：情報通信：ｿﾌﾄｳｴｱ･情報処理・情報ｻｰﾋﾞｽ");
		$("#place").text("本社所在地：東京都渋谷区円山町5-3 玉川屋ﾋﾞﾙ8階");
		$("#content").text("事業内容：ｼｽﾃﾑ開発（設計・開発・保守・運用）ﾊﾟｯｹｰｼﾞ開発・販売");
		$("#tel").text("電話番号：03-3770-3501");
		$("#url").text("URL："+url[0]);
	}
	
	console.log("sample:"+ sample);
});