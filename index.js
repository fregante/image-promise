'use strict';

const EMPTY_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
const loaded = {};

function load(src) {
	// if first argument is an array, treat as
	// load(['1.jpg', '2.jpg'])
	if (Array.isArray(src)) {
		return Promise.all(src.map(load));
	}

	const image = new Image(); // putting this outside the condition avoids an IIFE in babel
	if (!loaded[src]) {
		loaded[src] = new Promise((resolve, reject) => {
			image.addEventListener('load', resolve.bind(null, image));
			image.addEventListener('error', reject.bind(null, image));
			image.src = src;

			if (image.complete) {
				resolve(image);
			}
		});
		loaded[src].image = image;
	}
	return loaded[src];
}

load.unload = function (src) {
	if (loaded[src]) {
		return loaded[src].catch(() => {}).then(image => {
			// GC, http://www.fngtps.com/2010/mobile-safari-image-resource-limit-workaround/
			image.src = EMPTY_IMAGE;
			delete loaded[src];
		});
	}
	return Promise.resolve();
};

export default load;
