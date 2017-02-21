const fs = require('fs');
const path = require('path');
const CACHE_PARAM = "?nocache=";
const opts = {
  persistent: true,
  interval: 1000,
};

let stash = document.createElement("div");
let htmlFiles = [];
let watchedFiles = [];
let isWin = /^win/.test(process.platform);

module.exports = function(interval=opts.interval) {
  _externalSheets();
  setInterval(_inlineStyles, interval);
}

function _externalSheets() {
  let sheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));

  sheets.forEach(sheet => {

    let mainFile = _nodePath(sheet.href);
    if (isWin) mainFile = mainFile.substr(1);
    let deps = sheet.getAttribute('data-sources');
    let prefix = mainFile.split('/');

    prefix.splice(prefix.length - 1, 1);
    prefix = prefix.join('/');

    deps = deps ? deps.split(',') : [];
    deps = deps.map((dep) => `${prefix}/${dep}`);
    deps.push(mainFile);

    try {
      deps.forEach((dep) => {
        console.log(`watching ${dep} for changes`);
        fs.watchFile(dep, opts, (curr, pref) => {
          sheet.href = sheet.href.split(CACHE_PARAM)[0] + CACHE_PARAM + new Date().getTime();
          console.log(`reloading: ${sheet.href}`);
        });
      });
    } catch (err) {
      _throw(err);
    }
  });
}

function _inlineStyles() {
  let styles = Array.from(document.getElementsByTagName('style'));

  styles.forEach(style => {
    let source = style.getAttribute('data-source');

    if (source) {
      let file = fs.realpathSync(process.cwd() + source);
      if (!htmlFiles.includes(file)) htmlFiles.push(file);
    }
  });

  htmlFiles.forEach(file => {
    try {

      if (watchedFiles.includes(file)) return;
      watchedFiles.push(file);
      console.log(`watching ${file} for changes`);

      fs.watchFile(file, opts, (curr, pref) => {
        fs.readFile(file, 'utf-8', (err, data) => {
          if (err) _throw(err);
          console.log(`reloading ${file}`);
          _updateHtmlStyles(data);
        });
      });

    } catch (err) {
      _throw(err);
    }
  });
}

function _updateHtmlStyles(data) {
  stash.innerHTML = data;
  let updated = Array.from(stash.getElementsByTagName('style'));

  updated.forEach(sheet => {
    let id = sheet.getAttribute('id');
    document.getElementById(id).innerHTML = sheet.innerHTML;
  });
}

function _throw(err) {
  console.warn('electron-css-reload:', err.message, err.stack)
}

function _nodePath(url) {
  return url.replace('file://', '').split(CACHE_PARAM)[0];
}
