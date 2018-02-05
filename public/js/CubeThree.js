
var socket = io.connect(location.origin);
// window.addEventListener("load", function () {
// // resizeTo(516, 539);
// threeStart(); //Three.jsのスタート関数の実行
// });

$(function () {
    window.addEventListener('DOMContentLoaded', threeStart);
    function threeStart() {
        initThree();
        initObject();
        initCamera();
        // initAxis();
        initLight();
        // renderer.render(scene, camera);
        // draw2();
    }
    var render;
    var scene;
    var canvas;
    var width = 960;
    var height = 540;
    var fov = 45; //視野角0~90
    var near = 1;
    var far = 10000;
    var aspect = width / height;

    function initThree() {
        // レンダラーを作成
        canvas = document.getElementById('canvasFrame');
        renderer = new THREE.WebGLRenderer();
        // renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
        renderer.setClearColor(0xEEEEEE, 1.0);
        canvas.appendChild(renderer.domElement);
        // シーンを作成
        scene = new THREE.Scene();
    }
    var camera;
    function initCamera() {
        // カメラを作成
        camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(0, 0, 600);
        //カメラの上ベクトルの設定
        // camera.up.set(0, 0, 0);
        //カメラの中心位置ベクトルの設定
        // camera.lookAt({ x: 0, y: 0, z: 0 }); //トラックボール利用時は自動的に無効
        // camera.up.set(0, 0, 1); // カメラの上方向ベクトルの設定
        // camera.lookAt({ x: 400, y: 400, z: 600 }); // カメラ視野の中心座標の設定
        // camera.lookAt(cube[0].position); // メッシュの位置にカメラを向ける。
    }
    var cubegeometry = [];
    var cubematerial = [];
    var cube = [];
    function initObject() {
        for (var i = 0; i < 4; i++) {
            cubegeometry[i] = new THREE.BoxGeometry(100, 100, 100);
            cubematerial[i] = [
                new THREE.MeshLambertMaterial({ color: 0x00ff00 }),
                new THREE.MeshLambertMaterial({ color: 0xf0ffff }),
                new THREE.MeshLambertMaterial({ color: 0x0000ff }),
                new THREE.MeshLambertMaterial({ color: 0xffa500 }),
                new THREE.MeshLambertMaterial({ color: 0xff0000 }),
                new THREE.MeshLambertMaterial({ color: 0xda70d6 })
            ];
            cube[i] = new THREE.Mesh(cubegeometry[i], cubematerial[i]);
            scene.add(cube[i]);
        }
        cube[0].position.x = -100;
        cube[0].position.y = 100;
        cube[1].position.x = 100;
        cube[1].position.y = 100;
        cube[2].position.x = -100;
        cube[2].position.y = -100;
        cube[3].position.x = 100;
        cube[3].position.y = -100;

    }

    var light;
    var ambientLight;
    function initLight() {
        // 平行光源
        light = new THREE.DirectionalLight(0xFFFFFF, 1);
        // light.intensity = 2; // 光の強さを倍に
        light.position.set(200, 200, 800);
        // シーンに追加
        scene.add(light);
        //環境光源 基本的には他の光源と一緒に使用する　3dオブジェクトに均等に光を当てられる
        ambientLight = new THREE.AmbientLight(0x555555); // 光源色を指定して生成
        scene.add(ambientLight); // シーンに追加
    }

    var axis; //軸オブジェクト
    function initAxis() {
        //軸オブジェクトの生成
        axis = new THREE.AxisHelper(100);
        //軸オブジェクトのシーンへの追加
        scene.add(axis);
        //軸オブジェクトの位置座標を設定
        axis.position.set(0, 0, 0);
    }

    var accelex = document.getElementById('accelex');
    var acceley = document.getElementById('acceley');
    var accelez = document.getElementById('accelez');
    var gyrox = document.getElementById('gyrox');
    var gyroy = document.getElementById('gyroy');
    var gyroz = document.getElementById('gyroz');
    var Akakudox = document.getElementById('Akakudox');
    var Akakudoy = document.getElementById('Akakudoy');
    var Akakudoz = document.getElementById('Akakudoz');
    var X = 0;
    var Y = 0;
    var Z = 0;
    var X_a = 0;
    var Y_a = 0;
    var Z_a = 0;
    var roll = 0;
    var pitch = 0;
    var yaw = 0;
    var angleX = 0;
    var angleY = 0;
    var angleZ = 0;
    var preangleX = 0;
    var preangleY = 0;
    var preangleZ = 0;
    var preX = 0;
    var preY = 0;
    var preZ = 0;
    var preroll = 0;
    var prepitch = 0;
    var preyaw = 0;
    var filter = 0.9;
    var gyroX = 0;
    var gyroY = 0;
    var gyroZ = 0;
    var radian = Math.PI / 180; //度をラジアンに変換
    var degree = 180 / Math.PI; //ラジアンを度に変換
    var sensorId = -1;

    socket.on("ondata", function (data) {
        X = X * 0.9 + data.x * 0.1;
        Y = Y * 0.9 + data.y * 0.1;
        Z = Z * 0.9 + data.z * 0.1;
        // X = data.x;
        // Y = data.y;
        // Z = data.z;
        var gravity = Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2) + Math.pow(Z, 2));
        // console.log(gravity);
        //あらめの角度計算
        // var X_a = Math.asin(Y / Math.sqrt(Math.pow(Y, 2) + Math.pow(Z, 2))) * (180 / Math.PI);
        // var Y_a = Math.asin(X / Math.sqrt(Math.pow(X, 2) + Math.pow(Z, 2))) * (180 / Math.PI);
        X_a = Math.atan2(X, Math.sqrt(Math.pow(Y, 2) + Math.pow(Z, 2))) * degree;
        Y_a = Math.atan2(Y, Math.sqrt(Math.pow(X, 2) + Math.pow(Z, 2))) * degree;
        Z_a = Math.atan2(Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2)), Z) * degree;
        // var X_a = Math.atan(X/ Math.sqrt(Math.pow(Y, 2) + Math.pow(Z, 2))) * (180 / Math.PI);
        // var Y_a = Math.atan(Y/ Math.sqrt(Math.pow(X, 2) + Math.pow(Z, 2))) * (180 / Math.PI);

        // var Z_a = Math.atan(Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2))/ Z) * (180 / Math.PI);
        // var X_a = ((Math.asin(Y) * (180 / 3.1415)).toFixed(1));
        // var Y_a = ((Math.asin(X) * (180 / 3.1415)).toFixed(1));
        //    var  X_a = value_adjust((Math.asin(Y) * (180 / 3.1415)).toFixed(1));
        //     var Y_a = value_adjust((Math.asin(X) * (180 / 3.1415)).toFixed(1));
        // console.log(Math.asin(0));
        // Akakudox.innerHTML = X_a;
        // Akakudoy.innerHTML = Y_a;
        // Akakudoz.innerHTML = Z_a;
        // accelex.innerHTML = X;
        // acceley.innerHTML = Y;
        // accelez.innerHTML = Z;
    });

    socket.on("gyrodata", function (data) {

        var X = kirisuteG(data.X);
        var Y = kirisuteG(data.Y);
        var Z = kirisuteG(data.Z);
        // console.log("X: " + X);
        // console.log("Y: " + Y);
        // console.log("Z: " + Z);
        // console.log(data.X);
        // roll += data.X;
        // pitch += data.Y;
        // yaw += data.Z;
        // console.log(roll);
        // roll += (preroll * filter + data.X * (1-filter)) * 0.1 *radian;
        // pitch += (prepitch * filter + data.Y * (1 - filter)) * 0.1 *radian;
        // yaw += (preyaw * filter + data.Z * (1 - filter)) * 0.1 *radian;

        gyroX += (X + preroll) * 0.1 / 2;
        gyroY += (Y + prepitch) * 0.1 / 2;
        gyroZ += (Z + preyaw) * 0.1 / 2;
        // console.log(gyroX);
        roll = (preroll * filter + X * (1 - filter)) * 0.1;
        pitch = (prepitch * filter + Y * (1 - filter)) * 0.1;
        yaw = (preyaw * filter + Z * (1 - filter)) * 0.1;
        preroll = X;
        prepitch = Y;
        preyaw = Z;
        // console.log("a"+roll);
        // roll = data.angle[0];
        // pitch = data.angle[1];
        // yaw = data.angle[2];
        // switch (data.axis) {
        //     case 0: gyrox.innerHTML = data.angle[0];
        //         break;
        //     case 1:
        //         gyroy.innerHTML = data.angle[1];
        //         break;
        //     case 2: gyroz.innerHTML = data.angle[2];
        //         break;
        // }


        // roll += pitch * sin(gz * dt * pi() / 180);
        // pitch -= roll * sin(gz * dt * pi() / 180);
        // roll += pitch * Math.sin(yaw * Math.PI / 180);
        // pitch -= roll * Math.sin(yaw * Math.PI / 180);
        // console.log(roll);

        // gyrox.innerHTML = roll * degree;
        // gyroy.innerHTML = pitch * degree;
        // gyroz.innerHTML = yaw * degree;

    });
    socket.on("gyrodata2", function (data) {

        var X = kirisuteG(data.X);
        var Y = kirisuteG(data.Y);
        var Z = kirisuteG(data.Z);
        // roll += data.X;
        // pitch += data.Y;
        // yaw += data.Z;
        // console.log(roll);
        // console.log("aa"+data.angle[data.axis]);
        gyroX = data.angle[data.axis];
        // gyroX += (X + preroll) * 0.1 / 2;
        // gyroY += (Y + prepitch) * 0.1 / 2;
        // gyroZ += (Z + preyaw) * 0.1 / 2;
        // console.log(gyroX);
        roll += (preroll * filter + X * (1 - filter)) * 0.1;
        pitch += (prepitch * filter + Y * (1 - filter)) * 0.1;
        yaw += (preyaw * filter + Z * (1 - filter)) * 0.1;
        preroll = X;
        prepitch = Y;
        preyaw = Z;
        // console.log("a"+roll);
        // roll = data.angle[0];
        // pitch = data.angle[1];
        // yaw = data.angle[2];
        // switch (data.axis) {
        //     case 0: gyrox.innerHTML = data.angle[0];
        //         break;
        //     case 1:
        //         gyroy.innerHTML = data.angle[1];
        //         break;
        //     case 2: gyroz.innerHTML = data.angle[2];
        //         break;
        // }


        // roll += pitch * sin(gz * dt * pi() / 180);
        // pitch -= roll * sin(gz * dt * pi() / 180);
        roll += pitch * Math.sin(yaw * Math.PI / 180);
        pitch -= roll * Math.sin(yaw * Math.PI / 180);
        // console.log(roll);

        // gyrox.innerHTML = roll * degree;
        // gyroy.innerHTML = pitch * degree;
        // gyroz.innerHTML = yaw * degree;
    });

    // function draw2() {
    //     requestAnimationFrame(draw2);
var accele = [0,1,2,3];
    for (var i = 0; i < accele.length; i++) {
        accele[i] = [];
        accele[i][0] = 0;
    }

    var deviceList = [];
    for (var i = 0; i < 4; i++) {
        deviceList[i] = [];
        deviceList[i] = {
            acceleX: 0, acceleY: 0, acceleZ: 0,
            preacceleX: 0, preacceleY: 0, preacceleZ: 0,
            angleX: 0, angleY: 0, angleZ: 0,
            X_a: 0, Y_a: 0, Z_a: 0 
        };
    }
    socket.on("accele", function (data) {
        sensorId = data.sensorIdNumber;
        // X = preX * filter + data.x * (1 - filter);
        // Y = preY * filter + data.y * (1 - filter);
        // Z = preZ * filter + data.z * (1 - filter);
        deviceList[sensorId].acceleX = deviceList[sensorId].preacceleX * filter + data.x * (1 - filter);
        deviceList[sensorId].acceleY = deviceList[sensorId].preacceleY * filter + data.y * (1 - filter);
        deviceList[sensorId].acceleZ = deviceList[sensorId].preacceleZ * filter + data.z * (1 - filter);
        accelex.innerHTML = deviceList[0].acceleX;
        acceley.innerHTML = deviceList[0].acceleY;
        accelez.innerHTML = deviceList[0].acceleZ;

        // deviceList[sensorId].preacceleX = data.x;
        // deviceList[sensorId].preacceleY = data.y;
        // deviceList[sensorId].preacceleZ = data.z;
        deviceList[sensorId].preacceleX = deviceList[sensorId].acceleX;
        deviceList[sensorId].preacceleY = deviceList[sensorId].acceleY;
        deviceList[sensorId].preacceleZ = deviceList[sensorId].acceleZ;
        //たぶん違う
        //  X_a = Math.atan2(X, Math.sqrt(Math.pow(Y, 2) + Math.pow(Z, 2))) * (180 / Math.PI);
        //  Y_a = Math.atan2(Y, Math.sqrt(Math.pow(X, 2) + Math.pow(Z, 2))) * (180 / Math.PI);
        //  Z_a = Math.atan2(Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2)), Z) * (180 / Math.PI);
        // X_a = Math.atan2(X, Math.sqrt(Math.pow(Y, 2) + Math.pow(Z, 2)));
        // Y_a = Math.atan2(Y, Math.sqrt(Math.pow(X, 2) + Math.pow(Z, 2)));
        // Z_a = MatsensorId.atan2(Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2)), Z);
        //有力候補１
        // X_a = Math.atan2(Y,Z) * (180 / Math.PI);
        // Y_a = Math.atan2(X,Z) * (180 / Math.PI);
        // Z_a = Math.atan2(X,Y) * (180 / Math.PI);
        // X_a = Math.atan2(Y, Z);
        // Y_a = Math.atan2(X, Z);
        // Z_a = Math.atan2(X, Y);
        // deviceList[sensorId].X_a = Math.atan(deviceList[sensorId].acceleY, deviceList[sensorId].acceleZ);
        // deviceList[sensorId].Y_a = Math.atan(deviceList[sensorId].acceleX, deviceList[sensorId].acceleZ);
        // deviceList[sensorId].Z_a = Math.atan(deviceList[sensorId].acceleX, deviceList[sensorId].acceleY);
        //有力候補2
        // X_a = Math.asin(X, Math.sqrt(Math.pow(Y, 2) + Math.pow(Z, 2))) * (180 / Math.PI);
        //  Y_a = Math.asin(Y, Math.sqrt(Math.pow(X, 2) + Math.pow(Z, 2))) * (180 / Math.PI);
        //  Z_a = Math.asin(Z,Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2))) * (180 / Math.PI);
        // X_a = Math.asin(X, Math.sqrt(Math.pow(Y, 2) + Math.pow(Z, 2)));
        // Y_a = Math.asin(Y, Math.sqrt(Math.pow(X, 2) + Math.pow(Z, 2)));
        // Z_a = Math.asin(Z, Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2)));
        //  X_a = kirisute(X_a);
        // Y_a = kirisute(Y_a);
        // Z_a = kirisute(Z_a);
        // deviceList[sensorId].Y_a = Math.atan(deviceList[sensorId].acceleY/deviceList[sensorId].acceleX);
        // if (Math.abs(deviceList[sensorId].acceleX)<0.1){
        //     deviceList[sensorId].acceleX = 0.00000000001;
        // }
        // if (Math.abs(deviceList[sensorId].acceleY) < 0.1) {
        //     deviceList[sensorId].acceleY = 0.00000000002;
        // }
        // if (Math.abs(deviceList[sensorId].acceleZ) < 0.1) {
        //     deviceList[sensorId].acceleZ = 0.00000000003;
        // }

        // if (Math.abs(deviceList[sensorId].acceleX) < 0.1) {
        //     deviceList[sensorId].acceleX = 0;
        // }
        // if (Math.abs(deviceList[sensorId].acceleY) < 0.1) {
        //     deviceList[sensorId].acceleY = 0;
        // }
        // if (Math.abs(deviceList[sensorId].acceleZ) < 0.1) {
        //     deviceList[sensorId].acceleZ = 0;
        // }

        //PDFのやつ　三軸
        // deviceList[sensorId].Y_a = Math.atan(deviceList[sensorId].acceleZ/ deviceList[sensorId].acceleY);
        // deviceList[sensorId].Z_a = Math.acos(deviceList[sensorId].acceleZ / Math.sqrt(Math.pow(deviceList[sensorId].acceleX, 2) + Math.pow(deviceList[sensorId].acceleY, 2) + Math.pow(deviceList[sensorId].acceleZ, 2)));
        
        //PDFのやつ　動きなめらかだけど斜めにしたときの角度がおかしい
        // deviceList[sensorId].X_a = Math.atan(deviceList[sensorId].acceleX / Math.sqrt(Math.pow(deviceList[sensorId].acceleY, 2) + Math.pow(deviceList[sensorId].acceleZ, 2)));
        // deviceList[sensorId].Y_a = Math.atan(deviceList[sensorId].acceleY / Math.sqrt(Math.pow(deviceList[sensorId].acceleX, 2) + Math.pow(deviceList[sensorId].acceleZ, 2)));
        // deviceList[sensorId].Z_a = Math.atan(Math.sqrt(Math.pow(deviceList[sensorId].acceleX, 2) + Math.pow(deviceList[sensorId].acceleY, 2)) / deviceList[sensorId].acceleZ);
        // deviceList[sensorId].X_a = Math.atan2(deviceList[sensorId].acceleX, Math.sqrt(Math.pow(deviceList[sensorId].acceleY, 2) + Math.pow(deviceList[sensorId].acceleZ, 2)));
        // deviceList[sensorId].Y_a = Math.atan(deviceList[sensorId].acceleY / Math.sqrt(Math.pow(deviceList[sensorId].acceleX, 2) + Math.pow(deviceList[sensorId].acceleZ, 2)));
        // deviceList[sensorId].Z_a = Math.atan2(Math.sqrt(Math.pow(deviceList[sensorId].acceleX, 2) + Math.pow(deviceList[sensorId].acceleY, 2)), deviceList[sensorId].acceleZ);
        // deviceList[sensorId].X_a = 
        //     Math.atan(deviceList[sensorId].acceleX/deviceList[sensorId].acceleY );
        // deviceList[sensorId].Y_a = 
        // Math.atan2(deviceList[sensorId].acceleY,Math.sqrt(Math.pow(deviceList[sensorId].acceleX, 2) + Math.pow(deviceList[sensorId].acceleZ, 2)));
        // if ((deviceList[sensorId].acceleY < 0 && deviceList[sensorId].acceleZ < 0) || (deviceList[sensorId].acceleY < 0 && deviceList[sensorId].acceleZ > 0)){
        //  deviceList[sensorId].X_a =
        //       (360 + (Math.atan2(deviceList[sensorId].acceleY , deviceList[sensorId].acceleZ))*degree) * radian;
        // }else{
        //         deviceList[sensorId].X_a = Math.atan2(deviceList[sensorId].acceleY, deviceList[sensorId].acceleZ);
        //       }
        // if ((deviceList[sensorId].acceleX < 0 && deviceList[sensorId].acceleZ < 0) || (deviceList[sensorId].acceleX < 0 && deviceList[sensorId].acceleZ > 0)) {
        //     deviceList[sensorId].Y_a =
        //         (360 + (Math.atan2(deviceList[sensorId].acceleX, deviceList[sensorId].acceleZ)) * degree) * radian;
        // } else {
        //     deviceList[sensorId].Y_a = Math.atan2(deviceList[sensorId].acceleX, deviceList[sensorId].acceleZ);
        // }
        // if ((deviceList[sensorId].acceleX < 0 && deviceList[sensorId].acceleY < 0) || (deviceList[sensorId].acceleX < 0 && deviceList[sensorId].acceleY > 0)) {
        //     deviceList[sensorId].Z_a =
        //         (360 + (Math.atan2(deviceList[sensorId].acceleX, deviceList[sensorId].acceleY)) * degree) * radian;
        // } else {
        //     deviceList[sensorId].Z_a = Math.atan2(deviceList[sensorId].acceleX, deviceList[sensorId].acceleY);
        // }
        // deviceList[sensorId].X_a =
        //     Math.atan2(-0.5, -0.5);
        // deviceList[sensorId].Y_a =
        //     Math.atan2(deviceList[sensorId].acceleX, deviceList[sensorId].acceleZ);
        
        // if ((deviceList[sensorId].acceleY < 0 && deviceList[sensorId].acceleZ < 0) || (deviceList[sensorId].acceleY < 0 && deviceList[sensorId].acceleZ > 0)) {
        //     deviceList[sensorId].X_a =
        //         (360 + (Math.atan2(deviceList[sensorId].acceleY, deviceList[sensorId].acceleZ)) * degree) * radian;
        // } else {
        //     deviceList[sensorId].X_a = Math.atan2(deviceList[sensorId].acceleY, deviceList[sensorId].acceleZ);
        // // }
        //  if ((deviceList[sensorId].acceleX > 0 && deviceList[sensorId].acceleZ > 0) || (deviceList[sensorId].acceleX < 0 && deviceList[sensorId].acceleZ > 0)) {
            // deviceList[sensorId].Y_a = Math.atan2(deviceList[sensorId].acceleX, deviceList[sensorId].acceleZ);
                 
        //  } 
        
            
        // if ((deviceList[sensorId].acceleX < 0 && deviceList[sensorId].acceleY < 0) || (deviceList[sensorId].acceleX < 0 && deviceList[sensorId].acceleY > 0)) {
        //     deviceList[sensorId].Z_a =
        //         (360 + (Math.atan2(deviceList[sensorId].acceleX, deviceList[sensorId].acceleY)) * degree) * radian;
        // } else {
            
        // }
        console.log(Math.sqrt(deviceList[sensorId].acceleX * deviceList[sensorId].acceleX + deviceList[sensorId].acceleY * deviceList[sensorId].acceleY + deviceList[sensorId].acceleZ * deviceList[sensorId].acceleZ));
        //これ確定っぽい
        deviceList[sensorId].X_a = Math.atan2(-deviceList[sensorId].acceleX, deviceList[sensorId].acceleZ);
        //これが違う
        
        // deviceList[sensorId].Y_a = Math.atan(deviceList[sensorId].acceleY / Math.sqrt(Math.pow(deviceList[sensorId].acceleX, 2) + Math.pow(deviceList[sensorId].acceleZ, 2)));
        //これ確定っぽい
        deviceList[sensorId].Y_a = Math.atan2(-deviceList[sensorId].acceleY , Math.sqrt(Math.pow(deviceList[sensorId].acceleZ, 2) + Math.pow(deviceList[sensorId].acceleX, 2)));
        // deviceList[sensorId].Y_a = Math.atan2(deviceList[sensorId].acceleY , deviceList[sensorId].acceleZ);
        // deviceList[sensorId].Z_a = Math.acos(deviceList[sensorId].acceleZ/Math.sqrt(deviceList[sensorId].acceleX * deviceList[sensorId].acceleX + deviceList[sensorId].acceleY * deviceList[sensorId].acceleY + deviceList[sensorId].acceleZ * deviceList[sensorId].acceleZ));
        Akakudox.innerHTML = deviceList[0].X_a * degree;
        Akakudoy.innerHTML = deviceList[0].Y_a * degree;
        Akakudoz.innerHTML = deviceList[0].Z_a * degree;


        // console.log(sensorId);
        // 箱を回転させる
        scene.remove(cube[sensorId]); //copyが上書きかも
        cube[sensorId] = new THREE.Mesh(cubegeometry[sensorId], cubematerial[sensorId]);
        scene.add(cube[sensorId]);
        switch (sensorId) {
            case 0:
                cube[0].position.x = -100;
                cube[0].position.y = 100;
                break;
            case 1:
                cube[1].position.x = 100;
                cube[1].position.y = 100;
                break;
                case 2:
                cube[2].position.x = -100;
                cube[2].position.y = -100;
                break;
                case 3:
                cube[3].position.x = 100;
                cube[3].position.y = -100;
                break;

        }
        
        
        // x_angle += dt * (newRate - x_bias);
        //    cube[0].rotation.x = X_a;
        //     cube[0].rotation.y = Y_a;
        //     cube[0].rotation.z = Z_a;
        // cube[0].rotation = new THREE.Vector3(roll, pitch, yaw);
        // cube[0].rotation.x += roll;
        // cube[0].rotation.y += pitch;
        // cube[0].rotation.z += yaw;

        // angleX = filter * (preangleX + roll) + (1 - filter) * X_a;
        // angleY = filter * (preangleY + pitch) + (1 - filter) * Y_a;
        // angleZ = filter * (preangleZ + yaw) + (1 - filter) * Z_a;
        
        // angleX = filter * (preangleX + gyroX * radian) + (1 - filter) * X_a;
        // angleY = filter * (preangleY + gyroY * radian) + (1 - filter) * Y_a;
        // angleZ = filter * (preangleZ + gyroZ * radian) + (1 - filter) * Z_a;
        // preangleX = angleX;
        // preangleY = angleY;
        // preangleZ = angleZ;
        // gyrox.innerHTML = angleX * degree;
        // gyroy.innerHTML = angleY * degree;
        // gyroz.innerHTML = angleZ * degree;
        // cube[sensorId].rotation.x = angleX;
        // cube[sensorId].rotation.y =angleY;
        // cube[sensorId].rotation.z = angleZ;
        // cube[sensorId].rotation.x = angleX;
        // cube[sensorId].rotation.y = angleY;
        // cube[sensorId].rotation.z = angleZ;
        cube[sensorId].order = "Z-Y-X";
        
        cube[sensorId].rotation.x = deviceList[sensorId].X_a;
        cube[sensorId].rotation.y = deviceList[sensorId].Y_a; 
        // cube[sensorId].rotation.z = deviceList[sensorId].Z_a;
        //       cube[sensorId].rotation.x = 10*radian;
        // cube[sensorId].rotation.y = 0;

        //  cube[sensorId].rotation.z = angleZ;
        // cube[0].rotation.x = X_a;
        // cube[0].rotation.y = Y_a;
        // cube[0].rotation.z = Z_a;
        // cube[0].rotateX(angleX * radian/60);
        // cube[0].rotateY(pitch * radian/60);
        // cube[0].rotateZ(yaw * radian/60);



        renderer.render(scene, camera);
        // }
    });

    function kirisute(x) {
        if (Math.abs(x) < 10) {
            return 0;
        } else {
            return x;
        }
    }
    function kirisuteG(x) {
        if (Math.abs(x) < 2) {
            return 0;
        } else {
            return x;
        }
    }
    // 初回実行
    // draw();

    function draw() {
        requestAnimationFrame(draw);
        // 箱を回転させる
        scene.remove(cube[0]); //copyが上書きかも
        cube[0] = new THREE.Mesh(cubegeometry[0], cubematerial[0]);
        scene.add(cube[0]);
        cube[0].position.x = -100;
        cube[0].position.y = 100;
        // cube[0].useQuaternion = true;
        var Axis = {
            "x": new THREE.Vector3(1, 0, 0).normalize(),
            "y": new THREE.Vector3(0, 1, 0).normalize(),
            "z": new THREE.Vector3(0, 0, 1).normalize()
        };
        // var origin_pos = cube.position.clone();
        var quat = new THREE.Quaternion();
        // var new_q = origin_quaternion.clone();
        var axis = new THREE.Vector3(1, 1, 1).normalize();
        // 回転軸axis と角度angle からクォータニオンを計算
        // var qz = quat.setFromAxisAngle(Axis.z, Z_a * radian);
        // quat.setFromAxisAngle(Axis.x, X_a * radian);
        // quat.set(X_a, Y_a, Z_a);
        // new_q.multiply(quat);
        // cube[0].Quaternion.copy(new_q);
        // cube[0].rotation = quat.
        // メッシュを回転させる
        // quat.multiply(cube[0].quaternion.clone());
        // var qy = quat.setFromAxisAngle(Axis.y, Y_a * radian);
        // // quat.multiply(cube[0].quaternion.clone());
        // cube[0].quaternion.multiply(quat);
        // var qx = quat.setFromAxisAngle(Axis.x, X_a * radian);
        // // quat.setFromAxisAngle(axis, qx * qy);
        // cube[0].quaternion.multiply(quat);
        // quat.multiply(cube[0].quaternion.clone());
        // cube[0].quaternion.copy(quat);  
        // cube[0].rotation.x = X_a * radian;
        // cube[0].rotation.y = Y_a * radian;
        // cube[0].rotation.z = Z_a * radian;
        // レンダリング
        renderer.render(scene, camera);
    }





    // function SeTEuler(yaw, pitch,  roll){
    //     cosY = cosf(yaw / 2);
    //     sinY = sinf(yaw / 2);
    //     cosP = cosf(pitch / 2);
    //     sinP = sinf(pitch / 2);
    //     cosR = cosf(roll / 2);
    //     sinR = sinf(roll / f);
    //     SetValues(
    //         cosR * sinP * cosY + sinR * cosP * sinY,
    //         cosR * cosP * sinY - sinR * sinP * cosY,
    //         sinR * cosP * cosY - cosR * sinP * sinY,
    //         cosR * cosP * cosY + sinR * sinP * sinY
    //     );
    //     return this;
    // }


});