function trackLoading(image) {
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
	if (typeof image === 'string') {
		// If image is a string, "convert" it to an <img>
		const src = image;
		image = new Image();
		image.src = src;
	} else if (image.length !== undefined) {
		// If image is Array-like, treat as
		// load(['1.jpg', '2.jpg'])
		return Promise.all([].map.call(image, load));
	}

	return trackLoading(image);
}
