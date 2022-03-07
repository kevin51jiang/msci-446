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

const hehe = $('.js-log').children().map((ind, el) => {
    return el.chi
})

console.log(heh)


