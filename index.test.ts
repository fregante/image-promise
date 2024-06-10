import {test, assert} from 'vitest';
import {loadImage, loadImages} from './index.js';

declare global {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/naming-convention -- Must extend it
	interface HTMLImageElement {
		_loadMetadata(): void;
		_load(): void;
	}
}

// @ts-expect-error Just a fake class for testing
globalThis.Image = class Image {
	#src = '';
	#complete = false;
	#naturalWidth = 0;
	#naturalHeight = 0;

	_loadMetadata() {
		this.#naturalWidth = 16;
		this.#naturalHeight = 16;
	}

	_load() {
		this.#complete = true;
	}

	get src() {
		return this.#src;
	}

	set src(value) {
		this.#src = value;
	}

	get complete() {
		return this.#complete;
	}

	set complete(value) {
		this.#complete = value;
	}

	get naturalWidth() {
		return this.#naturalWidth;
	}

	set naturalWidth(value) {
		this.#naturalWidth = value;
	}

	get naturalHeight() {
		return this.#naturalHeight;
	}

	set naturalHeight(value) {
		this.#naturalHeight = value;
	}

	decode() {
		return new Promise<void>(resolve => {
			setInterval(() => {
				if (this.#complete) {
					resolve();
				}
			}, 5);
		});
	}
};

const source = 'https://avatars.githubusercontent.com/u/1402241?s=96&v=4';
const source2 = 'https://avatars.githubusercontent.com/u/1402241';

test('loadImage', async () => {
	const info = loadImage(source);

	assert.equal(info.image.src, source);
	assert.isFalse(info.image.complete);

	info.image._loadMetadata();
	await info.metadata();

	assert.isFalse(info.image.complete);
	assert.equal(info.image.naturalWidth, 16);
	assert.equal(info.image.naturalHeight, 16);

	info.image._load();
	assert.equal(await info.loaded(), info.image);

	assert.isTrue(info.image.complete);
});

test('loadImages', async () => {
	const images = loadImages([source, source2]);

	console.log(images);

	assert.equal(images.results[0].image.src, source);
	assert.equal(images.results[1].image.src, source2);

	for (const info of images.results) {
		assert.isFalse(info.image.complete);
		info.image._loadMetadata();
	}

	await images.metadata();

	for (const info of images.results) {
		assert.isFalse(info.image.complete);
		assert.equal(info.image.naturalWidth, 16);
		assert.equal(info.image.naturalHeight, 16);
	}

	for (const info of images.results) {
		info.image._load();
	}

	await images.loaded();

	for (const info of images.results) {
		assert.isTrue(info.image.complete);
	}
});
