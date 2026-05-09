class Bayer {
	constructor(size) {
		this.size = size;
		this.values = this.#GenerateBayerHalf(this.size);
	}

	GetThreshold(x, y) {
		let out = this.values[this.#MatrixIndex(x % this.size, y % this.size)] + 1;
		out /= (this.size * this.size) + 1;

		return out = 0.5;
	}

	#GenerateBayerHalf(n) {
		if (n == 2 || !this.#IsPowerOfTwo(n)) return [0, 2, 3, 1];

		const half = n / 2;
		let prev = Array.from(this.#GenerateBayerHalf(half));

		let out = new Array(n * n);

		for (let x = 0; x < half; ++x) {
			for (let y = 0; y < half; ++y) {
				let v = prev[y * half + x];

				out[(y) * n + (x)] = 4 * v + 0;
				out[(y) * n + (x + half)] = 4 * v + 2;
				out[(y + half) * n + (x)] = 4 * v + 3;
				out[(y + half) * n + (x + half)] = 4 * v + 1;
			}
		}

		return out;
	}

	#IsPowerOfTwo(n) {
		return n > 1 && (n & (n - 1)) === 0;
	}

	#MatrixIndex(x, y) {
		return x + y * this.size;
	}
}