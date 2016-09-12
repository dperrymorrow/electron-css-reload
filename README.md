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

Since Electron has access to the file system, it uses ```fs.watchFile``` to watch for changes to the files loaded via ```<link>``` tags on the page. 

When a change event fires, a ```?nocache={timestamp}``` is added to the href on the stylesheet link on the page.
This forces the browser to reload the sheet as it sees it as a new url.
