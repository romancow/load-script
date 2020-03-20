# load-script
Promise-based method for dynamically loading scripts in browser with TypeScript support

<sup>*Promises must be polyfilled if environment does not already support it.</sup>

## Installation

Add a scope mapping for the GitHub npm package manager by adding a `.npmrc` file with the line:
```
@romancow:registry=https://npm.pkg.github.com/
```

Then install the package:
```
npm install @romancow/load-script
```
or
```
yarn add @romancow/load-script
```

More info on using the GitHub npm package registry [here](https://help.github.com/en/articles/configuring-npm-for-use-with-github-package-registry#installing-a-package).

Or just [download](https://github.com/romancow/load-script/releases/latest) it.

## Usage

Import it:
```javascript
import loadScript from '@romancow/load-script'
```

Or use a traditional script tag:
```html
<script src="load-script.js"></script>
```

Then use `loadScript` as a function to load javascript at a given url:
```javascript
loadScript("some/js/lib.js");
```

By default it returns a promise that resolves to the correpsonding `HTMLScriptElement` after the script has loaded.
```javascript
const scriptElement = await loadScript("some/js/lib.js");
```
or
```javascript
loadScript("some/js/lib.js").then(function () {
	// do stuff script needs to be loaded for
});
```

### Options

You can also pass an options object as a second argument to the method.
All options are optional.
```javascript
loadScript("some/js/my-module.js", { type: "module", async: true });
```

There are several options that correspond directly to attributes that will be set on the created script element. More info on them [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#Attributes).
- `async` (boolean)
- `defer` (boolean)
- `crossOrigin` (string)
- `integrity` (string)
- `noModule` (boolean)
- `nonce` (string)
- `referrerPolicy` (string)
- `type` (string)

And then a few more "advanced" options:
<dl>
	<dt><code>parent</code> (string | Element)</dt>
	<dd>An <code>Element</code> instance or query selector string to use as the parent element to append newly created script elements to. Default is the document's head element.</dd>
	<dt><code>force</code> (boolean)</dt>
	<dd>Whether to circumvent browser caching by appending a random query string to the url, "forcing" it to refresh when added. Default is false.</dd>
	<dt><code>id</code> (string)</dt>
	<dd>Id used for caching loaded scripts. Also applied as the id attribute to corresponding script elements.<dd>
	<dt><code>cache</code> (boolean)</dt>
	<dd>Whether to cache the promise for the given id or url, rather than adding a new script element for each one. Default is false.</dd>
	<dt><code>map</code> (string | Function)</dt>
	<dd>A global variable or function dictating the resolved value of <code>loadScript</code>'s returned promise. Unlike other options, this value will be evaluated each time <code>loadScript</code> is called, whether it's retrieved from cache or not. Will be the corresponding script's element by default.<dd>
</dl>

```javascript
const $ = await loadScript("https://code.jquery.com/jquery-3.4.1.min.js", {
	integrity: "sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=",
	crossOrigin: "anonymous",
	map: function() { return jQuery.noConflict() }
});
```

## License
[ISC](https://opensource.org/licenses/ISC)
