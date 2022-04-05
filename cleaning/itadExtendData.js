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

// const file = readFile("./data/test.html");
// const file2 = readFile('./data/working/itadData/aaero.html')

function findSalesHistory(filename) {
  const file = readFile(filename);

  const startInd =
  // magic numbers
    file.indexOf(
      `Charts.Builder`
    ) + 23;
  
  const endInd = file.indexOf("}",startInd) + 1;

  const priceStr = file.slice(startInd, endInd).replace(/\\/g, '').replace(/\\\"/g, '');

  const bestPriceSeries = JSON.parse(priceStr).data;
  const itadPlain = path.basename(filename).replace(".html", "");
  console.log(itadPlain);
  writeObj(`./data/working/itadProcessed/${itadPlain}.json`, bestPriceSeries);
}

glob("./data/working/itadData/*.html", {}, function (er, files) {
  // files is an array of filenames.
  // If the `nonull` option is set, and nothing
  // was found, then files is ["**/*.js"]
  // er is an error object or null.

  files.forEach((file) => {
    findSalesHistory(file);
  });

  // findSalesHistory("data/working/itadData/aaero.html");
});
