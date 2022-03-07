

const fs = require('fs');
// glues the processed steam data and itad together using steamItadMap.json


// get list of files, cache it to make it uberduper fast wao



fs.readdirSync(testFolder).forEach(file => {
  console.log(file);
});