export default function load(image, ignoreBroken) {
	if (typeof image === 'string') {
		// If image is a string, "convert" it to an <img>
		const src = image;
		image = new Image();
		image.src = src;
	} else if (image && image.length !== undefined) {
		// Handle Arrays or a NodeLists and jQuery elements
		// load(['1.jpg', '2.jpg'])
		// load(document.querySelectorAll('img'))
		// load($('img'))
		return Promise.all([].map.call(image, ignoreBroken ? load : waitFor));
	} else if (!image || image.tagName !== 'IMG') {
		// If it's not an <img> tag, reject
		return Promise.reject();
	}

	const promise = new Promise((resolve, reject) => {
		if (ignoreBroken) {
			reject = resolve;
		}
		if (image.naturalWidth) {
			// If the browser can determine the naturalWidth the
			// image is already loaded
			return resolve(image);
		}
		if (image.complete) {
			// If the image is complete but the naturalWidth is 0px
			// it is probably broken
			return reject(image);
		}

		image.addEventListener('load', fullfill);
		image.addEventListener('error', fullfill);

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

function waitFor(image) {
	return load(image, true);
}
