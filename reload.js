const fs = require('fs');
const CACHE_PARAM = "?nocache=";

module.exports = function() {
  let sheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));

  sheets.forEach(sheet => {
    var opts = {
      persistant: true,
      interval: 1000,
    };

    let mainFile = _nodePath(sheet.href);
    let deps = sheet.getAttribute('deps');
    let prefix = mainFile.split('/');

    prefix.splice(prefix.length - 1, 1)
    prefix = prefix.join('/');

    deps = deps ? deps.split(',') : [];
    deps = deps.map((dep) => `${prefix}/${dep}`);
    deps.push(mainFile);

    deps.forEach((dep) => {
      console.log(`watching ${dep} for changes`);
      fs.watchFile(dep, opts, (curr, pref) => {
        sheet.href = sheet.href.split(CACHE_PARAM)[0] + CACHE_PARAM + new Date().getTime();
        console.log(`reloading: ${sheet.href}`);
      });
    });
  });
}

function _nodePath(url) {
  return url.replace('file://', '').split(CACHE_PARAM)[0];
}