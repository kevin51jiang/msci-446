const cheerio = require("cheerio");
const path = require("path");
const glob = require("glob");
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

const file = readFile("./data/test.html");

function findSalesHistory(filename) {
  const $ = cheerio.load(file);

  let sales = [];

  $(".js-log-entry").each((ind, el) => {
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

    // Aternatively for historical lows:
    // <div class='gp-log__curr gp-log-data__new'>
    //     <div class='ptag ptag--fh ptag--log'><span class='ptag__flag'>H</span><span
    //             class='ptag__price'>C$4.99</span></div>
    // </div>

    // ^ above labelled things are the ones I want to keep

    let newActual = $(el)
      .children()
      .eq(5)
      .children()
      .eq(3)
      .text()
      .replace("H", "")
      .trim();

    sales.push({
      shopId: el.attribs["data-log-shop"],
      shopName: $(el).children().eq(1).children().eq(0).text(), // 1-0-0
      timeOfChange: $(el).children().eq(1).children().eq(1).text(),
      changeLength: $(el).children().eq(2).children().eq(0).text(), // 2-0
      timeSinceLastChange: $(el).children().eq(2).children().eq(1).text(), // 2-1
      prevDiscountPercentage: $(el)
        .children()
        .eq(4)
        .children()
        .eq(0)
        .children()
        .eq(0)
        .text(), // 4-0-0
      newDiscountPercentage: $(el)
        .children()
        .eq(4)
        .children()
        .eq(0)
        .children()
        .eq(2)
        .text(), // 4-0-2
      prevActual: $(el).children().eq(5).children().eq(1).text(), // 5-1
      newActual, // THIS IS A SPECIAL CASE 5-3, there is option of having historical low
      prevRegular: $(el).children().eq(5).children().eq(5).text(), //5-5
      newRegular: $(el).children().eq(5).children().eq(7).text(), //5-7
    });
  });

  const itadPlain = path.basename(filename).replace(".html", "");
  console.log(itadPlain);
  writeObj(`./data/working/itadProcessed/${itadPlain}.json`, sales);
}

glob("./data/working/itadData/*.html", {}, function (er, files) {
  // files is an array of filenames.
  // If the `nonull` option is set, and nothing
  // was found, then files is ["**/*.js"]
  // er is an error object or null.

  files.forEach((file) => {
    findSalesHistory(file);
  });
});
