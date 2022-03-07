const fs = require("fs");
// glues the processed steam data and itad together using steamItadMap.json

// get list of files, cache it to make it uberduper fast wao

function readFile(filename) {
  return fs.readFileSync(filename, "utf-8");
}

function jsonReadFile(filename) {
  return JSON.parse(readFile(filename));
}

function writeObj(filename, obj) {
  fs.writeFileSync(filename, JSON.stringify(obj));
}

function getJsonFiles(directory) {
  return fs.readdirSync(directory).filter((file) => file.endsWith(".json"));
}

const steamFiles = getJsonFiles("./data/working/steamData");
const itadFiles = getJsonFiles("./data/working/itadProcessed");

// make them maps to make querying faster
const steamCache = steamFiles.reduce((accum, curr) => {
  accum[curr.toString().replace(".json", "")] = true;
  return accum;
}, {});

// console.log(steamCache);

const itadCache = itadFiles.reduce((accum, curr) => {
  accum[curr.toString().replace(".json", "")] = true;
  return accum;
}, {});

// console.log(itadCache);
let allData = [];
// go through the itad <-> steam map, make sure both exist as files. If they do, then merge the objects, and append to our data
jsonReadFile("./data/working/apps.json")
  .map((obj) => {
    return { ...obj, steamId: obj.steamId.replace("app/", "") };
  })
  .filter((obj) => {
    return steamCache[obj.steamId] && itadCache[obj.itadPlain];
  })
  .map((obj) => {
    // both exist/have successfully been downloaded. Lets merge and add to our data
    const steamData = jsonReadFile(
      `./data/working/steamData/${obj.steamId}.json`
    );
    const itadData = jsonReadFile(
      `./data/working/itadProcessed/${obj.itadPlain}.json`
    );

    const data = {
      ...obj,
      steam: steamData[obj.steamId].data,
      itad: { ...obj.itad, sales: itadData },
    };

    allData.push(data);
  });

// output data
writeObj("./data/processed/data.json", allData);
