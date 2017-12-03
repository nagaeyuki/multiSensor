$(function () {

    if (window.confirm("ペアリングページに移動します")) {
        window.location.href = "https://iothis.aitech.ac.jp/controller/controller.html";
        socket.emit("ConnectStart");
    } else {
        history.back();
    }
});