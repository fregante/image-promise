type Input = string | HTMLImageElement;
type Attributes = Record<string, string>;

type Result<Image = HTMLImageElement> = Readonly<{
	image: Image;
	loaded: () => Promise<Image>;
	metadata: () => Promise<Image>;
}> ;

function setAttributes(image: HTMLImageElement, attributes: Attributes): void {
	for (const [attribute, value] of Object.entries(attributes)) {
		image.setAttribute(attribute, value);
	}
}

function lazyPromise<Image = HTMLImageElement>(function_: () => Promise<Image>): () => Promise<Image> {
	let promise: Promise<Image> | undefined;
	return () => {
		promise ??= function_();

		return promise;
	};
}

function load(image: HTMLImageElement): Result {
	const result = {
		image,
		loaded: lazyPromise(async () => {
			await image.decode();
			return image;
		}),
		metadata: lazyPromise(async () => new Promise<HTMLImageElement>((resolve, reject) => {
			const check = () => {
				if (image.naturalWidth) {
					resolve(image);
					clearInterval(interval);
					return true;
				}

				if (image.complete) {
					// If the image is complete but the naturalWidth is 0px it's probably broken
					reject(new Error('Unable to load image metadata'));
					clearInterval(interval);
					return true;
				}

				return false;
			};

			if (check()) {
				return;
			}

			const interval = setInterval(check, 100);

			result.loaded().then(resolve, reject);
		})),
	};

	return Object.freeze(result);
}

export function loadImage(input: Input, attributes: Attributes = {}): Result {
	if (typeof input === 'string') {
		// Create a <img> from a string
		const image = new Image();
		// Set attributes before `src`
		setAttributes(image, attributes);

		image.src = input;
		return load(image);
	}

	if (input instanceof HTMLImageElement) {
		setAttributes(input, attributes);
		return load(input);
	}

	throw new TypeError('Expected image or string, got ' + typeof input);
}

export function loadImages(inputs: Input[], attributes: Attributes = {}): Readonly<{
	results: Result[];
	loaded: () => Promise<HTMLImageElement[]>;
	metadata: () => Promise<HTMLImageElement[]>;
}> {
	if (Array.isArray(inputs)) {
		const results = inputs.map(input => loadImage(input, attributes));
		return Object.freeze({
			results,
			loaded: lazyPromise(async () => Promise.all(results.map(result => result.loaded()))),
			metadata: lazyPromise(async () => Promise.all(results.map(result => result.metadata()))),
		});
	}

	throw new TypeError('Expected array; got ' + typeof inputs);
}
