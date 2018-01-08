
var socket = io.connect(location.origin);


$(function () {
    var accelex = document.getElementById('accelex');
    var acceley = document.getElementById('acceley');
    var accelez = document.getElementById('accelez');
    var gyrox = document.getElementById('gyrox');
    var gyroy = document.getElementById('gyroy');
    var gyroz = document.getElementById('gyroz');
    var Akakudox = document.getElementById('Akakudox');
    var Akakudoy = document.getElementById('Akakudoy');
    var Akakudoz = document.getElementById('Akakudoz');
    // var angleX;
    // var angleY;
    // var angleZ;
    // var nowFront;
    var X=0;
    var Y=0;
    var Z=0;
    socket.on("ondata", function (data) {
        // X = (X * 0.8 + data.x * 0.2).toFixed(5);
        // Y = (Y * 0.8 + data.y * 0.2).toFixed(5);
        // Z = (Z * 0.8 + data.z * 0.2).toFixed(5);
        X =X * 0.9 + data.x * 0.1;
Y = Y * 0.9 + data.y * 0.1;
Z = Z * 0.9 + data.z * 0.1;
        // X = data.x;
        // Y = data.y;
        // Z = data.z;
        // if(Math.abs(X) <= 0.1){
        //     X = 0;
        // }
        // if(Math.abs(Y) <= )
        //  X = (Math.abs(X) <= 0.13) ? 0 : X;
        //  Y = (Math.abs(Y) <= 0.13) ? 0 : Y;
        //  Z =(Math.abs(Z) <= 0.13) ? 0 : Z;
        var gravity = Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2) + Math.pow(Z, 2));
        console.log(gravity);
        //あらめの角度計算
        // var X_a = Math.asin(Y / Math.sqrt(Math.pow(Y, 2) + Math.pow(Z, 2))) * (180 / Math.PI);
        // var Y_a = Math.asin(X / Math.sqrt(Math.pow(X, 2) + Math.pow(Z, 2))) * (180 / Math.PI);
        var X_a = Math.atan2(X , Math.sqrt(Math.pow(Y, 2) + Math.pow(Z, 2))) * (180 / Math.PI);
        var Y_a = Math.atan2(Y , Math.sqrt(Math.pow(X, 2) + Math.pow(Z, 2))) * (180 / Math.PI);
        var Z_a = Math.atan2(Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2)) , Z) * (180 / Math.PI);
        // var X_a = Math.atan(X/ Math.sqrt(Math.pow(Y, 2) + Math.pow(Z, 2))) * (180 / Math.PI);
        // var Y_a = Math.atan(Y/ Math.sqrt(Math.pow(X, 2) + Math.pow(Z, 2))) * (180 / Math.PI);

        // var Z_a = Math.atan(Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2))/ Z) * (180 / Math.PI);
        // var X_a = ((Math.asin(Y) * (180 / 3.1415)).toFixed(1));
        // var Y_a = ((Math.asin(X) * (180 / 3.1415)).toFixed(1));
    //    var  X_a = value_adjust((Math.asin(Y) * (180 / 3.1415)).toFixed(1));
    //     var Y_a = value_adjust((Math.asin(X) * (180 / 3.1415)).toFixed(1));
        console.log(Math.asin(0));
        Akakudox.innerHTML = X_a;
        Akakudoy.innerHTML = Y_a;
        Akakudoz.innerHTML = Z_a;

        
        $('#cube0').css({
            rotateX: X_a + "deg",
            rotateY: Y_a + "deg"
            // rotateZ: Z_a + "deg"
        });
    
        
        //精度良い角度計算 後で書く

        accelex.innerHTML = X;
        acceley.innerHTML = Y;
        accelez.innerHTML = Z;

    });
    var deviceList = [];
    for (var i = 0; i < 4; i++) {
        deviceList[i] = [];
        deviceList[i] = {
            acceleX: 0, acceleY: 0, acceleZ: 0,
            angleX: 0, angleY: 0, angleZ: 0,
            nowFront: '', angle: 0, preangle: 0, circleangle: 0
        };
    }
    socket.on("acceledata", function (data) {
        var id = data.sensorIdNumber;
        
        deviceList[id].nowFront = data.nowFront;
        switch (deviceList[id].nowFront) {
            case 1:
                axis_adjust(-90, 0, 0, id);
                // axis_adjust(90, 180, 180);
                break;
            case 2:
                axis_adjust(0, 0, 0, id);
                // axis_adjust(0, 0, 0);
                break;
            case 3:
                axis_adjust(-90, 0, 90, id);
                // axis_adjust(0, 90, 0);
                break;
            case 4:
                // axis_adjust(0, -90, 0);
                axis_adjust(-90, 0, -90, id);
                break;
            case 5:
                axis_adjust(0, 180, 0, id);
                // axis_adjust(180, 0, 0);
                break;
            case 6:
                axis_adjust(90, 0, 0, id);
                // axis_adjust(90, 180, 0);
                break;
        }
        accele_rotate(deviceList[id].acceleX + deviceList[id].angleX, 
                      deviceList[id].acceleY + deviceList[id].angleY, 
                      deviceList[id].acceleZ + deviceList[id].angleZ, 
                      id);
        // accele_rotate(deviceList[id].acceleX,
        //               deviceList[id].acceleY, 
        //               deviceList[id].acceleZ, 
        //               id + 1);
    });

   
    
    socket.on("gyrodata", function (data) {
        var AngleRotate = "";
        var flg = true;
        var id = data.sensorIdNumber;
        var angle = deviceList[id].angle;
        var preangle = deviceList[id].preangle;
        var circleangle = deviceList[id].circleangle;
        if(data.angle != 0){
        // console.log("first" + id);
        angle += Math.round(data.angle);  //角度を四捨五入
        preangle = Math.abs(angle) % 360;
        circleangle = Math.floor(Math.abs(angle) / 360); //360度が何個あるか
        console.log("id:" + id);
        if (preangle < 20) {
            preangle = 0;
        } else if (70 <= preangle && preangle <= 110) {
            preangle = 90;
        } else if (160 < preangle && preangle <= 200) {
            preangle = 180;
        } else if (250 < preangle && preangle <= 290) {
            preangle = 270;
        } else if (340 < preangle) {
            preangle = 360;
        } else {
            flag = false;
        }

        if (flg && angle < 0) {
            angle = -preangle - circleangle * 360;
        } else {
            angle = preangle + circleangle * 360;
        }
        // console.log("second" + id);
        // console.log("angleid:" + angle + "circle:" + circleangle);


        switch (deviceList[id].nowFront) {
            case 1:
                deviceList[id].angleY = angle;
                break;
            case 2:
                deviceList[id].angleZ = -angle;
                break;
            case 3:
                deviceList[id].angleY = angle;

                break;
            case 4:
                deviceList[id].angleY = angle;

                break;
            case 5:
                deviceList[id].angleZ = angle;
                break;
            case 6:
                deviceList[id].angleY = -angle;
                break;
        }
        deviceList[id].angle = angle;
        deviceList[id].preangle = preangle;
        deviceList[id].circleangle = circleangle;
        gyro_rotate(deviceList[id].angleX, deviceList[id].angleY, deviceList[id].angleZ, id);
        // gyro_rotate(angleX, angleY, angle, data.sensorIdNumber+1);
        }
    });
    function axis_adjust(X, Y, Z, id) {
        deviceList[id].acceleX = X;
        deviceList[id].acceleY = Y;
        deviceList[id].acceleZ = Z;
    }
    function accele_rotate(X, Y, Z, id) {
        var AngleRotate = "";
        AngleRotate += "rotateX(" + X + "deg)";
        AngleRotate += "rotateY(" + Y + "deg)";
        AngleRotate += "rotateZ(" + Z + "deg)";
        $('#cube' + id).animate({
            rotateX: X + "deg",
            rotateY: Y + "deg",
            rotateZ: Z + "deg"
        }, 300, 'linear');
    }

    function gyro_rotate(X, Y, Z, id) {
        var AngleRotate = "";
        AngleRotate += "rotateX(" + X + "deg)";
        AngleRotate += "rotateY(" + Y + "deg)";
        AngleRotate += "rotateZ(" + Z + "deg)";
        // console.log('#cube' + id);
        $('#cube' + id).animate({
            rotateX: X + "deg",
            rotateY: Y + "deg",
            rotateZ: Z + "deg"
        }, 300, 'linear');

        // });
        // document.getElementById("cube" + id).style.transform = AngleRotate;
    }

    function value_adjust(value){
        return Math.floor(value / 2) * 2;
    }

    /* 回転ボタンをクリックされた時 */
    // document.querySelector("#rotation").onclick = function () { angle2(); };
    // /* リセットボタンをクリックされた時 */
    // document.querySelector("#reset").onclick = function () { angle_init(); };
    // /* cubeのデフォルト */
    // function angle_init() {
    //     document.getElementById("tax").value = "-20";
    //     document.getElementById("tay").value = "-20";
    //     // document.getElementById("taz").value = "-20";
    //     angle();
    // }
    /* cubeを入力値に回転させる */
    function angle2() {
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

