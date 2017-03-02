export default function load(image, opts) {
	if (!image) {
		return Promise.reject();
	} else if (typeof image === 'string') {
		// If image is a string, "convert" it to an <img>
		const src = image;
		image = new Image();
		image.src = src;
	} else if (image.length !== undefined) {
		// If image is Array-like, treat as
		// load(['1.jpg', '2.jpg'])
		return Promise.all([].map.call(image, image => load(image, opts)));
	} else if (image.tagName !== 'IMG') {
		// If it's not an <img> tag, reject
		return Promise.reject();
	}

	const promise = new Promise((resolve, reject) => {
		if (opts && opts.ignoreErrors) {
			reject = resolve;
		}
		if (image.naturalWidth) { // Truthy if loaded successfully
			resolve(image);
		} else if (image.complete) { // True if failed, at this point
			reject(image);
		} else {
			image.addEventListener('load', fullfill);
			image.addEventListener('error', fullfill);
		}
		function fullfill() {
			if (image.naturalWidth) {
				resolve(image);
			} else {
				reject(image);
			}
			image.removeEventListener('load', fullfill);
			image.removeEventListener('error', fullfill);
		}
	});
	promise.image = image;
	return promise;
}
