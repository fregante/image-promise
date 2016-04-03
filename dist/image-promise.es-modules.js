// let images = ['a.jpg','b.jpg'];
// Promise.all(images.map(loadImage))

var EMPTY_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
var loaded = {};

function load(src) {
	if (!loaded[src]) {
		(function () {
			var image = new Image();
			loaded[src] = new Promise(function (resolve, reject) {
				image.addEventListener('load', function () {
					resolve(image);
				});
				image.addEventListener('error', reject);
				image.src = src;

				if (image.complete) {
					setTimeout(resolve, 0, image);
				}
			});
			loaded[src].image = image;
		})();
	}
	return loaded[src];
}

function unload(src) {
	if (loaded[src]) {
		return loaded[src].then(function (image) {
			// GC, http://www.fngtps.com/2010/mobile-safari-image-resource-limit-workaround/
			image.src = EMPTY_IMAGE;
			delete loaded[src];
		});
	}
}
// rollup browserify compat
// https://github.com/rollup/rollup/issues/496
if (typeof module !== 'undefined') {
	module.exports = load;
}

export { unload };export default load;