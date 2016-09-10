# electron-css-reload
force reload CSS on change in your electron App

Reload style sheets on your page on change in your electron App.

## Usage

```javascript
const reload = require('electron-css-reload');
```

Then, open your devtools window and invoke the method to begin watching for CSS changes in your Electron app.

```javascript
// from your console
reload()
```

Or, when in dev mode, invoke the method from the start.

```javascript
require('electron-css-reload')();
```

That't it, enjoy not restarting your Electron app every time you wanna see a CSS change.

## How does it work?

Since Electron has access to the file system, it uses ```fs.stat mtime``` returned to see if the file has changed since the last time it was loaded.
If so, it adds a ```?nocache={timestamp}``` to the href on the stylesheet link on the page.

This forces the browser to reload the sheet as it sees it as a new url.
