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
	if (typeof image !== 'string' && image.length !== undefined) {
		return Promise.all([].map.call(image, load));
	}

	// if image is just a <img>, don't cache it
	if (image.src) {
		return trackLoading(image);
	}

	return trackLoading(new Image(), image);
}
