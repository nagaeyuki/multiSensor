$(function () {

    if (window.confirm("�y�A�����O�y�[�W�Ɉړ����܂�")) {
        window.location.href = "https://iothis.aitech.ac.jp/controller/controller.html";
        socket.emit("ConnectStart");
    } else {
        history.back();
    }
});