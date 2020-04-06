# image-promise [![][badge-gzip]](#link-npm)

  [badge-gzip]: https://img.shields.io/bundlephobia/minzip/image-promise.svg?label=gzipped
  [link-npm]: https://www.npmjs.com/package/image-promise

> Load one or more images, return a promise. Only 0.5KB, for the browser, no dependencies.

It can be used in two ways:

- pass a URL: it will generate an `<img>` and wait for it to load:

	```js
	loadImage('img.jpg').then(/* It's loaded! */)
	```

- pass an `<img>`: it will wait for it to load:

	```js
	const img = document.querySelector('img.my-image');
	loadImage(img).then(/* It's loaded! */)
	```

- pass an array of URLs and/or `<img>`s, wait for them to load:

	```js
	const img = document.querySelector('img.my-image');
	loadImage([img, 'loading.gif']).then(/* Both are loaded! */)
	```

## Install

You can just download the [standalone bundle](https://packd.fregante.now.sh/image-promise@latest?name=loadImage) (it might take a minute to download)

Or use `npm`:

```sh
npm install image-promise
```

```js
// This module is only offered as a ES Module
import loadImage from 'image-promise';
```

## Usage

### One image

`loadImage(image)` will return a Promise that resolves when the image load, or fails when the image

```js
const image = 'cat.jpg';
// const image = $('img')[0]; // it can also be an <img> element

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
const images = ['cat.jpg', 'dog.jpg'];
// const images = $('img'); // it can also be a jQuery object
// const images = document.querySelectorAll('img'); // or a NodeList

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

### Set custom attributes

`loadImage(image, attributes)` lets you pass as the second argument an object of attributes you want to assign to the image element before it starts loading.

This is useful for example when you need [CORS enabled image](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image), where you need to set the attribute `crossorigin="anonymous"` before the image starts downloading.

```js
const image = 'https://catpics.com/cat.jpg';

loadImage(image, { crossorigin: 'anonymous' })
.then(function (img) {
	ctx.drawImage(img, 0, 0, 10, 10);

	// now you can do this
	canvas.toDataURL('image/png')
})
.catch(function () {
	console.error('Image failed to load :(');
});
```

## Dependencies

None! But you need to polyfill `window.Promise` in IE11 and lower.

## License

MIT © [Federico Brigante](https://bfred.it)
