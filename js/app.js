const Parser = require('rss-parser');
const fs = require('node:fs');

const { dirname } = require('path');
const appDir = dirname(require.main.filename);


const parser = new Parser();

(async () => {
  if (typeof process.argv[2] === "undefined" || process.argv[2] === "") {
    console.error("no URL provided");
    process.exit(1)
  }

  let customSuffix = "";
  if (typeof process.argv[3] !== "undefined" && process.argv[3] !== "") {
    customSuffix = "_" + process.argv[3];
  }

  const rssUrl = process.argv[2];

  let feed = await parser.parseURL(rssUrl);

  const newestUpdate = feed.items[0].title;
  const snake_title = feed.title.replace(/[^a-zA-Z ]/g, "").replaceAll(" ", "_");
  const filename = appDir + '/localStorage/' + snake_title + customSuffix + '.txt'
  // console.log(feed.title);
  // console.log(customSuffix);
  // console.log(filename);

  console.log(checkNewestUpdate(filename, newestUpdate));

  process.exit(0)
})();

function getLastUpdateFromFile(filename) {
  try {
    const data = fs.readFileSync(filename, 'utf8');
    return data;
  } catch (err) {
    return null;
  }
}

function writeNewestUpdateToFile(filename, newestUpdate) {
  try {
    fs.writeFileSync(filename, newestUpdate);
    return true;
  } catch (err) {
    // console.error(err);
    return false;
    process.exit(1);
  }
}

function checkNewestUpdate(filename, newestUpdate) {
  const lastUpdate = getLastUpdateFromFile(filename);
  if (lastUpdate === null || lastUpdate !== newestUpdate) {
    writeNewestUpdateToFile(filename, newestUpdate);
    return true;
  }
  return false;
}
