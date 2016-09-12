
const fs = require('fs');
const CACHE_PARAM = "?nocache=";

module.exports = function() {
  let sheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));

  sheets.forEach(sheet => {
    fs.watchFile(_nodePath(sheet.href), (curr, pref) => {
      sheet.href = sheet.href.split(CACHE_PARAM)[0] + CACHE_PARAM + new Date().getTime();
      console.log(`reloading: ${sheet.href}`);
    });
  });
}

function _nodePath(url) {
  return url.replace('file://', '').split(CACHE_PARAM)[0];
}
