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


  // we want to find the steam 

  console.log(allData);
} catch (err) {
  console.error(err);
}
