define(function (require) {
	var registerSuite = require('intern!object');
	var assert = require('intern/chai!assert');

	function runTest(tester, asserter) {
		return function () {
			return this.remote
						.get(require.toUrl('tests/helper/index.html'))
						.setFindTimeout(5000)
						.setExecuteAsyncTimeout(5000)
						.findByCssSelector('body.loaded')
						.executeAsync(tester)
						.then(asserter);
		};
	}

	registerSuite({
		name: 'index',

		'loadImage()': runTest(function test(done) {
			loadImage().then(function () {
				return done();
			}).catch(function () {
				return done('failed');
			});
		}, function (result) {
			assert.strictEqual(result, 'failed', 'receiving undefined should reject the promisse');
		}),

		'loadImage(1)': runTest(function test(done) {
			loadImage().then(function () {
				return done();
			}).catch(function () {
				return done('failed');
			});
		}, function (result) {
			assert.strictEqual(result, 'failed', 'receiving a number should reject the promisse');
		}),

		'loadImage(false)': runTest(function test(done) {
			loadImage().then(function () {
				return done();
			}).catch(function () {
				return done('failed');
			});
		}, function (result) {
			assert.strictEqual(result, 'failed', 'receiving a boolean should reject the promisse');
		}),

		'loadImage(DivElement)': runTest(function test(done) {
			loadImage(document.createElement('div')).then(function () {
				return done();
			}).catch(function () {
				return done('failed');
			});
		}, function (result) {
			assert.strictEqual(result, 'failed', 'receiving a invalid HTMLElement should reject the promisse');
		}),

		'loadImage(string)': runTest(function test(done) {
			loadImage('logo.png').then(function (img) {
				return done(img.naturalWidth);
			}).catch(function () {
				return done('failed');
			});
		}, function (result) {
			assert.strictEqual(result, 512, 'an image url should resolve with the loaded image');
		}),

		'loadImage(string[]])': runTest(function test(done) {
			loadImage(['logo.png', 'logo2.png']).then(function (imgs) {
				return done(imgs.length);
			}).catch(function () {
				return done('failed');
			});
		}, function (result) {
			assert.strictEqual(result, 2, 'an url array of two images should resolve two images');
		}),

		'loadImage(img)': runTest(function test(done) {
			var div = document.createElement('div');
			div.innerHTML = "<img src='logo.png'>";
			document.body.appendChild(div);
			var img = document.body.querySelector('img');
			loadImage(img).then(function (img) {
				return done(img.naturalWidth);
			}).catch(function () {
				return done('failed');
			});
		}, function (result) {
			assert.strictEqual(result, 512, 'an image should resolve with the loaded image');
		}),

		'loadImage(img[])': runTest(function test(done) {
			var div = document.createElement('div');
			div.innerHTML = "<img src='logo.png'><img src='logo2.png'>";
			document.body.appendChild(div);
			var img = Array.prototype.slice.call(document.body.querySelectorAll('img'));
			loadImage(img).then(function (imgs) {
				return done(imgs.length);
			}).catch(function () {
				return done('failed');
			});
		}, function (result) {
			assert.strictEqual(result, 2, 'an image array of two images should resolve two images');
		}),

		'loadImage(NodeList)': runTest(function test(done) {
			var div = document.createElement('div');
			div.innerHTML = "<img src='logo.png'><img src='logo2.png'>";
			document.body.appendChild(div);
			var img = document.body.querySelectorAll('img');
			loadImage(img).then(function (imgs) {
				return done(imgs.length);
			}).catch(function () {
				return done('failed');
			});
		}, function (result) {
			assert.strictEqual(result, 2, 'a node list of two images should resolve two images');
		}),

		'loadImage([])': runTest(function test(done) {
			loadImage([]).then(function (imgs) {
				return done(imgs.length);
			}).catch(function () {
				return done('failed');
			});
		}, function (result) {
			assert.strictEqual(result, 0, 'an empty array should succeed with 0 loaded images');
		}),

		'loadImage(broken img)': runTest(function test(done) {
			var div = document.createElement('div');
			div.innerHTML = "<img src='404.png'>";
			document.body.appendChild(div);
			var img = Array.prototype.slice.call(document.body.querySelectorAll('img'));
			loadImage(img).then(function (imgs) {
				return done();
			}).catch(function (err) {
				return done(err);
			});
		}, function (result) {
			assert.deepEqual(Object.keys(result), ['loaded', 'errored'], 'Errors should return all loaded and failed images');
			assert.equal(result.loaded.length, 0, 'a broken image should return 0 success results');
			assert.equal(result.errored.length, 1, 'a broken image should return 1 error result');
		}),

		'loadImage(mixed NodeList)': runTest(function test(done) {
			var div = document.createElement('div');
			div.innerHTML = "<img src='logo.png'><img src='404.png'>";
			document.body.appendChild(div);
			var img = document.body.querySelectorAll('img');
			loadImage(img).then(function (imgs) {
				return done();
			}).catch(function (err) {
				return done(err);
			});
		}, function (result) {
			assert.deepEqual(Object.keys(result), ['loaded', 'errored'], 'Errors should return all loaded and failed images');
			assert.equal(result.loaded.length, 1, 'a broken image should return 0 success results');
			assert.equal(result.errored.length, 1, 'a broken image should return 1 error result');
		}),

		'loadPreCachedImages(mixed NodeList)': runTest(function test(done) {
			var div = document.createElement('div');
			div.innerHTML = "<img src='logo.png'><img src='404.png'>";
			document.body.appendChild(div);
			var img = document.body.querySelectorAll('img');
			loadImage(img)
				.catch(function() {})
				.then(function() {
					// Second (cached) load
					loadImage(img).then(function (imgs) {
						return done();
					}).catch(function (err) {
						return done(err);
					});
				});
		}, function (result) {
			assert.deepEqual(Object.keys(result), ['loaded', 'errored'], 'Errors should return all loaded and failed images');
			assert.equal(result.loaded.length, 1, 'a broken image should return 0 success results');
			assert.equal(result.errored.length, 1, 'a broken image should return 1 error result');
		})

	});

});
