
const fs = require('fs');
const CACHE_PARAM = "?nocache=";

function _refresh() {
  let sheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));

  sheets.forEach(sheet => {

    fs.stat(_cleanUrl(sheet.href), (err, data) => {
      if (!err) {
        let modTime = new Date(data.mtime).getTime();
        let lastUpdated = _lastUpdated(sheet.href);

        if (!lastUpdated || lastUpdated < modTime) {
          _reloadSheet(sheet);
        }
      }
    });

  });

}

function _lastUpdated(url) {
  return url.split(CACHE_PARAM)[1];
}

function _reloadSheet(sheet) {
  sheet.href = sheet.href.split(CACHE_PARAM)[0] + CACHE_PARAM + new Date().getTime();
  console.log(`reloading: ${sheet.href}`);
}

function _cleanUrl(url) {
  return url.replace('file://', '').split(CACHE_PARAM)[0];
}

module.exports = function () {
  setInterval(_refresh, 3000);
};