class sRGB {
	constructor(r = 0, g = 0, b = 0) {
		this.r = r;
		this.g = g;
		this.b = b;
	}

	clamp() {
		this.r = Math.max(Math.min(this.r, 1), 0);
		this.g = Math.max(Math.min(this.g, 1), 0);
		this.b = Math.max(Math.min(this.b, 1), 0);
	}

	get isInside() {
		return this.r <= 1 && this.r >= 0 && this.g <= 1 && this.g >= 0 && this.b <= 1 && this.b >= 0
	}

	copy() {
		return new sRGB(this.r, this.g, this.b);
	}

	mult(s) {
		this.r *= s;
		this.g *= s;
		this.b *= s;
	}
	add(other) {
		this.r += other.r;
		this.g += other.g;
		this.b += other.b;
	}
	sub(other) {
		this.r -= other.r;
		this.g -= other.g;
		this.b -= other.b;
	}

	static mix(rgb1, rgb2, t) {
		let out = rgb2.copy();
		out.sub(rgb1);
		out.mult(t);
		out.add(rgb1);
		return out.copy();
	}

	get CSSColor() {
		let rVal = Math.round(Math.max(Math.min(this.r, 1), 0) * 255);
		let gVal = Math.round(Math.max(Math.min(this.g, 1), 0) * 255);
		let bVal = Math.round(Math.max(Math.min(this.b, 1), 0) * 255);
		return 'rgb(' + rVal + ',' + gVal + ',' + bVal + ')';
	}

	static HexTosRGB(hex) {
		const hexStr = hex.substring(1);
		const hexInt = Number('0x' + hexStr);

		const rMask = 0xFF0000;
		const gMask = 0x00FF00;
		const bMask = 0x0000FF;

		const rVal = ((hexInt & rMask) >> 16) / 255;
		const gVal = ((hexInt & gMask) >> 8) / 255;
		const bVal = (hexInt & bMask) / 255;

		return new sRGB(rVal, gVal, bVal);
	}
}

class LinearRGB {
	constructor(r = 0, g = 0, b = 0) {
		this.r = r;
		this.g = g;
		this.b = b;
	}

	clamp() {
		this.r = Math.max(Math.min(this.r, 1), 0);
		this.g = Math.max(Math.min(this.g, 1), 0);
		this.b = Math.max(Math.min(this.b, 1), 0);
	}

	get isInside() {
		return this.r <= 1 && this.r >= 0 && this.g <= 1 && this.g >= 0 && this.b <= 1 && this.b >= 0
	}

	copy() {
		return new LinearRGB(this.r, this.g, this.b);
	}

	mult(s) {
		this.r *= s;
		this.g *= s;
		this.b *= s;
	}
	add(other) {
		this.r += other.r;
		this.g += other.g;
		this.b += other.b;
	}
	sub(other) {
		this.r -= other.r;
		this.g -= other.g;
		this.b -= other.b;
	}

	static mix(rgb1, rgb2, t) {
		let out = rgb2.copy();
		out.sub(rgb1);
		out.mult(t);
		out.add(rgb1);
		return out.copy();
	}

	get CSSColor() {
		let rVal = Math.round(Math.max(Math.min(this.r, 1), 0) * 255);
		let gVal = Math.round(Math.max(Math.min(this.g, 1), 0) * 255);
		let bVal = Math.round(Math.max(Math.min(this.b, 1), 0) * 255);
		return 'rgb(' + rVal + ',' + gVal + ',' + bVal + ')';
	}

	static HexTosRGB(hex) {
		const hexStr = hex.substring(1);
		const hexInt = Number('0x' + hexStr);

		const rMask = 0xFF0000;
		const gMask = 0x00FF00;
		const bMask = 0x0000FF;

		const rVal = ((hexInt & rMask) >> 16) / 255;
		const gVal = ((hexInt & gMask) >> 8) / 255;
		const bVal = (hexInt & bMask) / 255;

		return new LinearRGB(rVal, gVal, bVal);
	}

	static #Scalar = 387916 / 30017;
	static #ToLinearLimit = 11 / 280;
	static #TosRGBLimit = 285 / 93752;

	static #ToLinear(x) {
		return x <= this.#ToLinearLimit ?
			x / this.#Scalar :
			Math.pow((x + 0.055) / 1.055, 2.4);
	}

	static #TosRGB(x) {
		return x <= this.#TosRGBLimit ?
			x * this.#Scalar :
			(MathCustom.NRoot(x, 2.4) * 1.055) - 0.055;
	}

	static sRGBToLinear(srgb) {
		return new LinearRGB(
			this.#ToLinear(srgb.r),
			this.#ToLinear(srgb.g),
			this.#ToLinear(srgb.b)
		);
	}

	static LinearTosRGB(lrgb) {
		return new sRGB(
			this.#TosRGB(lrgb.r),
			this.#TosRGB(lrgb.g),
			this.#TosRGB(lrgb.b)
		);
	}
}

class OkLab {
	constructor(l = 0, a = 0, b = 0) {
		this.l = l;
		this.a = this.l <= 0 || this.l >= 1 ? 0 : a;
		this.b = this.l <= 0 || this.l >= 1 ? 0 : b;
	}

	mult(s) {
		this.l *= s;
		this.a *= s;
		this.b *= s;
	}

	add(otherLab) {
		this.l += otherLab.l;
		this.a += otherLab.a;
		this.b += otherLab.b;
	}

	sub(otherLab) {
		this.l -= otherLab.l;
		this.a -= otherLab.a;
		this.b -= otherLab.b;
	}

	copy() {
		return new OkLab(this.l, this.a, this.b);
	}

	get CSSColor() {
		const l = Math.max(Math.min(this.l, 1), 0);
		return 'oklab(' + MathCustom.Round(l, 4) + ', ' + MathCustom.Round(this.a, 4) + ', ' + MathCustom.Round(this.b, 4) + ')';
	}

	static mix(lab1, lab2, t) {
		let out = lab2.copy();
		out.sub(lab1);
		out.mult(t);
		out.add(lab1);

		return out.copy();
	}

	static #Scalar = 387916 / 30017;
	static #ToLinearLimit = 11 / 280;
	static #TosRGBLimit = 285 / 93752;

	static sRGBtoOKLab(srgb) {
		// to reduce floating point error
		if (srgb.r === 1 && srgb.g === 1 && srgb.b === 1) return new OkLab(1, 0, 0);
		if (srgb.r === 0 && srgb.g === 0 && srgb.b === 0) return new OkLab(0, 0, 0);

		if (srgb.r === srgb.g && srgb.r === srgb.b) {
			// if graycale - can skip some conversions

			// to Linear RGB
			let v = srgb.r <= this.#ToLinearLimit ? srgb.r / this.#Scalar : Math.pow((srgb.r + 0.055) / 1.055, 2.4);

			// to LMS - can skip "to Linear LMS" conversion
			v = Math.cbrt(v);

			// can skip "to OkLab" conversion
			return new OkLab(v, 0, 0);
		} else {
			let l1 = srgb.r;
			let a1 = srgb.g;
			let b1 = srgb.b;

			// to Linear RGB
			l1 = l1 <= this.#ToLinearLimit ? l1 / this.#Scalar : Math.pow((l1 + 0.055) / 1.055, 2.4);
			a1 = a1 <= this.#ToLinearLimit ? a1 / this.#Scalar : Math.pow((a1 + 0.055) / 1.055, 2.4);
			b1 = b1 <= this.#ToLinearLimit ? b1 / this.#Scalar : Math.pow((b1 + 0.055) / 1.055, 2.4);

			// to LMS
			let l2 = 0.412221470800 * l1 + 0.536332536300 * a1 + 0.051445992900 * b1;
			let a2 = 0.211903498234 * l1 + 0.680699545133 * a1 + 0.107396956633 * b1;
			let b2 = 0.088302461900 * l1 + 0.281718837600 * a1 + 0.629978700500 * b1;

			// to Linear LMS
			l1 = Math.cbrt(l2);
			a1 = Math.cbrt(a2);
			b1 = Math.cbrt(b2);

			// to OkLab
			l2 = 0.210454257467 * l1 + 0.793617787167 * a1 - 0.004072044634 * b1;
			a2 = 1.977998495100 * l1 - 2.428592205000 * a1 + 0.450593709900 * b1;
			b2 = 0.025904024666 * l1 + 0.782771753767 * a1 - 0.808675778433 * b1;

			return new OkLab(l2, a2, b2);
		}
	}

	static OkLabtosRGB(lab) {
		// to reduce floating point error
		if (lab.l == 1) return new sRGB(1, 1, 1);
		if (lab.l == 0) return new sRGB(0, 0, 0);

		if (lab.a === 0 && lab.b === 0) {
			// if graycale - can skip some conversions

			// to Linear LMS - can skip "to LMS" conversion
			let v = lab.l * lab.l * lab.l;

			// to sRGB - can skip "to Linear RGB" conversion
			v = v <= this.#TosRGBLimit ? this.#Scalar * v : (MathCustom.NRoot(v, 2.4) * 1.055) - 0.055;

			return new sRGB(v, v, v);
		} else {
			let r1 = lab.l;
			let g1 = lab.a;
			let b1 = lab.b

			// to Linear LMS
			let r2 = r1 + 0.396337792278 * g1 + 0.215803757471 * b1;
			let g2 = r1 - 0.105561342920 * g1 - 0.063854171399 * b1;
			let b2 = r1 - 0.089484185764 * g1 - 1.291485517099 * b1;

			// to LMS
			r1 = r2 * r2 * r2;
			g1 = g2 * g2 * g2;
			b1 = b2 * b2 * b2;

			// to Linear RGB
			r2 =  4.076741661667 * r1 - 3.307711590572 * g1 + 0.230969928905 * b1;
			g2 = -1.268438004344 * r1 + 2.609757400792 * g1 - 0.341319396448 * b1;
			b2 = -0.004196086474 * r1 - 0.703418614494 * g1 + 1.707614700968 * b1;

			// to sRGB
			r1 = r2 <= this.#TosRGBLimit ? this.#Scalar * r2 : (MathCustom.NRoot(r2, 2.4) * 1.055) - 0.055;
			g1 = g2 <= this.#TosRGBLimit ? this.#Scalar * g2 : (MathCustom.NRoot(g2, 2.4) * 1.055) - 0.055;
			b1 = b2 <= this.#TosRGBLimit ? this.#Scalar * b2 : (MathCustom.NRoot(b2, 2.4) * 1.055) - 0.055;

			return new sRGB(r1, g1, b1);
		}
	}
}

class OkLCh {
	constructor(l = 0, c = 0, h = 0) {
		this.l = l;
		this.c = this.l <= 0 || this.l >= 1 ? 0 : c;
		this.h = this.c <= 0 ? 0 : h;
	}

	static LabToLCh(lab) {
		// to reduce floating point error
		if (lab.l === 1) return new OkLCh(1, 0, 0);
		if (lab.l === 0) return new OkLCh(0, 0, 0);
		if (lab.a === 0 && lab.b === 0) return new OkLCh(lab.l, 0, 0);

		const l = lab.l;
		const c = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
		const h = MathCustom.UnsignedMod(Math.atan2(lab.b, lab.a), MathCustom.TAU);
		return new OkLCh(l, c, h);
	}

	static sRGBToOkLCh(srgb) {
		return OkLCh.LabToLCh(OkLab.sRGBtoOKLab(srgb));
	}

	static LChToLab(lch) {
		// to reduce floating point error
		if (lch.l === 1) return new OkLab(1, 0, 0);
		if (lch.l === 0) return new OkLab(0, 0, 0);
		if (lch.c === 0) return new OkLab(lch.l, 0, 0);

		const l = lch.l;
		const a = lch.c * Math.cos(lch.h);
		const b = lch.c * Math.sin(lch.h);
		return new OkLab(l, a, b);
	}

	static OkLChTosRGB(lch) {
		return OkLab.OkLabtosRGB(OkLCh.LChToLab(lch));
	}

	copy() {
		return new OkLCh(this.l, this.c, this.h);
	}

	get isInside() {
		return (OkLCh.OkLChTosRGB(this)).isInside;
	}

	get CSSColor() {
		const l = Math.max(Math.min(this.l, 1), 0);
		const h = this.h * MathCustom.RadToDeg;
		return 'oklch(' + MathCustom.Round(l, 4) + ', ' + MathCustom.Round(this.c, 4) + ', ' + MathCustom.Round(h, 4) + ')';
	}

	rgbClamp() {
		let rgb = OkLCh.OkLChTosRGB(this);
		rgb.clamp();
		let newLCh = OkLCh.sRGBToOkLCh(rgb);
		this.l = newLCh.l;
		this.c = newLCh.c;
		this.h = newLCh.h;
	}

	fallback(maxIterations = 5) {
		let iter = 0;
		let ogL = this.l;
		while (iter < maxIterations) {
			this.rgbClamp();

			this.l = ogL;

			iter++;

			if (this.isInside) break;
		}
	}
}