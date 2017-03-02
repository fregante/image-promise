function reflect(promise) {
	return promise.then(
		img => ({img, load: true}),
		img => ({img, load: false})
	);
}
export default function load(image) {
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
		return Promise.all([].map.call(image, load).map(reflect))
		.then(results => {
			const loaded = results.filter(x => x.load).map(x => x.img);
			const errored = results.filter(x => !x.load).map(x => x.img);
			if (errored.length > 0) {
				const error = new Error('Some images failed loading');
				error.loaded = loaded;
				error.errored = errored;
				throw error;
			}
			return loaded;
		});
	} else if (image.tagName !== 'IMG') {
		// If it's not an <img> tag, reject
		return Promise.reject();
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
