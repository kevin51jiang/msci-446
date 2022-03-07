const fs = require("fs");

const fileNames = [
  "gamelist01.json",
  "gamelist02.json",
  "gamelist03.json",
  "gamelist04.json",
  "gamelist05.json"
];

// relative to root directory
const rawDir = "./data/raw/";

try {
  let allData = [];

  fileNames.map((filename) => {
    const data = fs.readFileSync(rawDir + filename, "utf-8");
    const jsonified = JSON.parse(data);
    allData = allData.concat(jsonified[0])
  });

  fs.writeFileSync(rawDir + "itadApps.json", JSON.stringify(allData));




  console.log(allData);
} catch (err) {
  console.error(err);
}
