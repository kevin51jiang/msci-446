const fs = require("fs");

function readFile(filename) {
  return fs.readFileSync(filename, "utf-8");
}

function jsonReadFile(filename) {
  return JSON.parse(readFile(filename));
}

function writeObj(filename, obj) {
    fs.writeFileSync(filename, JSON.stringify(obj))
}

// Given all the steam app Ids, we get the details for each one

const allSteamIds = jsonReadFile("./data/raw/allSteamIds.json").applist.apps;
const steamApps = allSteamIds.filter((idObj) => idObj.name);

// ok, now we load all the apps from itad
const itadApps = jsonReadFile("./data/raw/itadApps.json");

console.log(itadApps.length);

// load in the map
const steamItadMap = jsonReadFile("./data/raw/steamItadMap.json").data.steam;

const steamData = [];

// look up all the trending itad things by finding the steam map.
// if the steam map doesn't exist, skip to the next one (we only focus on steam games in this project)
// this game is veeeery bad and inefficient. Don't copy it.
itadApps.map((itadApp, ind) => {
  let correspondingSteamApp = Object.entries(steamItadMap).find(
    (steamApp) => steamApp[1] === itadApp.plain
  );
  if (correspondingSteamApp) {
    steamData.push({
      steamId: correspondingSteamApp[0],
      itadPlain: correspondingSteamApp[1],
      itad: {
        position: itadApp.position,
        rank: itadApp.rank,
      },
    });
    console.log(ind, correspondingSteamApp);
  }
});

writeObj('./data/working/apps.json', steamData)
