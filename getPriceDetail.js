// ==UserScript==
// @name         PTCGO Prices Downloader
// @version      1.1
// @description  下載完整價格表
// @author       阿一
// @include      https://ptcgoprices.com/*
// @license      GPL
// ==/UserScript==
// @run-at       document-idle

(function() {
    'use strict';
    // document.getElementById("help").innerHTML = "Total cards: "+total_cards+"<br>";
    document.getElementById("help").insertAdjacentHTML('afterend', '<button id="btn_dl">Download</button>');
    document.getElementById("btn_dl").addEventListener("click", function(){downloadList()}, false);
}
)();

function getDateTime() {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth()+1;
        var day = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        if(month.toString().length == 1) {
             month = '0'+month;
        }
        if(day.toString().length == 1) {
             day = '0'+day;
        }
        if(hour.toString().length == 1) {
             hour = '0'+hour;
        }
        if(minute.toString().length == 1) {
             minute = '0'+minute;
        }
        if(second.toString().length == 1) {
             second = '0'+second;
        }
        var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;
         return dateTime;
    }

function downloadList() {
    var item = document.getElementsByClassName("grid-item");
    var total_cards = item.length;
    console.log("Total "+item.length)+" cards are parsed.";
    var text = "CID\tName\tPack\tID\tType\tSelling\tNumOfAsks\tBuying\tNumOfBids\tDiff\tUpdateTime\n";
    var i;
    var startTime = Math.round(new Date().getTime()/1000);
    //var now = new Date();
    //var timeupdate = document.getElementById("timeupdated").innerText
    var timeupdate = getDateTime();
    for (i = 0; i < total_cards; i++) {
        var tmpOut = item[i].dataset["cid"]+"\t"+
        item[i].children[0].innerText.replaceAll("\n","\t")+"\t"+
        item[i].children[1].innerText.replace("\n","\t").replace(" Asks","")+"\t"+
        item[i].children[2].innerText.replace("\n","\t").replace(" Bids","")
        var tmp = tmpOut.split("\t");
        // console.log(tmp.length);
        var cid = "";
        var name = "";
        var card_id = "";
        var card_type = "";
        var ask_price = "";
        var ask_number = "";
        var bid_price = "";
        var bid_number = "";
        var diff = "";
        var pack_name = "";
        var result = "";
        if (tmp.length > 7){
            cid = tmp[0];
            name = tmp[1];
            card_id = tmp[2];
            card_type = tmp[3];
            ask_price = tmp[4];
            ask_number = tmp[5];
            bid_price = tmp[6];
            bid_number = tmp[7];
            diff = bid_price-ask_price;
            pack_name = card_id.split(' ')[0];
            result =[cid, name,pack_name,card_id,card_type,ask_price,ask_number,bid_price,bid_number,diff,timeupdate].join("\t");
            // console.log(output);
            text += result + "\n"
        }else if(tmp.length == 7){
            cid = tmp[0];
            name = tmp[1];
            card_id = tmp[2];
            card_type = "-";
            ask_price = tmp[3];
            ask_number = tmp[4];
            bid_price = tmp[5];
            bid_number = tmp[6];
            diff = bid_price-ask_price;
            pack_name = card_id.split(" ")[0];
            result =[cid, name,pack_name,card_id,card_type,ask_price,ask_number,bid_price,bid_number,diff,timeupdate].join("\t");
            // console.log(output);
            text += result + "\n"
        }else{
            console.log(tmpOut)
        }
    }
    var endTime = Math.round(new Date().getTime()/1000);
    var timeDiff = endTime - startTime;
    console.log("Elapsed Time: "+timeDiff+" sec.");
    let blob = new Blob([text]);
    let url = URL.createObjectURL(blob);
    let file = document.createElement(`a`);
    file.download = "ptcgo-prices.txt";
    file.href = url;
    document.body.appendChild(file);
    file.click();
    file.remove();
    URL.revokeObjectURL(url);
}