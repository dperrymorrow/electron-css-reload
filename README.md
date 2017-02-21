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

You can also pass in the frequency you would like it to look for chanages in your css
> defaults to 1000 (1 second)

```javascript
reload(250)
```

That't it, enjoy not restarting your Electron app every time you wanna see a CSS change.

## Also watching dependencies of the css file

You can also watch dependencies of the CSS file you have loaded. This is helpful for situations like including other CSS files into your main file.


```html
<link rel="stylesheet" type="text/css" href="../../frontend/styles/index.css" data-source="fonts.css,animations.css"/>
```

> the paths in data-sources should be relative to the file path of the href

## Watching inline-styles

You can also watch inline styles for changes by giving an id, and a ```data-source```.


> data-source path should be top down from your electron application.

```html
<style type="text/css" id="test-id" data-source="/app/pages/main/index.html">
  body {
    background-color: red;
  }
</style>
```

## How does it work?

Since Electron has access to the file system, it uses ```fs.watchFile``` to watch for changes to the files loaded via ```<link>``` tags on the page.

When a change event fires, a ```?nocache={timestamp}``` is added to the href on the stylesheet link on the page.
This forces the browser to reload the sheet as it sees it as a new URL.
