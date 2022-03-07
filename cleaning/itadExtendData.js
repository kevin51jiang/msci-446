const { default: axios } = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

function readFile(filename) {
  return fs.readFileSync(filename, "utf-8");
}

function jsonReadFile(filename) {
  return JSON.parse(readFile(filename));
}

function writeObj(filename, obj) {
  fs.writeFileSync(filename, JSON.stringify(obj));
}


// gets the sale data from itad
// we use the itadPlain in this case, go to url 
// https://new.isthereanydeal.com/game/residentevilbiohazardhdremaster/history/#cp:detail;cc:cut;cs:duration
// https://new.isthereanydeal.com/game/${itadPlain}/history/#cp:detail;cc:cut;cs:duration

// it gives us something similar to ../data/test.html , where we have to extract the sale days from the HTML

const file = readFile("./data/test.html")


const $ = cheerio.load(file);

let sales = []

const hehe = $('.js-log-entry').eq(0).map((ind, el) => {
    // each element is a "sale", aka a "js-log-entry" class

    // <div class='gp-log__entry js-log-entry' data-log-shop='25'>
    //     <div class='gp-log__border' style='background-color:#b76cc7'></div>
    //     <div class='gp-log__c gp-log__main'>
    // 1-0-0   <div class='gp-log__shop'><span class='shop'>Gamesload<i
    //                     class='shop__aff far fa-heart'></i></span></div>
    // 1-1     <div class='gp-log__time'>2021-01-29 00:15</div>
    //     </div>
    //     <div class='gp-log__c gp-log__rel'>
    // 2-0     <div><i class='fas fa-arrow-alt-up gp-log__dur'></i>19 hours</div>
    // 2-1     <div><i class='fas fa-arrow-alt-down gp-log__dur'></i>13 minutes</div>
    //     </div>
    //     <div class='gp-log__c gp-log__rep'><a
    //             href='#/page:game/residentevilbiohazardhdremaster/history/report/20395814206/'
    //             class='gp-log__bug'><i class='fas fa-bug'></i></a></div>
    //     <div class='gp-log__c'>
    //         <div class='gp-log__cutchange'>
    // 4-0-0       <div class='gp-log__cut gp-log__prev'>0%</div>
    //             <div class='gp-low__del'><i class='fas fa-arrow-alt-right gp-log__arrow'></i></div>
    // 4-0-2       <div class='gp-log__cut gp-log__curr'>75%</div>
    //         </div>
    //     </div>
    //     <div class='gp-log__c gp-log-data'>
    //         <div class='gp-log-data__label'>actual:</div>
    // 5-1    <div class='gp-log__prev gp-log-data__new'>C$25.45</div>
    //         <div class='gp-log__del'><span class='gp-log__diff  gp-log__diff--less'>C$-19.04</span><i
    //                 class='fas fa-arrow-alt-right gp-log__arrow'></i></div>
    // 5-3     <div class='gp-log__curr gp-log-data__new'>C$6.41</div>
    //         <div class='gp-log-data__label'>regular:</div>
    // 5-5     <div class='gp-log__prev gp-log-data__old'>C$25.45</div>
    //         <div class='gp-log__del gp-log-data__old'><span
    //                 class='gp-log__diff  gp-log__diff--more'>+C$0.17</span><i
    //                 class='fas fa-arrow-alt-right gp-log__arrow'></i></div>
    // 5-7     <div class='gp-log__curr gp-log-data__old'>C$25.63</div>
    //     </div>
    // </div>

    // ^ above labelled things are the ones I want to keep

 
    
    return {
        shopId: el.attribs['data-log-shop'],
        shopName: $(this).children().text()
    }
   
})

console.log(hehe)


