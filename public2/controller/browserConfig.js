$(function(){
// // 履歴にスタックしたかどうかのflag
// var isHistoryPush = false;
// (function() {
//     if (history && history.pushState && history.state !== undefined) {
//         // history イベントの監視
//         window.addEventListener('popstate', function (e) {
//             if (isHistoryPush) {
//                 alert('ブラウザでの戻るボタンは禁止されております。');
//                 history.pushState(null, null, null);
//             }
//         }, false);
//     }
// })();
//
// // pushしたいタイミングで呼び出します
// function pushHistory() {
//     if (history && history.pushState && history.state !== undefined) {
//         isHistoryPush = true;
//         history.pushState(null, null, null);
//     }
// }
//
// window.onload=function(){
//    window.addEventListener("keydown",reloadoff,false);
//  }
//
//  function reloadoff(evt){
//    evt.preventDefault();
//  }

 if( window.navigator.userAgent.toLowerCase().indexOf('chrome') != -1 ){
    var bodyStyle, p2rfixStyle;

    document.getElementsByTagName('html')[0].style.height='100%';

    bodyStyle = document.getElementsByTagName('body')[0].style;
    bodyStyle.height = '100%';
    bodyStyle.overflowY = 'hidden';

    p2rfixStyle = document.getElementById('p2rfix').style;
    p2rfixStyle.height = '100%';
    p2rfixStyle.overflow = 'auto';
}
});
