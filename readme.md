# image-promise [![gzipped size][badge-gzip]](#no-link) [![Travis build status][badge-travis]][link-travis] [![npm version][badge-version]][link-npm] [![npm downloads][badge-downloads]][link-npm]

  [badge-gzip]: https://badges.herokuapp.com/size/github/bfred-it/image-promise/master/dist/image-promise.min.js?gzip=true&label=gzipped%20size
  [badge-travis]: https://api.travis-ci.org/bfred-it/image-promise.svg
  [badge-version]: https://img.shields.io/npm/v/image-promise.svg
  [badge-downloads]: https://img.shields.io/npm/dt/image-promise.svg
  [link-travis]: https://travis-ci.org/bfred-it/image-promise
  [link-npm]: https://www.npmjs.com/package/image-promise

> Load one or more images, return a promise. Only 0.4KB, for the browser, no dependencies.

It can be used in two ways:

- given a URL, generate an `<img>` and wait for it to load:

	```js
	loadImage('img.jpg').then(/*it's loaded!*/)
	```

- given an `<img>`, wait for it to load:

	```js
	const img = document.querySelector('img.my-image');
	loadImage(img).then(/*it's loaded!*/)
	```

## Install

Pick your favorite:

```html
<script src="dist/image-promise.min.js"></script>
```

```sh
npm install --save image-promise
```

```js
var loadImage = require('image-promise');
```

```js
import loadImage from 'image-promise';
```

## Usage

### One image

`loadImage(image)` will return a Promise that resolves when the image load, or fails when the image 

```js
var image = 'cat.jpg';
// var image = $('img')[0]; // it can also be an <img> element

loadImage(image)
.then(function (img) {
	ctx.drawImage(img, 0, 0, 10, 10);
})
.catch(function () {
	console.error('Image failed to load :(');
});
```

### Multiple images

`image-promise` can load multiple images at a time

```js
var images = ['cat.jpg', 'dog.jpg'];
// var images = $('img'); // it can also be a jQuery object
// var images = document.querySelectorAll('img'); // or a NodeList

loadImage(images)
.then(function (allImgs) {
	console.log(allImgs.length, 'images loaded!', allImgs);
})
.catch(function (err) {
	console.error('One or more images have failed to load :(');
	console.error(err.errored);
	console.info('But these loaded fine:');
	console.info(err.loaded);
});
```

## Dependencies

None! But you need to polyfill `window.Promise` in IE11 and lower.

## License

MIT © [Federico Brigante](http://twitter.com/bfred_it)
