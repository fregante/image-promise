# image-promise

> Load an image and return a promise in the browser, in 0.3KB, no dependencies

[![gzipped size](https://badges.herokuapp.com/size/github/bfred-it/image-promise/master/dist/image-promise.browser.js?gzip=true&label=gzipped%20size)](#readme)
[![Travis build status](https://api.travis-ci.org/bfred-it/image-promise.svg?branch=master)](https://travis-ci.org/bfred-it/image-promise)
[![npm version](https://img.shields.io/npm/v/image-promise.svg)](https://www.npmjs.com/package/image-promise) 

## Install

```sh
npm install --save image-promise
```
```js
import loadImage from 'image-promise';
```

If you don't use node/babel, include this:

```html
<script src="dist/image-promise.browser.js"></script>
```

It uses the ES2015 `window.Promise`, so if you need to support [older browsers](http://caniuse.com/#feat=promises) (IE<=11) you need a polyfill.

## Usage

```js
loadImage( '/cat.jpg' );
// Returns a Promise that resolves with an image (`<img>`)

loadImage( ['/cat.jpg', '/dog.png'] );
// Returns a Promise that resolves with **an array of images.**

loadImage( document.querySelector('img') ); // one element
loadImage( document.querySelectorAll('img') ); // any Array-like list of elements
// The promises resolve when the provided <img>s are loaded
```

## Examples

Load one image:

```js
loadImage('cat.jpg')
.then(function (img) {
	ctx.drawImage(img, 0, 0, 10, 10);
})
.catch(function () {
	console.error('Image failed to load :(');
});
```

Load multiple images

```js
loadImage(['/cat.jpg', '/dog.png']) // array of URLs
.then(function (allImgs) {
	console.log(allImgs.length, 'images loaded!', allImgs);
})
.catch(function (firstImageThatFailed) {
	// it fails fast like Promise.all 
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all#Promise.all_fail-fast_behaviour
	console.error('One or more images have failed to load :(');
});
```

## Automatic cache

If you pass image URLs (first two examples), `image-promise` will caches the generated `<img>` tags so successive calls with the same exact `src` string will return the same `<img>` tag and will be resolved at the same time as the first one.

Because the `<img>` are cached internally, if you want to uncache and [unload them from memory](http://www.fngtps.com/2010/mobile-safari-image-resource-limit-workaround/), call the `unload` method on the same `src`:

```js
loadImage.unload('img.jpg'); // like with loadImage(), you can also pass an array of URLs or elements
```

## Dependencies

None! But you need to polyfill `window.Promise` in IE<=11

## License

MIT © [Federico Brigante](http://twitter.com/bfred_it)
