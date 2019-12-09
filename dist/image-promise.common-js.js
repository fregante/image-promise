"use strict";
function isArrayLike(input) {
    return input.length !== undefined;
}
function loadSingleImage(image) {
    var promise = new Promise(function (resolve, reject) {
        if (image.naturalWidth) {
            // If the browser can determine the naturalWidth the image is already loaded successfully
            resolve(image);
        }
        else if (image.complete) {
            // If the image is complete but the naturalWidth is 0px it is probably broken
            reject(image);
        }
        else {
            image.addEventListener('load', fulfill);
            image.addEventListener('error', fulfill);
        }
        function fulfill() {
            if (image.naturalWidth) {
                resolve(image);
            }
            else {
                reject(image);
            }
            image.removeEventListener('load', fulfill);
            image.removeEventListener('error', fulfill);
        }
    });
    return Object.assign(promise, { image: image });
}
function loadImages(input, attributes) {
    if (attributes === void 0) { attributes = {}; }
    if (input instanceof HTMLImageElement) {
        return loadSingleImage(input);
    }
    if (typeof input === 'string') {
        /* Create a <img> from a string */
        var src = input;
        var image_1 = new Image();
        Object.keys(attributes).forEach(function (name) { return image_1.setAttribute(name, attributes[name]); });
        image_1.src = src;
        return loadSingleImage(image_1);
    }
    if (isArrayLike(input)) {
        // Momentarily ignore errors
        var reflect = function (img) { return loadImages(img, attributes).catch(function (error) { return error; }); };
        var reflected = [].map.call(input, reflect);
        var tsFix_1 = Promise.all(reflected).then(function (results) {
            var loaded = results.filter(function (x) { return x.naturalWidth; });
            if (loaded.length === results.length) {
                return loaded;
            }
            return Promise.reject({
                loaded: loaded,
                errored: results.filter(function (x) { return !x.naturalWidth; })
            });
        });
        // Variables named `tsFix` are only here because TypeScript hates Promise-returning functions.
        return tsFix_1;
    }
    var tsFix = Promise.reject(new TypeError('input is not an image, a URL string, or an array of them.'));
    return tsFix;
}
module.exports = loadImages;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = loadImages;
//# sourceMappingURL=index.js.map
