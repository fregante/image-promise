'use strict';

export default function load(src) {
	// if argument is an array, treat as
	// load(['1.jpg', '2.jpg'])
	if (src.map) {
		return Promise.all(src.map(load));
	}

	// check whether an <img> was passed as argument
	const image = src.src ? src : new Image();
	src = src.src;

	if (!load[src]) {
		load[src] = new Promise((resolve, reject) => {
			image.addEventListener('load', () => resolve(image));
			image.addEventListener('error', () => reject(image));

			if (!image.src) {
				image.src = src;
			}

			if (image.complete) {
				resolve(image);
			}
		});
		load[src].image = image;
	}
	return load[src];
}

load.unload = function (src) {
	// an <img> was passed as argument
	if (src.src) {
		src = src.src;
	}

	// if argument is an array, treat as
	// load(['1.jpg', '2.jpg'])
	if (src.map) {
		src.map(load.unload);
	} else if (load[src]) {
		// GC, http://www.fngtps.com/2010/mobile-safari-image-resource-limit-workaround/
		load[src].image.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
		delete load[src];
	}
};
