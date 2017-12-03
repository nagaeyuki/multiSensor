var socket = io.connect(location.origin);

var businessNum = 0;
var genre = 0;
var checkGenre = 0;
var kyujinNum = 0;
var test = 0;
var test2 = 0;

var kensetsu = new Array(10);
var maker = new Array(10);
var shosya = new Array(10);
var ryutsu = new Array(10);
var kinyu = new Array(10);
var info = new Array(10);
var service = new Array(10);
var other = new Array(10);

var kyujinDetail = [];

var categoryItem = "業種:   ";
var categoryItem2 = "職種:   ";

var connect = 1;
var check = 1;

var urlTransition = ["http://localhost:5000/signage/mainSignage.html"];

/*var url =["http://www.excel-system.co.jp/","http://www.ico-net.co.jp/","http://www.koshino-job.com","http://www.yano-const.co.jp","http://www.jtacs.co.jp/","http://kwk.co.jp","http://www.makino-co.co.jp","http://www.lyfuk.co.jp","http://yamaken4093813.jimdo.com/"];*/
var url = new Array(80);

$(function () {

	$(".businessSignage").show();
	$(".kyujinSignage").hide();
	$(".kyujinDetailSignage").hide();
	
	//CSVファイルを読み込む関数getCSV()の定義
    function getCSV(){
        var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
        req.open("get", "../csv/kyujin.csv", true); // アクセスするファイルを指定
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
        
        for (var i = 0; i < 10; i++) {
            kensetsu[i] = result[i+1][1];
            maker[i] = result[i+11][1];
            shosya[i] = result[i+21][1];
			ryutsu[i] = result[i+31][1];
			kinyu[i] = result[i+41][1];
			info[i] = result[i+51][1];
			service[i] = result[i+61][1];
			other[i] = result[i+71][1];
        }
		
		for (var i = 10; i < 20; i++) {
            kensetsu[i] = result[i-9][2];
            maker[i] = result[i+1][2];
            shosya[i] = result[i+11][2];
			ryutsu[i] = result[i+21][2];
			//kinyu[i] = result[i+31][2];
			//info[i] = result[i+41][2];
			//service[i] = result[i+51][2];
			//other[i] = result[i+61][2];
        }
		
		for (var i = 20; i < 30; i++) {
            kensetsu[i] = result[i-19][3];
            maker[i] = result[i-9][3];
            shosya[i] = result[i+1][3];
			ryutsu[i] = result[i+11][3];
			//kinyu[i] = result[i+21][3];
			//info[i] = result[i+31][3];
			//service[i] = result[i+41][3];
			//other[i] = result[i+51][3];
        }
		
		for (var i = 0; i < 80; i++) {
            url[i] = result[i+1][7];
			console.log(url[i]);
        }
		
		for(i=0; i<80; i++){
			kyujinDetail[i] = [];
			for(j=0; j<9; j++){
				kyujinDetail[i][j] = result[i][j];
				console.log("kd"+kyujinDetail[i][j])
			}
		}
    }

	console.log("できてます");
    getCSV(); //最初に実行される

	
	
	socket.on("businessNumberFromServer", function (data) {
        businessNum = data.businessNum;
		$(".businessSignage").hide();
        $(".kyujinSignage").show();
		$(".kyujinDetailSignage").hide();
		
        console.log(businessNum);
		console.log("test"+test);
		
		if(test == 0) {
			switch(businessNum) {
				case 1: kyujin1();
					test = 1;
					console.log("case1");
					break;
				case 2: kyujin2();
					test = 1;
					console.log("case2");
					break;
				case 3: kyujin3();
					test = 1;
					console.log("case3");
					break;
				case 4: kyujin4();
					test = 1;
					break;
				case 5: kyujin5();
					test = 1;
					break;
				case 6: kyujin6();
					test = 1;
					break;
				case 7: kyujin7();
					test = 1;
					break;
				case 8: kyujin8();
					test = 1;
					break;
			}
		}
		
    });
	
	socket.on("genreFromServer", function (data) {
        genre = data.genreNum;
		
		switch(genre) {
			case 1: checkGenre = 1;
					console.log("genre1");
					break;
			case 2: checkGenre = 2;
					console.log("genre2");
					break;
			case 3: checkGenre = 3;
					console.log("genre3");
					break;
			case 4: checkGenre = 4;
					console.log("genre4");
					break;
			case 5: checkGenre = 5;
					console.log("genre5");
					break;
			case 6: checkGenre = 6;
					console.log("genre6");
					break;
			case 7: checkGenre = 7;
					console.log("genre7");
					break;
			case 8: checkGenre = 8;
					console.log("genre8");
					break;
		}
		
	});
	
	
	socket.on("kyujinNumberFromServer", function (data) {
        kyujinNum = data.kyujinNum;
		$(".businessSignage").hide();
        $(".kyujinSignage").hide();
		$(".kyujinDetailSignage").show();
		
		
        console.log(kyujinNum);
		console.log("test"+test);
		
		if(test2 == 0){
			switch(kyujinNum) {
				case 1: 
					if(checkGenre == 1) {
						socket.emit("kyujinURL",{ "url": url[0] });
						socket.emit("obog",{ "obog": kyujinDetail[1][8] });
						kensetsu1();
						console.log("詳細1");
					} else if(checkGenre == 2) {
						socket.emit("kyujinURL",{ "url": url[10] });
						socket.emit("obog",{ "obog": kyujinDetail[11][8] });
						maker1();
						console.log("詳細2");
					} else {
						console.log("まだ実装してないよ");
					}
					test2 = 1;
					console.log("case1");
					break;
				case 2: 
					if(checkGenre == 1) {
						socket.emit("kyujinURL",{ "url": url[1] });
						socket.emit("obog",{ "obog": kyujinDetail[2][8] });
						kensetsu2();
						console.log("詳細1-2");
					} else if(checkGenre == 2) {
						socket.emit("kyujinURL",{ "url": url[11] });
						socket.emit("obog",{ "obog": kyujinDetail[21][8] });
						maker2();
						console.log("詳細2-2");
					} else {
						console.log("まだ実装してないよ");
					}
					test2 = 1;
					console.log("case2");
					break;
				case 3: 
					if(checkGenre == 1) {
						socket.emit("kyujinURL",{ "url": url[2] });
						socket.emit("obog",{ "obog": kyujinDetail[3][8] });
						kensetsu3();
						console.log("詳細1-3");
					}
					test2 = 1;
					console.log("case3");
					break;
				case 4: 
					if(checkGenre == 1) {
						socket.emit("kyujinURL",{ "url": url[3] });
						socket.emit("obog",{ "obog": kyujinDetail[4][8] });
						kensetsu4();
						console.log("詳細1-4");
					}
					test2 = 1;
					break;
				case 5: 
					if(checkGenre == 1) {
						socket.emit("kyujinURL",{ "url": url[4] });
						socket.emit("obog",{ "obog": kyujinDetail[5][8] });
						kensetsu5();
						console.log("詳細1-5");
					}
					test2 = 1;
					break;
				case 6: 
					if(checkGenre == 1) {
						socket.emit("kyujinURL",{ "url": url[5] });
						socket.emit("obog",{ "obog": kyujinDetail[6][8] });
						kensetsu6();
						console.log("詳細1-6");
					}
					test2 = 1;
					break;
				case 7: 
					if(checkGenre == 1) {
						socket.emit("kyujinURL",{ "url": url[6] });
						socket.emit("obog",{ "obog": kyujinDetail[7][8] });
						kensetsu7();
						console.log("詳細1-7");
					}
					test2 = 1;
					break;
				case 8: 
					if(checkGenre == 1) {
						socket.emit("kyujinURL",{ "url": url[7] });
						socket.emit("obog",{ "obog": kyujinDetail[8][8] });
						kensetsu8();
						console.log("詳細1-8");
					}
					test2 = 1;
					break;
				case 9: 
					if(checkGenre == 1) {
						socket.emit("kyujinURL",{ "url": url[8] });
						socket.emit("obog",{ "obog": kyujinDetail[9][8] });
						kensetsu9();
						console.log("詳細1-9");
					}
					test2 = 1;
					break;
				case 10: 
					if(checkGenre == 1) {
						socket.emit("kyujinURL",{ "url": url[9] });
						socket.emit("obog",{ "obog": kyujinDetail[10][8] });
						kensetsu10();
						console.log("詳細1-10");
					}
					test2 = 1;
					break;
			}
		}
		
		

		
		
			/*switch(kyujinNum) {
				case 1: detail1();
					test = 1;
					socket.emit("kyujinURL",{ "url": url[0] });
					console.log("case1");
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
			}*/
			//console.log(check);
		
    });
	
	/*socket.on("kyujinReturnFromServer", function (data) {
		window.location.href = urlTransition[0];
	});*/
	
	socket.on("kyujinReturnFromServer", function (data) {
		window.location.href = urlTransition[0];
	});
	
	socket.on("kyujinBeforeFromServer", function (data) {
		test = 0;
		$(".businessSignage").show();
		$(".kyujinSignage").hide();
	});
	
	socket.on("Restart", function (data) {
		window.location.href = urlTransition[0];
	});
	
	socket.on("kyujinBeforeFromServer2", function (data) {
		test2 = 0;
		//$(".businessSignage").show();
		$(".kyujinSignage").show();
		$(".kyujinDetailSignage").hide();
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
	
	
	
	function kyujin1() {
		$(".kyujinText1").text(kensetsu[0]);
		$(".kyujinText2").text(kensetsu[1]);
		$(".kyujinText3").text(kensetsu[2]);
		$(".kyujinText4").text(kensetsu[3]);
		$(".kyujinText5").text(kensetsu[4]);
		$(".kyujinText6").text(kensetsu[5]);
		$(".kyujinText7").text(kensetsu[6]);
		$(".kyujinText8").text(kensetsu[7]);
		$(".kyujinText9").text(kensetsu[8]);
		$(".kyujinText10").text(kensetsu[9]);
		
		$(".kyujinCategory1").text(categoryItem+kensetsu[10]+categoryItem2+kensetsu[20]);
		$(".kyujinCategory2").text(categoryItem+kensetsu[11]+categoryItem2+kensetsu[21]);
		$(".kyujinCategory3").text(categoryItem+kensetsu[12]+categoryItem2+kensetsu[22]);
		$(".kyujinCategory4").text(categoryItem+kensetsu[13]+categoryItem2+kensetsu[23]);
		$(".kyujinCategory5").text(categoryItem+kensetsu[14]+categoryItem2+kensetsu[24]);
		$(".kyujinCategory6").text(categoryItem+kensetsu[15]+categoryItem2+kensetsu[25]);
		$(".kyujinCategory7").text(categoryItem+kensetsu[16]+categoryItem2+kensetsu[26]);
		$(".kyujinCategory8").text(categoryItem+kensetsu[17]+categoryItem2+kensetsu[27]);
		$(".kyujinCategory9").text(categoryItem+kensetsu[18]+categoryItem2+kensetsu[28]);
		$(".kyujinCategory10").text(categoryItem+kensetsu[19]+categoryItem2+kensetsu[29]);
	}
	
	function kyujin2() {
		$(".kyujinText1").text(maker[0]);
		$(".kyujinText2").text(maker[1]);
		$(".kyujinText3").text(maker[2]);
		$(".kyujinText4").text(maker[3]);
		$(".kyujinText5").text(maker[4]);
		$(".kyujinText6").text(maker[5]);
		$(".kyujinText7").text(maker[6]);
		$(".kyujinText8").text(maker[7]);
		$(".kyujinText9").text(maker[8]);
		$(".kyujinText10").text(maker[9]);
		
		$(".kyujinCategory1").text(categoryItem+maker[10]+categoryItem2+maker[20]);
		$(".kyujinCategory2").text(categoryItem+maker[11]+categoryItem2+maker[21]);
		$(".kyujinCategory3").text(categoryItem+maker[12]+categoryItem2+maker[22]);
		$(".kyujinCategory4").text(categoryItem+maker[13]+categoryItem2+maker[23]);
		$(".kyujinCategory5").text(categoryItem+maker[14]+categoryItem2+maker[24]);
		$(".kyujinCategory6").text(categoryItem+maker[15]+categoryItem2+maker[25]);
		$(".kyujinCategory7").text(categoryItem+maker[16]+categoryItem2+maker[26]);
		$(".kyujinCategory8").text(categoryItem+maker[17]+categoryItem2+maker[27]);
		$(".kyujinCategory9").text(categoryItem+maker[18]+categoryItem2+maker[28]);
		$(".kyujinCategory10").text(categoryItem+maker[19]+categoryItem2+maker[29]);
	}
	
	function kyujin3() {
		$(".kyujinText1").text(shosya[0]);
		$(".kyujinText2").text(shosya[1]);
		$(".kyujinText3").text(shosya[2]);
		$(".kyujinText4").text(shosya[3]);
		$(".kyujinText5").text(shosya[4]);
		$(".kyujinText6").text(shosya[5]);
		$(".kyujinText7").text(shosya[6]);
		$(".kyujinText8").text(shosya[7]);
		$(".kyujinText9").text(shosya[8]);
		$(".kyujinText10").text(shosya[9]);
		
		$(".kyujinCategory1").text(categoryItem+shosya[10]+categoryItem2+shosya[20]);
		$(".kyujinCategory2").text(categoryItem+shosya[11]+categoryItem2+shosya[21]);
		$(".kyujinCategory3").text(categoryItem+shosya[12]+categoryItem2+shosya[22]);
		$(".kyujinCategory4").text(categoryItem+shosya[13]+categoryItem2+shosya[23]);
		$(".kyujinCategory5").text(categoryItem+shosya[14]+categoryItem2+shosya[24]);
		$(".kyujinCategory6").text(categoryItem+shosya[15]+categoryItem2+shosya[25]);
		$(".kyujinCategory7").text(categoryItem+shosya[16]+categoryItem2+shosya[26]);
		$(".kyujinCategory8").text(categoryItem+shosya[17]+categoryItem2+shosya[27]);
		$(".kyujinCategory9").text(categoryItem+shosya[18]+categoryItem2+shosya[28]);
		$(".kyujinCategory10").text(categoryItem+shosya[19]+categoryItem2+shosya[29]);
	}
	
	function kyujin4() {
		$(".kyujinText1").text(ryutsu[0]);
		$(".kyujinText2").text(ryutsu[1]);
		$(".kyujinText3").text(ryutsu[2]);
		$(".kyujinText4").text(ryutsu[3]);
		$(".kyujinText5").text(ryutsu[4]);
		$(".kyujinText6").text(ryutsu[5]);
		$(".kyujinText7").text(ryutsu[6]);
		$(".kyujinText8").text(ryutsu[7]);
		$(".kyujinText9").text(ryutsu[8]);
		$(".kyujinText10").text(ryutsu[9]);
		
		$(".kyujinCategory1").text(categoryItem+ryutsu[10]+categoryItem2+ryutsu[20]);
		$(".kyujinCategory2").text(categoryItem+ryutsu[11]+categoryItem2+ryutsu[21]);
		$(".kyujinCategory3").text(categoryItem+ryutsu[12]+categoryItem2+ryutsu[22]);
		$(".kyujinCategory4").text(categoryItem+ryutsu[13]+categoryItem2+ryutsu[23]);
		$(".kyujinCategory5").text(categoryItem+ryutsu[14]+categoryItem2+ryutsu[24]);
		$(".kyujinCategory6").text(categoryItem+ryutsu[15]+categoryItem2+ryutsu[25]);
		$(".kyujinCategory7").text(categoryItem+ryutsu[16]+categoryItem2+ryutsu[26]);
		$(".kyujinCategory8").text(categoryItem+ryutsu[17]+categoryItem2+ryutsu[27]);
		$(".kyujinCategory9").text(categoryItem+ryutsu[18]+categoryItem2+ryutsu[28]);
		$(".kyujinCategory10").text(categoryItem+ryutsu[19]+categoryItem2+ryutsu[29]);
	}
	
	function kyujin5() {
		$(".kyujinText1").text("金融①");
		$(".kyujinText2").text("金融②");
		$(".kyujinText3").text("金融③");
		$(".kyujinText4").text("金融④");
		$(".kyujinText5").text("金融⑤");
		$(".kyujinText6").text("金融⑥");
		$(".kyujinText7").text("金融⑦");
		$(".kyujinText8").text("金融⑧");
		$(".kyujinText9").text("金融⑨");
	}
	
	function kyujin6() {
		$(".kyujinText1").text("情報通信①");
		$(".kyujinText2").text("情報通信②");
		$(".kyujinText3").text("情報通信③");
		$(".kyujinText4").text("情報通信④");
		$(".kyujinText5").text("情報通信⑤");
		$(".kyujinText6").text("情報通信⑥");
		$(".kyujinText7").text("情報通信⑦");
		$(".kyujinText8").text("情報通信⑧");
		$(".kyujinText9").text("情報通信⑨");
	}
	
	function kyujin7() {
		$(".kyujinText1").text("サービス①");
		$(".kyujinText2").text("サービス②");
		$(".kyujinText3").text("サービス③");
		$(".kyujinText4").text("サービス④");
		$(".kyujinText5").text("サービス⑤");
		$(".kyujinText6").text("サービス⑥");
		$(".kyujinText7").text("サービス⑦");
		$(".kyujinText8").text("サービス⑧");
		$(".kyujinText9").text("サービス⑨");
	}
	
	function kyujin8() {
		$(".kyujinText1").text("その他①");
		$(".kyujinText2").text("その他②");
		$(".kyujinText3").text("その他③");
		$(".kyujinText4").text("その他④");
		$(".kyujinText5").text("その他⑤");
		$(".kyujinText6").text("その他⑥");
		$(".kyujinText7").text("その他⑦");
		$(".kyujinText8").text("その他⑧");
		$(".kyujinText9").text("その他⑨");
	}
	
	
	function kensetsu1() {
		$("#company").text(kensetsu[0]);
		$("#business").text(kyujinDetail[1][2]);
		$("#place").text(kyujinDetail[1][4]);
		$("#content").text(kyujinDetail[1][5]);
		$("#tel").text(kyujinDetail[1][6]);
		$("#url").text("URL："+url[0]);
	}
	function kensetsu2() {
		$("#company").text(kensetsu[1]);
		$("#business").text(kyujinDetail[2][2]);
		$("#place").text(kyujinDetail[2][4]);
		$("#content").text(kyujinDetail[2][5]);
		$("#tel").text(kyujinDetail[2][6]);
		$("#url").text("URL："+url[1]);
	}
	function kensetsu3() {
		$("#company").text(kensetsu[2]);
		$("#business").text(kyujinDetail[3][2]);
		$("#place").text(kyujinDetail[3][4]);
		$("#content").text(kyujinDetail[3][5]);
		$("#tel").text(kyujinDetail[3][6]);
		$("#url").text("URL："+url[2]);
	}
	function kensetsu4() {
		$("#company").text(kensetsu[3]);
		$("#business").text(kyujinDetail[4][2]);
		$("#place").text(kyujinDetail[4][4]);
		$("#content").text(kyujinDetail[4][5]);
		$("#tel").text(kyujinDetail[4][6]);
		$("#url").text("URL："+url[3]);
	}
	function kensetsu5() {
		$("#company").text(kensetsu[4]);
		$("#business").text(kyujinDetail[5][2]);
		$("#place").text(kyujinDetail[5][4]);
		$("#content").text(kyujinDetail[5][5]);
		$("#tel").text(kyujinDetail[5][6]);
		$("#url").text("URL："+url[4]);
	}
	function kensetsu6() {
		$("#company").text(kensetsu[5]);
		$("#business").text(kyujinDetail[6][2]);
		$("#place").text(kyujinDetail[6][4]);
		$("#content").text(kyujinDetail[6][5]);
		$("#tel").text(kyujinDetail[6][6]);
		$("#url").text("URL："+url[5]);
	}
	function kensetsu7() {
		$("#company").text(kensetsu[6]);
		$("#business").text(kyujinDetail[7][2]);
		$("#place").text(kyujinDetail[7][4]);
		$("#content").text(kyujinDetail[7][5]);
		$("#tel").text(kyujinDetail[7][6]);
		$("#url").text("URL："+url[6]);
	}
	function kensetsu8() {
		$("#company").text(kensetsu[7]);
		$("#business").text(kyujinDetail[8][2]);
		$("#place").text(kyujinDetail[8][4]);
		$("#content").text(kyujinDetail[8][5]);
		$("#tel").text(kyujinDetail[8][6]);
		$("#url").text("URL："+url[7]);
	}
	function kensetsu9() {
		$("#company").text(kensetsu[8]);
		$("#business").text(kyujinDetail[9][2]);
		$("#place").text(kyujinDetail[9][4]);
		$("#content").text(kyujinDetail[9][5]);
		$("#tel").text(kyujinDetail[9][6]);
		$("#url").text("URL："+url[8]);
	}
	function kensetsu10() {
		$("#company").text(kensetsu[9]);
		$("#business").text(kyujinDetail[10][2]);
		$("#place").text(kyujinDetail[10][4]);
		$("#content").text(kyujinDetail[10][5]);
		$("#tel").text(kyujinDetail[10][6]);
		$("#url").text("URL："+url[9]);
	}
	function constructionDetail2() {
		$("#company").text("2");
		$("#business").text("業種：情報通信：ｿﾌﾄｳｴｱ･情報処理・情報ｻｰﾋﾞｽ");
		$("#place").text("本社所在地：東京都渋谷区円山町5-3 玉川屋ﾋﾞﾙ8階");
		$("#content").text("事業内容：ｼｽﾃﾑ開発（設計・開発・保守・運用）ﾊﾟｯｹｰｼﾞ開発・販売");
		$("#tel").text("電話番号：03-3770-3501");
		$("#url").text("URL："+url[1]);
	}
	function constructionDetail3() {
		$("#company").text("3");
		$("#business").text("業種：情報通信：ｿﾌﾄｳｴｱ･情報処理・情報ｻｰﾋﾞｽ");
		$("#place").text("本社所在地：東京都渋谷区円山町5-3 玉川屋ﾋﾞﾙ8階");
		$("#content").text("事業内容：ｼｽﾃﾑ開発（設計・開発・保守・運用）ﾊﾟｯｹｰｼﾞ開発・販売");
		$("#tel").text("電話番号：03-3770-3501");
		$("#url").text("URL："+url[0]);
	}
	function constructionDetail4() {
		$("#company").text("4");
		$("#business").text("業種：情報通信：ｿﾌﾄｳｴｱ･情報処理・情報ｻｰﾋﾞｽ");
		$("#place").text("本社所在地：東京都渋谷区円山町5-3 玉川屋ﾋﾞﾙ8階");
		$("#content").text("事業内容：ｼｽﾃﾑ開発（設計・開発・保守・運用）ﾊﾟｯｹｰｼﾞ開発・販売");
		$("#tel").text("電話番号：03-3770-3501");
		$("#url").text("URL："+url[0]);
	}
	function constructionDetail5() {
		$("#company").text("5");
		$("#business").text("業種：情報通信：ｿﾌﾄｳｴｱ･情報処理・情報ｻｰﾋﾞｽ");
		$("#place").text("本社所在地：東京都渋谷区円山町5-3 玉川屋ﾋﾞﾙ8階");
		$("#content").text("事業内容：ｼｽﾃﾑ開発（設計・開発・保守・運用）ﾊﾟｯｹｰｼﾞ開発・販売");
		$("#tel").text("電話番号：03-3770-3501");
		$("#url").text("URL："+url[0]);
	}
	function constructionDetail6() {
		$("#company").text("6");
		$("#business").text("業種：情報通信：ｿﾌﾄｳｴｱ･情報処理・情報ｻｰﾋﾞｽ");
		$("#place").text("本社所在地：東京都渋谷区円山町5-3 玉川屋ﾋﾞﾙ8階");
		$("#content").text("事業内容：ｼｽﾃﾑ開発（設計・開発・保守・運用）ﾊﾟｯｹｰｼﾞ開発・販売");
		$("#tel").text("電話番号：03-3770-3501");
		$("#url").text("URL："+url[0]);
	}
	function constructionDetail7() {
		$("#company").text("7");
		$("#business").text("業種：情報通信：ｿﾌﾄｳｴｱ･情報処理・情報ｻｰﾋﾞｽ");
		$("#place").text("本社所在地：東京都渋谷区円山町5-3 玉川屋ﾋﾞﾙ8階");
		$("#content").text("事業内容：ｼｽﾃﾑ開発（設計・開発・保守・運用）ﾊﾟｯｹｰｼﾞ開発・販売");
		$("#tel").text("電話番号：03-3770-3501");
		$("#url").text("URL："+url[0]);
	}
	function constructionDetail8() {
		$("#company").text("8");
		$("#business").text("業種：情報通信：ｿﾌﾄｳｴｱ･情報処理・情報ｻｰﾋﾞｽ");
		$("#place").text("本社所在地：東京都渋谷区円山町5-3 玉川屋ﾋﾞﾙ8階");
		$("#content").text("事業内容：ｼｽﾃﾑ開発（設計・開発・保守・運用）ﾊﾟｯｹｰｼﾞ開発・販売");
		$("#tel").text("電話番号：03-3770-3501");
		$("#url").text("URL："+url[0]);
	}
	function constructionDetail9() {
		$("#company").text("9");
		$("#business").text("業種：情報通信：ｿﾌﾄｳｴｱ･情報処理・情報ｻｰﾋﾞｽ");
		$("#place").text("本社所在地：東京都渋谷区円山町5-3 玉川屋ﾋﾞﾙ8階");
		$("#content").text("事業内容：ｼｽﾃﾑ開発（設計・開発・保守・運用）ﾊﾟｯｹｰｼﾞ開発・販売");
		$("#tel").text("電話番号：03-3770-3501");
		$("#url").text("URL："+url[0]);
	}
	function maker1() {
		$("#company").text("株式会社アイシーオー");
		$("#business").text("業種：情報通信：ｿﾌﾄｳｴｱ･情報処理・情報ｻｰﾋﾞｽ");
		$("#place").text("本社所在地：神奈川県横浜市西区楠町5-5 横浜ｺｰﾖｰ八番館202");
		$("#content").text("事業内容：ｿﾌﾄｳｪｱの設計・開発・保守・評価（制御・組込・通信系・ｵｰﾌﾟﾝ系）");
		$("#tel").text("電話番号：045-548-4919");
		$("#url").text("URL："+url[1]);
	}
	function makerDetail2() {
		$("#company").text("2");
		$("#business").text("業種：情報通信：ｿﾌﾄｳｴｱ･情報処理・情報ｻｰﾋﾞｽ");
		$("#place").text("本社所在地：神奈川県横浜市西区楠町5-5 横浜ｺｰﾖｰ八番館202");
		$("#content").text("事業内容：ｿﾌﾄｳｪｱの設計・開発・保守・評価（制御・組込・通信系・ｵｰﾌﾟﾝ系）");
		$("#tel").text("電話番号：045-548-4919");
		$("#url").text("URL："+url[1]);
	}
	function makerDetail3() {
		$("#company").text("3");
		$("#business").text("業種：情報通信：ｿﾌﾄｳｴｱ･情報処理・情報ｻｰﾋﾞｽ");
		$("#place").text("本社所在地：神奈川県横浜市西区楠町5-5 横浜ｺｰﾖｰ八番館202");
		$("#content").text("事業内容：ｿﾌﾄｳｪｱの設計・開発・保守・評価（制御・組込・通信系・ｵｰﾌﾟﾝ系）");
		$("#tel").text("電話番号：045-548-4919");
		$("#url").text("URL："+url[1]);
	}
	function makerDetail4() {
		$("#company").text("4");
		$("#business").text("業種：情報通信：ｿﾌﾄｳｴｱ･情報処理・情報ｻｰﾋﾞｽ");
		$("#place").text("本社所在地：神奈川県横浜市西区楠町5-5 横浜ｺｰﾖｰ八番館202");
		$("#content").text("事業内容：ｿﾌﾄｳｪｱの設計・開発・保守・評価（制御・組込・通信系・ｵｰﾌﾟﾝ系）");
		$("#tel").text("電話番号：045-548-4919");
		$("#url").text("URL："+url[1]);
	}
	function makerDetail5() {
		$("#company").text("5");
		$("#business").text("業種：情報通信：ｿﾌﾄｳｴｱ･情報処理・情報ｻｰﾋﾞｽ");
		$("#place").text("本社所在地：神奈川県横浜市西区楠町5-5 横浜ｺｰﾖｰ八番館202");
		$("#content").text("事業内容：ｿﾌﾄｳｪｱの設計・開発・保守・評価（制御・組込・通信系・ｵｰﾌﾟﾝ系）");
		$("#tel").text("電話番号：045-548-4919");
		$("#url").text("URL："+url[1]);
	}
	function makerDetail6() {
		$("#company").text("6");
		$("#business").text("業種：情報通信：ｿﾌﾄｳｴｱ･情報処理・情報ｻｰﾋﾞｽ");
		$("#place").text("本社所在地：神奈川県横浜市西区楠町5-5 横浜ｺｰﾖｰ八番館202");
		$("#content").text("事業内容：ｿﾌﾄｳｪｱの設計・開発・保守・評価（制御・組込・通信系・ｵｰﾌﾟﾝ系）");
		$("#tel").text("電話番号：045-548-4919");
		$("#url").text("URL："+url[1]);
	}
	function makerDetail7() {
		$("#company").text("7");
		$("#business").text("業種：情報通信：ｿﾌﾄｳｴｱ･情報処理・情報ｻｰﾋﾞｽ");
		$("#place").text("本社所在地：神奈川県横浜市西区楠町5-5 横浜ｺｰﾖｰ八番館202");
		$("#content").text("事業内容：ｿﾌﾄｳｪｱの設計・開発・保守・評価（制御・組込・通信系・ｵｰﾌﾟﾝ系）");
		$("#tel").text("電話番号：045-548-4919");
		$("#url").text("URL："+url[1]);
	}
	function makerDetail8() {
		$("#company").text("8");
		$("#business").text("業種：情報通信：ｿﾌﾄｳｴｱ･情報処理・情報ｻｰﾋﾞｽ");
		$("#place").text("本社所在地：神奈川県横浜市西区楠町5-5 横浜ｺｰﾖｰ八番館202");
		$("#content").text("事業内容：ｿﾌﾄｳｪｱの設計・開発・保守・評価（制御・組込・通信系・ｵｰﾌﾟﾝ系）");
		$("#tel").text("電話番号：045-548-4919");
		$("#url").text("URL："+url[1]);
	}
	function makerDetail9() {
		$("#company").text("9");
		$("#business").text("業種：情報通信：ｿﾌﾄｳｴｱ･情報処理・情報ｻｰﾋﾞｽ");
		$("#place").text("本社所在地：神奈川県横浜市西区楠町5-5 横浜ｺｰﾖｰ八番館202");
		$("#content").text("事業内容：ｿﾌﾄｳｪｱの設計・開発・保守・評価（制御・組込・通信系・ｵｰﾌﾟﾝ系）");
		$("#tel").text("電話番号：045-548-4919");
		$("#url").text("URL："+url[1]);
	}
	
	function detail1() {
		$("#company").text("株式会社エクセル・システムプロダクト");
		$("#business").text("業種：情報通信：ｿﾌﾄｳｴｱ･情報処理・情報ｻｰﾋﾞｽ");
		$("#place").text("本社所在地：東京都渋谷区円山町5-3 玉川屋ﾋﾞﾙ8階");
		$("#content").text("事業内容：ｼｽﾃﾑ開発（設計・開発・保守・運用）ﾊﾟｯｹｰｼﾞ開発・販売");
		$("#tel").text("電話番号：03-3770-3501");
		$("#url").text("URL："+url[0]);
	}
	function detail2() {
		$("#company").text("株式会社アイシーオー");
		$("#business").text("業種：情報通信：ｿﾌﾄｳｴｱ･情報処理・情報ｻｰﾋﾞｽ");
		$("#place").text("本社所在地：神奈川県横浜市西区楠町5-5 横浜ｺｰﾖｰ八番館202");
		$("#content").text("事業内容：ｿﾌﾄｳｪｱの設計・開発・保守・評価（制御・組込・通信系・ｵｰﾌﾟﾝ系）");
		$("#tel").text("電話番号：045-548-4919");
		$("#url").text("URL："+url[1]);
	}
	
	function detail3() {
		$("#company").text("越野建設株式会社");
		$("#business").text("業種：建設業：建築･建設");
		$("#place").text("本社所在地：東京都北区王子4-22-9");
		$("#content").text("事業内容：総合建設業");
		$("#tel").text("電話番号：03-3913-4511");
		$("#url").text("URL："+url[2]);
	}
	function detail4() {
		$("#company").text("矢野建設株式会社");
		$("#business").text("業種：建設業：建築･建設");
		$("#place").text("本社所在地：大阪府大阪市中央区南船場4-6-10 新東和ﾋﾞﾙ3F");
		$("#content").text("事業内容：総合建設業");
		$("#tel").text("電話番号：06-4704-0471");
		$("#url").text("URL："+url[3]);
	}
	function detail5() {
		$("#company").text("株式会社ジェータックス");
		$("#business").text("業種：商社：機械器具･ＯＡ製品");
		$("#place").text("本社所在地：愛知県名古屋市中村区名駅4-6-17 名古屋ﾋﾞﾙﾃﾞｨﾝｸﾞ11F");
		$("#content").text("事業内容：ﾄﾖﾀ車の特装・用品架装に関わる企画、開発、生産、販売");
		$("#tel").text("電話番号：052-569-5881");
		$("#url").text("URL："+url[4]);
	}
	function detail6() {
		$("#company").text("広和株式会社");
		$("#business").text("業種：ﾒｰｶｰ：一般機械･産業機械");
		$("#place").text("本社所在地：大阪府大阪市此花区西九条1-3-31 広和ﾋﾞﾙ");
		$("#content").text("事業内容：潤滑、給油装置製造の製造、人口漁礁の製造水中探査機の製造、ﾚﾄﾙﾄ食品製造");
		$("#tel").text("電話番号：06-6462-7155");
		$("#url").text("URL："+url[5]);
	}
	function detail7() {
		$("#company").text("株式会社マキノ");
		$("#business").text("業種：ﾒｰｶｰ：一般機械･産業機械");
		$("#place").text("本社所在地：愛知県常滑市大曽町3-1");
		$("#content").text("事業内容：環境・水処理、食品・化学、ｴｺ・ﾘｻｲｸﾙ、ｾﾗﾐｯｸｽ製造機器の設計・製造・販売");
		$("#tel").text("電話番号：0569-36-0111");
		$("#url").text("URL："+url[6]);
	}
	function detail8() {
		$("#company").text("株式会社ライフク");
		$("#business").text("業種：建設業：設備工事･ﾌﾟﾗﾝﾄ･内装");
		$("#place").text("本社所在地：愛知県名古屋市守山区花咲台2-104");
		$("#content").text("事業内容：樹脂・鉄鋼製品加工製造・販売、工事業土木関連製品販売業");
		$("#tel").text("電話番号：052-799-3134");
		$("#url").text("URL："+url[7]);
	}
	function detail9() {
		$("#company").text("山梨建鉄株式会社");
		$("#business").text("業種：建設業：設備工事･ﾌﾟﾗﾝﾄ･内装");
		$("#place").text("本社所在地：山梨県中央市一町畑882-1");
		$("#content").text("事業内容：建築鉄骨製作、施工");
		$("#tel").text("電話番号：055-242-8788");
		$("#url").text("URL："+url[8]);
	}
});