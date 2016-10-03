function trackLoading(image, src) {
	if (src) {
		image.src = src;
	}
	const promise = new Promise((resolve, reject) => {
		if (image.complete) {
			resolve(image);
		} else {
			image.addEventListener('load', () => resolve(image));
			image.addEventListener('error', () => reject(image));
		}
	});
	promise.image = image;
	return promise;
}

export default function load(image) {
	// if argument is an array, treat as
	// load(['1.jpg', '2.jpg'])
	if (image.map) {
		return Promise.all(image.map(load));
	}

	// if image is just a <img>, don't cache it
	if (image.src) {
		return trackLoading(image);
	}

	// load is treated as a map, assumes all image paths don't clash with Function.prototype
	if (!load[image]) {
		load[image] = trackLoading(new Image(), image);
	}
	return load[image];
}

load.unload = function (image) {
	if (!image.src) {
		// an <img> was passed as argument, so nothing to unload
		return;
	}

	// if argument is an array, treat as
	// load(['1.jpg', '2.jpg'])
	if (image.map) {
		image.map(load.unload);
	} else if (load[image]) {
		// GC, http://www.fngtps.com/2010/mobile-safari-image-resource-limit-workaround/
		load[image].image.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
		delete load[image];
	}
};
