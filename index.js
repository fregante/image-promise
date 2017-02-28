export default function load(image) {
	if (!image) {
		return Promise.reject(image);
	} else if (typeof image === 'string') {
		// If image is a string, "convert" it to an <img>
		const src = image;
		image = new Image();
		image.src = src;
	} else if (image.length !== undefined) {
		// If image is Array-like, treat as
		// load(['1.jpg', '2.jpg'])
		return Promise.all([].map.call(image, load));
	} else if (image.tagName !== 'IMG') {
		// If it's not an <img> tag, reject
		return Promise.reject(image);
	}

	const promise = new Promise((resolve, reject) => {
		if (image.naturalWidth) { // Truthy if loaded successfully
			resolve(image);
		} else if (image.complete) { // True if failed, at this point
			reject(image);
		} else {
			image.addEventListener('load', fullfill);
			image.addEventListener('error', fullfill);
		}
		function fullfill(e) {
			image.removeEventListener('load', fullfill);
			image.removeEventListener('error', fullfill);
			if (e.type === 'load') {
				resolve(image);
			} else {
				reject(image);
			}
		}
	});
	promise.image = image;
	return promise;
}
