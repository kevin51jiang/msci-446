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




// relative to root directory
const datafile = "./data/working/apps.json";

try {
  const data = jsonReadFile(datafile);

  // add everything to a queue

  // we want to find the steam
  // cloudflare workers might work LMAO

  let ids = data.map((app) => app.itadPlain); // just give us an array of numbers, in the form of strings

  var interval = setInterval(() => {
    const itadPlain = ids.pop();
    console.log("going for id ", itadPlain, ", ", ids.length, " left");

    // e.g. 435150
    axios
      .get(
        `https://new.isthereanydeal.com/game/${itadPlain}/history/#cp:detail;cc:cut;cs:duration`,
        {
          headers: {
            "sec-ch-ua":
              '" Not A;Brand";v="99", "Chromium";v="99", "Google Chrome";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36",
          },
        }
      )
      .then((res) => {
        writeObj(`./data/working/itadData/${itadPlain}.html`, res.data);
      })
      .then(() => {
        if (ids.length === 0) {
          clearInterval(interval);
        }
      })
      .catch((err) => {
        console.log("had err with ", itadPlain , err);
      });
  }, 1000);
} catch (err) {
  console.error(err.toString());
}
