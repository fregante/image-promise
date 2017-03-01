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
      loadImage()
        .then(() => done())
        .catch(() => done('failed'));
    }, function (result) {
      assert.strictEqual(result, 'failed');
    }),

    'loadImage(string)': runTest(function test(done) {
      loadImage('logo.png')
        .then((img) => done(img.naturalWidth))
        .catch(() => done('failed'));
    }, function (result) {
      assert.strictEqual(result, 512);
    }),

    'loadImage([string])': runTest(function test(done) {
      loadImage(['logo.png', 'logo2.png'])
        .then((imgs) => done(imgs.length))
        .catch(() => done('failed'));
    }, function (result) {
      assert.strictEqual(result, 2);
    }),

    'loadImage(img)': runTest(function test(done) {
      var div = document.createElement('div');
      div.innerHTML = "<img src='logo.png'>";
      document.body.appendChild(div);
      var img = document.body.querySelector('img');
      loadImage(img)
        .then((img) => done(img.naturalWidth))
        .catch(() => done('failed'));
    }, function (result) {
      assert.strictEqual(result, 512);
    }),

    'loadImage([NodeList])': runTest(function test(done) {
      var div = document.createElement('div');
      div.innerHTML = "<img src='logo.png'><img src='logo2.png'>";
      document.body.appendChild(div);
      var img = document.body.querySelectorAll('img');
      loadImage(img)
        .then((imgs) => done(imgs.length))
        .catch(() => done('failed'));
    }, function (result) {
      assert.strictEqual(result, 2);
    }),


  });
});
