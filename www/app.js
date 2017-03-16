// This is a JavaScript file

/* グローバル変数 */
var user_id = "";
var user_name = "";
var user_pass = "";
var juid = 0;           /* 受注番号 */
var menuidx = 0;        /* 現在選択されている機能  0:受注 1:売上 2:入出庫 */
var imgsize = 100;
var imgleft = 0;
var devicetp = 0;       /* デバイスタイプの区分 0:Android4.x以前、 1:Android5 以後 2:iOS */
var cam_quality = 80;        /* カメラの解像度 */

//var baseurl = "https://zaiko.mobi/rgstr.php";
//var zaikourl = "https://zaiko.mobi/zaikocloud.php";
var baseurl = "https://sanyu.mobi/rgstr.php";
var zaikourl = "https://sanyu.mobi/zaikocloud.php";
var dbuserid = "";
var dbuserpass = "";
var dbname = "";

var umail = "";
var uname1 = "";
var uname2 = "";
var upass = "";

var media1;
var mp3_src = "info.mp3";

var sessid = "";        /* セッションID */
var pgevent = 0;        /* ページイベント管理変数 */
var sampleflag = 0;     /* データのサンプルフラグ */

var dbsize = 0;


function floatFormat( number, n ) {
    var _pow = Math.pow( 10 , n ) ;
	return Math.round( number * _pow ) / _pow ;
}

function scanBarcode() {
    window.plugins.barcodeScanner.scan( function(result) {
        console.log("バーコードを読み取りました\n" +
            "Result: " + result.text + "\n" +
            "Format: " + result.format + "\n" +
            "Cancelled: " + result.cancelled);
        }, function(error) {
            alert("Scanning failed: " + error);
        }
    );
    console.log("code end");
}

// Enable pusher logging - don't include this in production
//Pusher.logToConsole = true;
//var pusher = new Pusher('b0b7e7c371bf263e4026', {
    //encrypted: true
//});
//var channel = pusher.subscribe('test_channel');
//channel.bind('my_event', function(data) {
    //navigator.notification.vibrate(3000);
    //media1.play();
    //alert(data.message);
    //ons.notification.alert({
      //  messageHTML: data.message + '<BR>' + data.date,
       // title: "新着情報",
        //animation: "fade"
//  });
//});
//
//$(document).on('pinchin', '#p5img', function() {
//        //console.log("pinchin");
//        var imgbox = document.getElementById('p5pic1');
//        if(imgsize > 100)
//            imgsize -= 10;
//        imgbox.style.width = imgsize + "%";
//      })
//      
//$(document).on('pinchout', '#p5img', function() {
//    //console.log("pinchout");
//    var imgbox = document.getElementById('p5pic1');
//    if(imgsize < 400)
//        imgsize += 10;
//    imgbox.style.width = imgsize + "%";
//    var listElement = document.getElementById('p5img'); //My ons-list element
//    ons.compile(listElement);       // update
//  })
//  
//$(document).on('doubletap', '#p5img', function() {
//    //console.log("pinchout");
//    //alert('削除しますか?');
//    var imgbox = document.getElementById('p5pic1');
//    imgsize = 100;
//    imgleft = 0;
//    imgbox.style.width = imgsize + "%"; 
//    imgbox.style.left = imgleft + "px"; 
//});
//
//$(document).on('swiperight', '#p5pic1', function() {
//    console.log("swipe_r");
//});
//
//$(document).on('swipeleft', '#p5pic1', function() {
//    console.log("swipe_l");
//});

/* サーバー接続情報をローカルに保存 */
function save_setting(){
    umail = $("#p1-mail").val();
    uname1 = $("#p1-name1").val();
    uname2 = $("#p1-name2").val();
    upass = $("#p1-pass").val();
    
    localStorage.setItem('p1-mail', umail);
    localStorage.setItem('p1-pass', upass);
    
    $.ajax({
        type: "POST",
        url: baseurl,
        dataType: 'json',
        data : {
            pr : 10 ,
            session_id: sessid,
            id : umail,
            name1: uname1,
            name2: uname2,
            passwd: upass
        },
        success: function(data, dataType) 
        {
            if(data.status == 1)
            {
                //document.getElementById("p5pic1").src = data[0].image;
                alert('データの更新が完了しました。');
            }else{
                //document.getElementById("p5pic1").src = null;
                alert('データの更新でエラーが生じました。');
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) 
        {
            //通常はここでtextStatusやerrorThrownの値を見て処理を切り分けるか、単純に通信に失敗した際の処理を記述します。
            //this;
            //thisは他のコールバック関数同様にAJAX通信時のオプションを示します。
            //エラーメッセージの表示
            alert('Error : ' + XMLHttpRequest + textStatus + errorThrown);
        }
    });
    
}


/* 詳細表示用DB読込 */
function read_list(code_idx, mode){
    /**
     * Ajax通信メソッド
     * @param type      : HTTP通信の種類
     * @param url       : リクエスト送信先のURL
     * @param dataType  : データの種類
     */
    var urladd = '';
    var last_id = 0;
    var return_value = "";
    var ajaxpg = "";
    
    switch(mode)
    {
        case 0:         /* 受注 */
            ajaxpg = 10;
            break;
        case 10:         /* 本日出荷 */
            ajaxpg = 50;
            break;
        case 2:         /* 入出庫 */
            ajaxpg = 20;
            break;
        case 20:         /* 本日入出庫 */
            ajaxpg = 60;
            break;
        case 3:         /* 指定日実績在庫 */
            var dt1 = new Date($("#date").val());
            var dt2 = dt1.getFullYear() + "/" + ( dt1.getMonth() + 1 ) + "/" + dt1.getDate();
            code_idx = dt2;
            ajaxpg = 30;
            break;
        case 4:         /* 指定日全在庫 */
            var dt1 = new Date($("#date").val());
            var dt2 = dt1.getFullYear() + "/" + ( dt1.getMonth() + 1 ) + "/" + dt1.getDate();
            code_idx = dt2;
            ajaxpg = 39;
            break;
        default:
            break;
    }
    $.ajax({
        type: "POST",
        url: zaikourl,
        dataType: 'json',
        async: false,
        data : {
            pg : ajaxpg ,
            key : code_idx,
            id: umail,
            session_id: sessid
        }, success: function(msg, status){
            //alert("msg['list'].login :" + msg['list'].login);
            if(msg.login == "0")
            {
                return_value = null;
                console.log("another login detect.");
            }else{
                console.log(Object.keys(msg['list']).length);
                var len = Object.keys(msg['list']).length;
                switch(mode)
                {
                    case 0: case 10:    /* 受注 */
                        if(msg['list'][0].juchu_date == null)
                        {
                            if(mode == 0)
                            {
                                return_value="<div>受注履歴はありません。</div>";
                            }else{
                                return_value="<div>本日出荷はありません。</div>";
                            }
                        }else{
                            for(var i=0; i < len; i++){
                                /* リストの組立 */
                                var dt1 = new Date(msg['list'][i].juchu_date);
                                var dt2 = new Date();
                                
                                if((dt1.getFullYear() == dt2.getFullYear()) && (dt1.getMonth() ==  dt2.getMonth()) && (dt1.getDate() == dt2.getDate()))
                                {
                                    return_value += '<div onclick="myNavi.pushPage(\'p4\',{animation: \'silde\' , func:';
                                    return_value += msg['list'][i].juchu_num1 + ' , mode: 0}); dlgDetail.show();"><ons-row><ons-col align="left" class="todaylist">';
                                    return_value += msg['list'][i].juchu_num1 + '</ons-col><ons-col align="left" class="todaylist">' + msg['list'][i].juchu_num2 + '</ons-col></ons-row>';
                                    return_value += '<ons-row><ons-col align="left" class="todaylist">' + msg['list'][i].juchu_date + '</ons-col></ons-row>';
                                    return_value += '<ons-row><ons-col align="left" class="todaylist">' + msg['list'][i].name1 + '</ons-col></ons-row>';
                                    return_value += '<ons-row><ons-col align="left" class="todaylist">' + msg['list'][i].name + '</ons-col></ons-row>';
                                    return_value += '<ons-row><ons-col align="left" class="todaylist">' + msg['list'][i].memo1 + '</ons-col></ons-row></div><hr>';                    
                                }else{
                                    return_value += '<div onclick="myNavi.pushPage(\'p4\',{animation: \'silde\' , func:';
                                    return_value += msg['list'][i].juchu_num1 + ' , mode: 0}); dlgDetail.show();"><ons-row><ons-col align="left" class="standsfor">';
                                    return_value += msg['list'][i].juchu_num1 + '</ons-col><ons-col align="left" class="standsfor">' + msg['list'][i].juchu_num2 + '</ons-col></ons-row>';
                                    return_value += '<ons-row><ons-col align="left" class="standsfor">' + msg['list'][i].juchu_date + '</ons-col></ons-row>';
                                    return_value += '<ons-row><ons-col align="left" class="standsfor">' + msg['list'][i].name1 + '</ons-col></ons-row>';
                                    return_value += '<ons-row><ons-col align="left" class="standsfor">' + msg['list'][i].name + '</ons-col></ons-row>';
                                    return_value += '<ons-row><ons-col align="left" class="standsfor">' + msg['list'][i].memo1 + '</ons-col></ons-row></div><hr>';
                                }
                                last_id = msg['list'][i].juchu_num1;
                                
                            }
                            if((mode == 0) && (len > 0))
                                return_value += '<ons-button modifier="long" id="p3addlist" onclick="dlgListAdd.show();show_list(' + Number(last_id) + ',0);">さらに読み込む</ons-button><hr>';
                        }
                        break;
                    case 2: case 20:     /* 入出庫 */
                        if(msg['list'][0].juchu_date == null)
                        {
                            if(mode == 2)
                            {
                                return_value="<div>入出庫履歴はありません。</div>";
                            }else{
                                return_value="<div>本日入出庫はありません。</div>";
                            }
                        }else{
                            for(var i=0; i < len; i++){
                                /* リストの組立 */
                                var dt1 = new Date(msg['list'][i].juchu_date);
                                var dt2 = new Date();
                                if(msg['list'][i].id != null)
                                {
                                    if((dt1.getFullYear() == dt2.getFullYear()) && (dt1.getMonth() ==  dt2.getMonth()) && (dt1.getDate() == dt2.getDate()))
                                    {
                                        return_value += '<div onclick="myNavi.pushPage(\'p4\',{animation: \'silde\' , func: ';
                                        return_value += msg['list'][i].uri_num + ' , mode: 2}); dlgDetail.show();"><ons-row><ons-col align="left" class="todaylist">';
                                        return_value += msg['list'][i].uri_num + '</ons-col>';
                                        return_value += '<ons-col align="left" class="todaylist">' + msg['list'][i].juchu_date + '</ons-col></ons-row>';
                                        return_value += '<ons-row><ons-col align="left" class="todaylist">' + msg['list'][i].kubun + '</ons-col>';
                                        return_value += '<ons-col align="left" class="todaylist">' + msg['list'][i].meisai + '件</ons-col></ons-row></div><hr>';
                                    }else{
                                        return_value += '<div onclick="myNavi.pushPage(\'p4\',{animation: \'silde\' , func: ';
                                        return_value += msg['list'][i].uri_num + ' , mode: 2}); dlgDetail.show();"><ons-row><ons-col align="left" class="standsfor">';
                                        return_value += msg['list'][i].uri_num + '</ons-col>';
                                        return_value += '<ons-col align="left" class="standsfor">' + msg['list'][i].juchu_date + '</ons-col></ons-row>';
                                        return_value += '<ons-row><ons-col align="left" class="standsfor">' + msg['list'][i].kubun + '</ons-col>';
                                        return_value += '<ons-col align="left" class="standsfor">' + msg['list'][i].meisai + '件</ons-col></ons-row></div><hr>';
                                    }
                                    last_id = msg['list'][i].uri_num;
                                }
                            }
                            if((mode == 2) && (len > 0))
                                return_value += '<ons-button modifier="long" id="p3addlist" onclick="dlgListAdd.show();show_list(' + Number(last_id) + ',2);">さらに読み込む</ons-button><hr>';
                        }
                        break;
                    case 3:         /* 在庫 */
                        if(msg['list'][0].clsname == null)
                        {
                            return_value="<div>本日実績はありません。</div>";
                        }else{
                            for(var i=0; i < len; i++){
                            /* リストの組立 */
                            return_value += '<div><ons-row><ons-col align="left" width="75%" class="standsfor">' + msg['list'][i].clsname;
                            return_value += '</ons-col><ons-col align="right"  class="standsfor">' + msg['list'][i].shohin_id;
                            return_value += '</ons-row><ons-row><ons-col width="75%" align="left" class="todaylist">' + msg['list'][i].name + '</ons-col>';
                            return_value += '<ons-col align="right" class="standsfor">' + msg['list'][i].cnt + '</ons-col></ons-row></div><hr>';
                            }
                        }
                        break;
                    case 4:         /* 全在庫 */
                        if(msg['list'][0].clsname == null)
                        {
                            return_value="<div>在庫データはありません。</div>";
                        }else{
                            for(var i=0; i < len; i++){
                            /* リストの組立 */
                            return_value += '<div><ons-row><ons-col align="left" width="75%" class="standsfor">' + msg['list'][i].clsname;
                            return_value += '</ons-col><ons-col align="right"  class="standsfor">' + msg['list'][i].shohin_id;
                            return_value += '</ons-row><ons-row><ons-col width="75%" align="left" class="todaylist">' + msg['list'][i].name + '</ons-col>';
                            return_value += '<ons-col align="right" class="standsfor">' + msg['list'][i].cnt + '</ons-col></ons-row></div><hr>';
                            }
                        }
                        break;
                }
            }
        }, error: function(XMLHttpRequest, textStatus, errorThrown){
            alert("error");
        }
    });
    //console.log("return_value:" + return_value);
    return return_value;
}

/* リスト追加用 */
function show_list(idx, md){
    dlgListAdd.show();
    $("#p3addlist").hide();                                     /* 追加リスト表示ボタンを非表示 */
    $("#p3addlist").removeAttr("id").removeAttr("onclick");     /* id, onclick要素を削除 */
    var listElement = document.getElementById('p3list'); //My ons-list element
    var objson = read_list(idx , md);
    if( objson != null)
    {
        $("#p3list").append(objson);
    }else{
        $("#p3list").append('<p align="left" onclick="myNavi.pushPage(\'t1\')">他の端末でアカウント' + umail + 'によるログインが行われた可能性があります。心当たりの無い場合はただちに弊社へご連絡ください。<p>');
    }
    var listElement = document.getElementById('p3list'); //My ons-list element
    ons.compile(listElement);       // update
    dlgListAdd.hide();
    dlgList.hide();
}

/* 詳細データ表示 */
function read_detail(code_idx, mode){
    /**
     * Ajax通信メソッド
     * @param type      : HTTP通信の種類
     * @param url       : リクエスト送信先のURL
     * @param dataType  : データの種類
     */
    var urladd = '';
    var return_value = "";
    var ajaxpg = "";
    switch(mode)
    {
        case 0:         /* 受注 */
            //urladd = "http://192.168.10.238:8888/zaiko/juchutxt.php?key=" + code_idx;
            ajaxpg = 11;
            break;
        case 1:         /* 売上 */
            //urladd = "http://192.168.10.238:8888/zaiko/uri.php";
            ajaxpg = 11;
            break;
        case 2:         /* 入出庫 */
            //urladd = "http://192.168.10.238:8888/zaiko/nyukotxt.php?key=" + code_idx;
            ajaxpg = 21;
            break;
        default:
            break;
    }
    $.ajax({
        type: "POST",
        url: zaikourl,
        dataType: 'json',
        async: false,
        data : {
            pg : ajaxpg,
            key : code_idx,
            id: umail,
            session_id: sessid
        }, success: function(msg, status){
            if(msg.login == "0")
            {
                return_value = null;
            }else{
                var len=msg.shohin.length;
                juid = msg.id;
                sampleflag = msg.sample;
                //alert("sample:" + sampleflag);
                /* 基本情報の組立 モードにより振り分け */
                switch(mode)
                {
                    case 0:             /* 受注詳細 */
                        return_value = '<table border="0" width="100%" style="table-layout: fixed;"><tr><th width="20%">受注番号</th><td width="30%">' + msg.juchu_num1 + '</td>';
                        return_value += '<th width="20%">受注連番</th><td width="30%">' + msg.juchu_num2 + '</td></tr>';
                        var dt1 = new Date(msg.juchu_date);
                        var dt2 = new Date();
                        if((dt1.getFullYear() == dt2.getFullYear()) && (dt1.getMonth() ==  dt2.getMonth()) && (dt1.getDate() == dt2.getDate()))
                        {
                            return_value += '<tr><th>出荷日</th><td class="todaydetail">' + msg.juchu_date + '</td><th>納品日</th><td>' + msg.nohin_date + '</td></tr>';
                        }else{
                            return_value += '<tr><th>出荷日</th><td>' + msg.juchu_date + '</td><th>納品日</th><td style="color: purple;">' + msg.nohin_date + '</td></tr>';
                        }
                        return_value += '<tr><th>得意先名1</th><td align="left" colspan=3 class="stndfor">' + msg.cname1 + '</td></tr>';
                        return_value += '<tr><th>得意先名2</th><td align="left" colspan=3 class="stndfor">' + msg.cname2 + '</td></tr>';
                        return_value += '<tr><th>納品先名</th><td align="left"  colspan=3 class="stndfor">' + msg.nname + '</td></tr>';
                        return_value += '<tr><th>備考</th><td align="left"  colspan=3 class="stndfor">' + msg.memo1 + '</td></tr>';
                        return_value += '</table><table border="0" width="100%" style="table-layout: fixed;">';
                        return_value += '<tr><th width="6%">No</th><th width="64%">品名</th><th width="18%">数量</th><th width="12%">単位</th></tr>';
                        
                        for(var i=0; i < len; i++){
                            /* リストの組立 */
                            return_value += '<tr><td>' + (i + 1) + '</td>';
                            return_value += '<td align="left" class="stndfor">' + msg.shohin[i].shohin_name + '</td>';
                            return_value += '<td align="right" class="stndfor">' + msg.shohin[i].count + '</td>';
                            return_value += '<td class="stndfor">' + msg.shohin[i].shohin_unit + '</td></tr>';
                            if(msg.shohin[i].m1 != "")
                                return_value += '<tr><td></td><td colspan=3 align="left" class="stndfor">[備考1]' + msg.shohin[i].m1 + '</td></tr>';
                            if(msg.shohin[i].m2 != "")
                                return_value += '<tr><td></td><td colspan=3 align="left" class="stndfor">[備考2]' + msg.shohin[i].m2 + '</td></tr>';
                        }
                        return_value += '</table>';
                        break;
                    case 2:             /* 入出庫詳細 */
                        return_value = '<table border="0" width="100%" style="table-layout: fixed;"><tr><th width="20%">伝票番号</th><td width="30%">' + msg.juchu_num + '</td>';
                        var dt1 = new Date(msg.juchu_date);
                        var dt2 = new Date();
                        if((dt1.getFullYear() == dt2.getFullYear()) && (dt1.getMonth() ==  dt2.getMonth()) && (dt1.getDate() == dt2.getDate()))
                        {
                            return_value += '<th width="20%">日付</th><td width="30%" class="todaydetail">' + msg.juchu_date + '</td></tr>';
                        }else{
                            return_value += '<th width="20%">日付</th><td width="30%">' + msg.juchu_date + '</td></tr>';
                        }
                        return_value += '<tr><th>区分</th><td align="left" colspan=3 class="stndfor">' + msg.kubun + '</td></tr>';
                        return_value += '<tr><th>備考</th><td align="left" colspan=3 class="stndfor">' + msg.memo1 + '</td></tr>';
                        return_value += '</table><table border="0" width="100%" style="table-layout: fixed;">';
                        return_value += '<tr><th width="6%">No</th><th width="64%">品名</th><th width="18%">数量</th><th width="12%">単位</th></tr>';
                        
                        for(var i=0; i < len; i++){
                            /* リストの組立 */
                            return_value += '<tr><td>' + (i + 1) + '</td>';
                            return_value += '<td align="left" class="stndfor">' + msg.shohin[i].shohin_name + '</td>';
                            return_value += '<td align="right" class="stndfor">' + msg.shohin[i].count + '</td>';
                            return_value += '<td class="stndfor">' + msg.shohin[i].shohin_unit + '</td></tr>';
                            if(msg.shohin[i].m1 != "")
                                return_value += '<tr><td></td><td colspan=3 align="left" class="stndfor">[備考1]' + msg.shohin[i].m1 + '</td></tr>';
                            if(msg.shohin[i].m2 != "")
                                return_value += '<tr><td></td><td colspan=3 align="left" class="stndfor">[備考2]' + msg.shohin[i].m2 + '</td></tr>';
                        }
                        return_value += '</table>';
                        break;
                }
                
                try {
                    var len=msg.img.length;
                    for(var i=0; i < len; i++){
                        return_value += '<hr><ons-button modifier="light" onclick="myNavi.pushPage(\'p5\',{animation: \'fade\', func:' + msg.img[i].id + '});">';
                        return_value += '<ons-icon icon="ion-image" size="24px">(';
                        return_value += (i+1) + ')' + msg.img[i].update_date + '</ons-button>';
                    }
                }catch (e){
                    return_value += '<p>登録画像はありません。</p>';
                }
            }
            
        }, error: function(XMLHttpRequest, textStatus, errorThrown){
            alert("juchu_detail.error "  + textStatus);
        }
    });
    return return_value;
}
/* クッキー取得テスト */
function chk_cookie(){
    $.ajax({
        type: "POST",
        async: false, 
        url: 'https://sanyu.mobi/init/?',
        data : {
            pr : '200' ,
            app : '100' ,
            email: 'info@sanyu.mobi',
            pass: '1234'
        },
        success: function(data, dataType) 
        {
            if(data == null) alert('データが0件でした');
            alert(data.session_id);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) 
        {
            //通常はここでtextStatusやerrorThrownの値を見て処理を切り分けるか、単純に通信に失敗した際の処理を記述します。
            //this;
            //thisは他のコールバック関数同様にAJAX通信時のオプションを示します。
            //エラーメッセージの表示
            alert('Error : ' + errorThrown);
        }
    });
}
/* 画像の取得 */
function read_img(code_idx){
    $.ajax({
        type: "POST",
        url: zaikourl,
        data : {
            pg : 12 ,
            key : code_idx,
            id: umail,
            session_id: sessid
        },
        success: function(data, dataType) 
        {
            if(data == null) alert('データが0件でした');
            if(data[0].image != null)
            {
                imgsize = 100;      /* CSS画像表示初期値に戻す */
                document.getElementById("p5pic1").src = data[0].image;
            }else{
                document.getElementById("p5pic1").src = null;
                alert("画像がありません。");
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) 
        {
            //通常はここでtextStatusやerrorThrownの値を見て処理を切り分けるか、単純に通信に失敗した際の処理を記述します。
            //this;
            //thisは他のコールバック関数同様にAJAX通信時のオプションを示します。
            //エラーメッセージの表示
            alert('Error : ' + errorThrown);
        }
    });
}
/* 画像の削除 */
/* 同じユーザーIDの画像しか削除できないようにする。 */
function del_img(){
    $.ajax({
        type: "POST",
        url: zaikourl,
        dataType: 'json',
        data: {pg: 12 ,
               delkey : myNavi.getCurrentPage().options.func,
               userid: user_id,
               id: umail,
               session_id: sessid
            },
        async: false,
        success: function(data, dataType) 
        {
            if((data.success == true) && (data.count > 0))
            {
                alert("削除しました。");
                myNavi.popPage();
            }else{
                alert("削除のクエリでエラーが発生しました。");
            }
                
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) 
        {
            //通常はここでtextStatusやerrorThrownの値を見て処理を切り分けるか、単純に通信に失敗した際の処理を記述します。
            //this;
            //thisは他のコールバック関数同様にAJAX通信時のオプションを示します。
            //エラーメッセージの表示
            alert('Error : ' + errorThrown);
        }
    });
}

/* システムログイン */
function login_server(){
    var return_value = 0;
    var smail = document.getElementById('t1-user').value;
    var spass = document.getElementById('t1-pass').value;
    $.ajax({
        type: "POST",
        url: baseurl,
        dataType: "json",
        data: {pr: 3 ,id: smail, pass: spass},
        async: false,
        success: function(data, dataType) 
        {
            //console.log(data.login);
            if(data.login == "1")
            {
                return_value = 1;
                uname1 = data.user_name1;
                uname2 = data.user_name2;
                umail = smail;
                upass = spass;
                sessid = data.sessid;
            }else{
                alert("ログインできません。");
                return_value = 0;
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) 
        {
            alert('Error : ' + errorThrown);
            return_value = 0;
        }
    });
    return return_value;
}

/* DB設定 */
function init_db(){
    var return_value = 0;
    $.ajax({
        type: "POST",
        url: baseurl,
        dataType: "json",
        data: {pr: 20 ,email: umail, session_id: sessid},
        async: false,
        success: function(data, dataType) 
        {
            //console.log(data.login);
            if(data.login == "1")
            {
                return_value = 1;
                dbsize = data.dbsize;
            }else{
                alert("ログインできません。");
                return_value = 0;
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) 
        {
            alert('Error : ' + errorThrown);
            return_value = 0;
        }
    });
    return return_value;
}

/* 個別DB情報取得 */
function get_dbinfo(){
    var return_value = 0;
    $.ajax({
        type: "POST",
        url: baseurl,
        dataType: "json",
        data: {pr: 20 ,email: umail, session_id: sessid},
        async: false,
        success: function(data, dataType) 
        {
            if(data.login == "1")
            {
                return_value = 1;
                dbuserid = data.db_user;
                dbuserpass = data.db_pass;
                dbname = data.db_name;
            }else{
                alert("ログインできません。");
                return_value = 0;
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) 
        {
            alert('Error : ' + errorThrown);
            return_value = 0;
        }
    });
    //console.log(urladd);
    
    return return_value;
}

/* 初回登録 */
function regist_server(){
    var return_value = 0;
    var smail = document.getElementById('t2-user').value;
    var spass = document.getElementById('t2-pass').value;
    $.ajax({
        type: "POST",
        url: baseurl,
        dataType: "json",
        data: {
                pr: 1 ,
                email: smail,
                passwd: spass
            },
        async: false,
        success: function(data, dataType) 
        {
            //console.log(data.login);
            if(data.status == 1)
            {
                return_value = 1;
                user_name = data.email;
                alert("登録確認メールを送信しました。");
                myNavi.pushPage('t1');
            }else{
                alert("登録エラーが生じました");
                return_value = 0;
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) 
        {
            alert('Error : ' + errorThrown);
            return_value = 0;
        }
    });
    //console.log(urladd);
    
    return return_value;
}

/* 利用ユーザー登録 */
function regist_user(){
    var return_value = 0;
    var smail = $("#y1-email").val();
    var spass = $("#y1-pass").val();
    var sname1 = $("#y1-name1").val();
    var sname2 = $("#y1-name2").val();
    $.ajax({
        type: "POST",
        url: baseurl,
        dataType: "json",
        data: {
                pr: 100 ,
                id: umail,
                session_id: sessid,
                email: smail,
                passwd: spass,
                name1: sname1,
                name2: sname2
            },
        async: false,
        success: function(data, dataType) 
        {
            //console.log(data.login);
            if(data.status == 1)
            {
                return_value = 1;
                user_name = data.email;
                alert("利用確認メールを送信しました。");
                myNavi.pushPage('t1');
            }else{
                alert("エラーが生じました");
                return_value = 0;
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) 
        {
            alert('Error : ' + errorThrown);
            return_value = 0;
        }
    });
    //console.log(urladd);
    
    return return_value;
}


function getUniqueStr(myStrong){
 var strong = 1000;
 if (myStrong) strong = myStrong;
 return new Date().getTime().toString(16)  + Math.floor(strong*Math.random()).toString(16);
}
// 撮影
function camera(idx){
    navigator.camera.getPicture(onSuccess, onFail, 
        {   quality: cam_quality ,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: navigator.camera.PictureSourceType.CAMERA,
            correctOrientation: true,
            //targetWidth:500, // 取得する画像の横幅
            //targetHeight:500, // 取得する画像の高さ
		    //allowEdit: true, // 正方形にトリミングするかどうか
            saveToPhotoAlbum: false
        });
	// 成功した際に呼ばれるコールバック関数
	function onSuccess (imageData) {
		// 写真データがあれば挿入
		if(typeof(imageData) != 'undefined' && imageData != '') {
			// データ保持
			image = imageData;
			// 挿入
            
            upload(idx, user_id , juid);
		}
        dlgCamera.hide();
	}
	// 失敗した場合に呼ばれるコールバック関数
	function onFail (message) {
		//alert('キャンセルしました。' + message);
        dlgCamera.hide();
	}
    
}

// アップロード
function upload(index , usrid, fid){
    var uuid = getUniqueStr();
    //alert("session_id:" + sessid + "\nemail: " + umail + "\nsampleflag:" + sampleflag + "\nindex:" + index + "\nfid:" + fid + "\nusrid:" + usrid);
    if(image != '') {
		$.ajax({
			type: 'post',
            url: zaikourl,
			data: {
                pg : 40 ,
				image_data: image, // 画像データ指定
                class: index,
                tmp_name: uuid,
                user_id: umail,
                f_id: fid,
                id: umail,
                session_id: sessid,
                sample: sampleflag
			},
			dataType: 'json',
			cache: false,
			async: true,
			xhr : function()
			{
				/* アップロード状況を表示 */
				XHR = $.ajaxSettings.xhr();
				if(XHR.upload)
				{
                    console.log("XHR.upload:");
					XHR.upload.addEventListener('progress',function(e)
					{
						progre = parseInt(e.loaded / e.total * 10000)/100;
						$('.progress .bar').text(Math.round(progre)+"%");
						$('.progress .bar').css('width', progre+"%");
					}, false); 
				}
				return XHR;
			},
			success: function(e, textStatus)
			{
				if(e.response == true)
				{
					// アラート
                    console.log("ajax success:" + e.errors);
                    $('.progress .bar').text("");
                    $('.progress .bar').css('width',"0%");
                    /* ページ更新 */
                    showDetail();
				}
				else
				{
					alert('アップロードに失敗しました。');
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				alert('error...');
			},
		});
	} else {
		alert('撮影されていません。');
	}
}

function showDetail(){
    /* 詳細画面の表示 */
    //console.log($("#p4mode").text() + " / " + $("#p4func").text());
    var objson = read_detail(Number($("#p4func").text()) , Number($("#p4mode").text()));
    if(objson != null)
    {
        $("#info4").html(objson);
    }else{
        $("#info4").html('<p align="left" onclick="myNavi.pushPage(\'t1\')">他の端末でアカウント' + umail + 'によるログインが行われた可能性があります。心当たりの無い場合はただちに弊社へご連絡ください。<p>');
        //$("#p3list").append('<p align="left">他の端末でアカウント' + umail + 'によるログインが行われた可能性があります。<p>');
    }
    var listElement = document.getElementById('info4'); //My ons-list element
    ons.compile(listElement);       // update
}

function onMP3Success() {
console.log("playAudio():Audio Success");
}
function onMP3Error(error) {
alert('code: ' + error.code + '\n' +
'message: ' + error.message + '\n');
}

/* ONSEN */
ons.bootstrap();
//var app = ons.bootstrap("myApp", ["onsen"]);
ons.disableAutoStatusBarFill();  // (Monaca enables StatusBar plugin by default)

ons.ready(function() {
    
   //var app = angular.module('sample', []);
    
    /* 効果音設定 */
    media1 = new Audio( mp3_src, onMP3Success, onMP3Error);
    
    /* 前回入力したID,PASSをセット */
    $('#t1-user').val(localStorage.getItem('p1-mail'));
    $('#t1-pass').val(localStorage.getItem('p1-pass'));
    
    if ( navigator.userAgent.indexOf('Android 4') > 0 ){
        devicetp = 0;
    }else if( navigator.userAgent.indexOf('iPhone') > 0 ){
        devicetp = 2;
        //cam_quality = 40;
        cam_quality = 50;
    }else if((navigator.userAgent.indexOf('Android 5') > 0) || (navigator.userAgent.indexOf('Android 6') > 0)) {
        devicetp = 1;
        //cam_quality = 90;
        cam_quality = 50;
    }else{
        devicetp = 3;
    }
    if(devicetp != 2)
    {
        $("#t1-exit").html('<ons-button onclick="navigator.app.exitApp();">終了</ons-button>');
        var listElement = document.getElementById('t1-exit'); //My ons-list element
        ons.compile(listElement);       // update
    }

    
    myNavi.on('prepush', function(event){
        var page = event.currentPage; /* 現在のページ取得 */
        //console.log("prepush:" + page.name);
        switch(page.name)
        {
            case "t1":          /* ログインチェック */
                if(pgevent == 0)
                {
                    var len = document.getElementById('t1-user').value.length;
                    var len2 = document.getElementById('t1-pass').value.length;
                    //if((len === 0) || (len2 === 0)){
                        //event.cancel();
                        //ons.notification.alert({ title: "エラー", message: "値を入力してください。" });
                    //}
                    //alert("kita1");
                    user_id = document.getElementById('t1-user').value;
                    user_pass = document.getElementById('t1-pass').value;
                    if(login_server() == 0)
                    {
                        alert('ログインできません。');
                        event.cancel();
                    }else{
                        /* ログイン情報を端末に保存 */
                        localStorage.setItem('p1-mail', umail);
                        localStorage.setItem('p1-pass', upass);
                        
                        /* DB情報取得 */
                        get_dbinfo();
                    }
                    //alert('prepush');
                }
                //alert('prepush');
                pgevent = 0;
                break;
            case "p1":          /* システムログイン */
                //alert('mail:' + umail + " /ssid :" + sessid);
                if(init_db() == 0)
                    event.cancel();
                //alert(dbsize);
                
                break;
            case "p2":
                
                //alert("kita2");
                break;
            case "p3":
//                dlgListAdd.show();
                //alert("kita3");
                break;
            case "p4":
                //dlgListAdd.hide();
                //dlgImg2.show();
                //alert("kita4");
                break;
            case "p5":
                
                //dlgImg.hide();
                //dlgImg2.show();
                console.log("kita5");
                break;
        }
    });
    myNavi.on("postpop", function(e) {             /* pop後のアニメーション終了後に発動 */
        var page = myNavi.getCurrentPage(); /* 現在のページ取得 */
        switch(page.name)
        {
            case "t1":
                //alert("logout"); 
                /* 変数初期化 */
                umail = ""; upass = ""; sessid = "";
                break;
            case "p4":              /* p5->p4　ページ遷移 */
                showDetail();
                break;
        }
        //console.log("postpop:" + page.name);
    });
    myNavi.on("postpush", function(e) {             /* push後のアニメーション終了後に発動 */
        console.log("postpush:" + e.enterPage.name);
        switch(e.enterPage.name)
        {
            case "t1":
                /* 前回入力したID,PASSをセット */
                $('#t1-user').val(localStorage.getItem('p1-mail'));
                $('#t1-pass').val(localStorage.getItem('p1-pass'));
                break;
            case "p1":              /* ログイン処理後 */
                //alert(umail);
                $('#p1-mail').val(umail);
                $('#p1-name1').val(uname1);
                $('#p1-name2').val(uname2);
                $('#p1-pass').val(upass);
                break;
            case "p2":
                break;
            case "p5":
                dlgImg2.hide();
                break;
        }
    });
    document.addEventListener("pageinit", function(e) {
        switch(myNavi.getCurrentPage().name)
        {
            case "t1":

                break;
            case "p1":
                //umail = localStorage.getItem('umail');
                //$('#p1-name1').val(uname1);
                //$('#p1-name2').val(uname2);
                //console.log("p1:init");
                break;
            case "p2":
                /* DBログイン */
//                var hiduke=new Date(); 
//                //年・月・日・曜日を取得する
//                var year = hiduke.getFullYear();
//                var month = hiduke.getMonth() + 1;
//                var week = hiduke.getDay();
//                var day = hiduke.getDate();
//                $('input[name=date]').val(year + "/" + month + "/" + day);
                document.getElementById('info2').textContent = "ログイン：" + uname1 + uname2 + "様";
                document.getElementById('info3').textContent = "データ使用量：" + floatFormat(dbsize,2) + "MBytes";
                break;
            case "p3":      /* リスト表示 */
                switch(myNavi.getCurrentPage().options.func)
                {
                    case 0:     /* 受注リストの表示 */
                        juid = 0;
                        menuidx = 0;
                        $("#p3-title").text("受注リスト");
                        show_list(juid, menuidx);
                        break;
                    case 10:    /* 本日出荷 */
                        menuidx = 0;
                        show_list(juid, 10);
                        document.getElementById('p3-title').innerHTML = "本日出荷";
                        break;
                    case 1:
                        menuidx = 1;
                        document.getElementById('p3-title').innerHTML = "売上リスト";
                        break;
                    case 2:
                        menuidx = 2;
                        document.getElementById('p3-title').innerHTML = "入出庫リスト";
                        show_list(juid, menuidx);
                        break;
                    case 20:    /* 本日入出庫 */
                        menuidx = 2;
                        document.getElementById('p3-title').innerHTML = "本日入出庫";
                        show_list(juid, 20);
                        break;
                    case 3:
                        menuidx = 3;
                        document.getElementById('p3-title').innerHTML = "指定日実績在庫";
                        show_list(juid, menuidx);
                        break;
                    case 4:
                        menuidx = 4;
                        document.getElementById('p3-title').innerHTML = "全在庫";
                        show_list(juid, menuidx);
                        break;
                }
                break;
            case "p4":      /* 詳細表示 */
                //$("#info4").html(myNavi.getCurrentPage().options.func);
                //alert(myNavi.getCurrentPage().options.mode);
                switch(myNavi.getCurrentPage().options.mode)
                {
                    case 0:                     /* 受注 */
                        $("#p4-title").html("受注詳細");
                        $("#p4mode").html("0");
                        $("#p4func").html(myNavi.getCurrentPage().options.func);
                        showDetail();
                        break;
                    case 1:
                        break;
                    case 2:                     /* 入出庫 */
                        $("#p4-title").html("入出庫詳細");
                        $("#p4mode").html("2");
                        $("#p4func").html(myNavi.getCurrentPage().options.func);
                        showDetail();
                        break;
                }
                dlgDetail.hide();
                break;
            case "p5":
                dlgImg2.show();
                read_img(myNavi.getCurrentPage().options.func);
                //var imgbox = document.getElementById('p5pic1');

                break;
        }
        //console.log(myNavi.getCurrentPage().options.func);
    });

});

