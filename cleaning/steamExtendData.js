const { default: axios } = require("axios");
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

  let ids = data.map((app) => app.steamId.replace("app/", "")).slice(0, 1000); // just give us an array of numbers, in the form of strings

  var interval = setInterval(() => {
    const id = ids.pop();
    console.log("going for id ", id, ", ", ids.length, " left");

    // e.g. 435150
    axios
      .get(
        `http://store.steampowered.com/api/appdetails?appids=${id}&filters=basic,developers,price_overview,demos,metacritic,categories,genres`,
        {
          headers: {
            referer: "https://store.steampowered.com/",
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
        writeObj(`./data/working/steamData/${id}.json`, res.data);
      })
      .then(() => {
        if (ids.length === 0) {
          clearInterval(interval);
        }
      })
      .catch((err) => {
        console.log("had err with ", id);
      });
  }, 1650);
} catch (err) {
  console.error(err.toString());
}
