'use strict';

// let images = ['a.jpg','b.jpg'];
// Promise.all(images.map(loadImage))

const EMPTY_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
const loaded = {};

function load(src) {
	if (!loaded[src]) {
		const image = new Image();
		loaded[src] = new Promise((resolve, reject) => {
			image.addEventListener('load', () => {
				resolve(image);
			});
			image.addEventListener('error', reject);
			image.src = src;

			if (image.complete) {
				setTimeout(resolve, 0, image);
			}
		});
		loaded[src].image = image;
	}
	return loaded[src];
}

load.unload = function (src) {
	if (loaded[src]) {
		loaded[src].then(image => {
			// GC, http://www.fngtps.com/2010/mobile-safari-image-resource-limit-workaround/
			image.src = EMPTY_IMAGE;
			delete loaded[src];
		});
	}
	return Promise.resolve();
};

export default load;
