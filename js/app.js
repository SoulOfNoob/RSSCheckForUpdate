/**
 * RSS Check For Update
 *
 * Fetches an RSS feed and compares the title of its newest item with the one
 * cached from the previous run. Prints "true" if the item changed (or no cache
 * exists yet) and "false" otherwise. The cache is updated on every change.
 *
 * Usage:
 *   node app.js <RSS_URL> [CUSTOM_SUFFIX] [APP_DIR]
 *
 * Parameters:
 *   RSS_URL        (required) URL of the RSS feed to check,
 *                  e.g. https://steamcommunity.com/games/526870/rss/
 *   CUSTOM_SUFFIX  (optional) Appended to the cache file name ("_<suffix>").
 *                  Use it to keep separate caches for servers sharing a feed.
 *                  Pass "" to skip it while still setting APP_DIR.
 *   APP_DIR        (optional) Directory in which the "localStorage" cache
 *                  folder is created. Defaults to the directory of this file.
 *                  Use it when the script directory is not writable.
 *
 * Cache file:
 *   <APP_DIR>/localStorage/<Feed_Title>[_<CUSTOM_SUFFIX>].txt
 *
 * Output (stdout):
 *   true   newest item differs from the cached one -> update detected
 *   false  newest item equals the cached one       -> no update
 *
 * Exit codes:
 *   0  check completed
 *   1  missing RSS_URL, or the cache file could not be written
 */
const Parser = require('rss-parser');
const fs = require('node:fs');
const path = require('node:path');

const parser = new Parser();

(async () => {
  if (typeof process.argv[2] === "undefined" || process.argv[2] === "") {
    console.error("no URL provided");
    process.exit(1)
  }
  const rssUrl = process.argv[2];

  let customSuffix = "";
  if (typeof process.argv[3] !== "undefined" && process.argv[3] !== "") {
    customSuffix = "_" + process.argv[3];
  }

  let appDir = path.dirname(require.main.filename);
  if (typeof process.argv[4] !== "undefined" && process.argv[4] !== "") {
    appDir = path.resolve(process.argv[4]);
  }

  let feed = await parser.parseURL(rssUrl);

  const newestUpdate = feed.items[0].title;
  const snake_title = feed.title.replace(/[^a-zA-Z ]/g, "").replaceAll(" ", "_");
  const filename = path.join(appDir, 'localStorage', snake_title + customSuffix + '.txt');

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
    fs.mkdirSync(path.dirname(filename), { recursive: true });
    fs.writeFileSync(filename, newestUpdate);
  } catch (err) {
    // Without a cache every run would report an update, so fail loudly instead.
    console.error("could not write cache file: " + err.message);
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
