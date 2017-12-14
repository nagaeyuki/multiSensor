
var socket = io.connect(location.origin);
$(function () {
    socket.on("nowFront", function (data) {
        var angleZ;
        switch (data) {
            case 1:
                angleZ = 0;
                break;
            case 2:
                angleZ = 70;
                angleZ = 20;
                break;
            case 3:
                angleZ = -90;
                break;
            case 4:
                angleZ = 90;
                break;
            case 5:
                angleX = -110;
                angleZ = -20;
                break;
            case 6:
                angleZ = 180;
        }
        var AngleRotate = "";
        AngleRotate = AngleRotate + "rotateZ(" + angleZ + "deg)";
        if (AngleRotate != "") {
            document.getElementById("cube1").style.transform = AngleRotate;
        }
    });
// socket.on("test", function (data) {
//     if (-4 <= data && data <= 4){
//     }else{
//     var angleX = document.getElementById("tax").value;
//     var angleY = data;
//         var angleZ = document.getElementById("taz").value;
//     var AngleRotate = "";
//     if (angleX == parseFloat(angleX)) { AngleRotate = AngleRotate + "rotateX(" + angleX + "deg)" };
//     if (angleY == parseFloat(angleY)) { AngleRotate = AngleRotate + "rotateY(" + angleY + "deg)" };
//     if (angleZ == parseFloat(angleZ)) { AngleRotate = AngleRotate + "rotateZ(" + angleZ + "deg)" };

//     if (AngleRotate != "") { document.getElementById("cube").style.transform = AngleRotate };
//     }
// });
/* 回転ボタンをクリックされた時 */
document.querySelector("#rotation").onclick = function () { angle(); };
/* リセットボタンをクリックされた時 */
document.querySelector("#reset").onclick = function () { angle_init(); };
/* cubeのデフォルト */
function angle_init() {
    document.getElementById("tax").value = "-20";
    document.getElementById("tay").value = "-20";
    document.getElementById("taz").value = "-20";
    angle();
}
/* cubeを入力値に回転させる */
function angle() {
    var angleX = document.getElementById("tax").value;
    var angleY = document.getElementById("tay").value;
    var angleZ = document.getElementById("taz").value;
    var AngleRotate = "";
    if (angleX == parseFloat(angleX)) { AngleRotate = AngleRotate + "rotateX(" + angleX + "deg)" };
    if (angleY == parseFloat(angleY)) { AngleRotate = AngleRotate + "rotateY(" + angleY + "deg)" };
    if (angleZ == parseFloat(angleZ)) { AngleRotate = AngleRotate + "rotateZ(" + angleZ + "deg)" };

    if (AngleRotate != "") { document.getElementById("cube1").style.transform = AngleRotate };
}
});

