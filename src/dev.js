const devTools = {
	scalingMethod: function (hex1 = '#0000ff', hex2 = '#ffff00', count = 1609, method = OkLCh.HueMethod.Shorter, consoleLog = true) {
		const col1_sRGB = sRGB.HexTosRGB(hex1);
		const col2_sRGB = sRGB.HexTosRGB(hex2);

		const col1_OkLCh = OkLCh.sRGBToOkLCh(col1_sRGB);
		const col2_OkLCh = OkLCh.sRGBToOkLCh(col2_sRGB);

		let minScale = 1;

		for (let i = 0; i < Math.ceil(count); ++i) {
			const t = i / (Math.ceil(count) - 1);
			const expectedC = (col2_OkLCh.c - col1_OkLCh.c) * t + col1_OkLCh.c;
			if (expectedC <= 0) continue;

			const col_OkLCh = OkLCh.HueInterpolate(col1_OkLCh, col2_OkLCh, t, method);
			const actualC = col_OkLCh.c;

			const currentScale = actualC / expectedC;

			if (currentScale < minScale) minScale = currentScale;
		}

		let newCol1_OkLCh = col1_OkLCh.copy();
		let newCol2_OkLCh = col2_OkLCh.copy();

		newCol1_OkLCh.c *= minScale;
		newCol2_OkLCh.c *= minScale;

		const newCol1_sRGB = OkLCh.OkLChTosRGB(newCol1_OkLCh);
		const newCol2_sRGB = OkLCh.OkLChTosRGB(newCol2_OkLCh);

		if (consoleLog) {
			console.log('Old', col1_OkLCh.CSSColor, col2_OkLCh.CSSColor);
			console.log('New', newCol1_OkLCh.CSSColor, newCol2_OkLCh.CSSColor);
			console.log(newCol1_sRGB.CSSColor, newCol2_sRGB.CSSColor);
			console.log(sRGB.sRGBToHex(newCol1_sRGB), sRGB.sRGBToHex(newCol2_sRGB));
		}

		return minScale;
	},

	scalingMethodBothWays: function (hex1 = '#0000ff', hex2 = '#ffff00', count = 1609, method = OkLCh.HueMethod.Shorter) {
		let method1 = method;
		let method2 = method;
		if (method === OkLCh.HueMethod.Longer || method === OkLCh.HueMethod.Shorter) {
			method1 = OkLCh.HueMethod.Longer;
			method2 = OkLCh.HueMethod.Shorter;
		} else {
			method1 = OkLCh.HueMethod.Increasing;
			method2 = OkLCh.HueMethod.Decreasing;
		}

		const col1_sRGB = sRGB.HexTosRGB(hex1);
		const col2_sRGB = sRGB.HexTosRGB(hex2);

		const col1_OkLCh = OkLCh.sRGBToOkLCh(col1_sRGB);
		const col2_OkLCh = OkLCh.sRGBToOkLCh(col2_sRGB);

		let currentScale = devTools.scalingMethod(hex1, hex2, Math.ceil(count / 2), method1, false);
		let minScale = currentScale;

		currentScale = devTools.scalingMethod(hex1, hex2, Math.ceil(count / 2), method2, false);
		minScale = currentScale < minScale ? currentScale : minScale;

		let newCol1_OkLCh = col1_OkLCh.copy();
		let newCol2_OkLCh = col2_OkLCh.copy();

		newCol1_OkLCh.c *= minScale;
		newCol2_OkLCh.c *= minScale;

		const newCol1_sRGB = OkLCh.OkLChTosRGB(newCol1_OkLCh);
		const newCol2_sRGB = OkLCh.OkLChTosRGB(newCol2_OkLCh);

		console.log('Old', col1_OkLCh.CSSColor, col2_OkLCh.CSSColor);
		console.log('New', newCol1_OkLCh.CSSColor, newCol2_OkLCh.CSSColor);
		console.log(newCol1_sRGB.CSSColor, newCol2_sRGB.CSSColor);
		console.log(sRGB.sRGBToHex(newCol1_sRGB), sRGB.sRGBToHex(newCol2_sRGB));
		console.log(newCol1_OkLCh, newCol2_OkLCh);
	},

	scalingMethodHue: function (hue1 = 0, hue2 = Math.PI, count = 1609, method = OkLCh.HueMethod.Shorter) {
		let method1 = method;
		let method2 = method;
		if (method === OkLCh.HueMethod.Longer || method === OkLCh.HueMethod.Shorter) {
			method1 = OkLCh.HueMethod.Longer;
			method2 = OkLCh.HueMethod.Shorter;
		} else {
			method1 = OkLCh.HueMethod.Increasing;
			method2 = OkLCh.HueMethod.Decreasing;
		}

		const col1_OkLCh = devTools.highestChroma(hue1);
		const col2_OkLCh = devTools.highestChroma(hue2);

		let minScale = 1;

		for (let i = 0; i < Math.floor(count); ++i) {
			const t = i / (Math.floor(count) - 1);
			const expectedC = (col2_OkLCh.c - col1_OkLCh.c) * t + col1_OkLCh.c;
			if (expectedC <= 0) continue;

			const col_OkLCh = OkLCh.HueInterpolate(col1_OkLCh, col2_OkLCh, t, method1);
			const actualC = col_OkLCh.c;

			const currentScale = actualC / expectedC;

			if (currentScale < minScale) minScale = currentScale;
		}

		for (let i = 0; i < Math.floor(count); ++i) {
			const t = i / (Math.floor(count) - 1);
			const expectedC = (col2_OkLCh.c - col1_OkLCh.c) * t + col1_OkLCh.c;
			if (expectedC <= 0) continue;

			const col_OkLCh = OkLCh.HueInterpolate(col1_OkLCh, col2_OkLCh, t, method2);
			const actualC = col_OkLCh.c;

			const currentScale = actualC / expectedC;

			if (currentScale < minScale) minScale = currentScale;
		}

		let newCol1_OkLCh = col1_OkLCh.copy();
		let newCol2_OkLCh = col2_OkLCh.copy();

		newCol1_OkLCh.c *= minScale;
		newCol2_OkLCh.c *= minScale;

		const newCol1_sRGB = OkLCh.OkLChTosRGB(newCol1_OkLCh);
		const newCol2_sRGB = OkLCh.OkLChTosRGB(newCol2_OkLCh);

		console.log('Old', col1_OkLCh.CSSColor, col2_OkLCh.CSSColor);
		console.log('New', newCol1_OkLCh.CSSColor, newCol2_OkLCh.CSSColor);
		console.log(newCol1_sRGB.CSSColor, newCol2_sRGB.CSSColor);
		console.log(sRGB.sRGBToHex(newCol1_sRGB), sRGB.sRGBToHex(newCol2_sRGB));
		console.log(newCol1_OkLCh, newCol2_OkLCh);
	},

	scalingArray: function (hexArr, count = 1609, method = OkLCh.HueMethod.Shorter, loop = true) {
		const col_sRGB = [];
		const col_OkLCh = [];

		for (let i = 0; i < hexArr.length; ++i) {
			col_sRGB.push(sRGB.HexTosRGB(hexArr[i]));
			col_OkLCh.push(OkLCh.sRGBToOkLCh(col_sRGB[i]));
		}

		console.log(col_sRGB);
		console.log(col_OkLCh);

		const perCount = Math.ceil(count / (loop ? hexArr.length : hexArr.length - 1));
		let minScale = 1;
		for (let i = 0; i < (loop ? hexArr.length : hexArr.length - 1); ++i) {
			const col1_i = i;
			const col2_i = (i + 1) % hexArr.length;

			const currentScale = devTools.scalingMethod(hexArr[col1_i], hexArr[col2_i], perCount, method, false);
			minScale = currentScale < minScale ? currentScale : minScale;
		}

		console.log('minScale', minScale);

		const new_OkLCh = [];
		const new_sRGB = [];

		let new_OkLCh_css = '';
		let new_sRGB_css = '';
		let new_Hex_css = '';
		for (let i = 0; i < hexArr.length; ++i) {
			new_OkLCh.push(col_OkLCh[i].copy());
			new_OkLCh[i].c *= minScale;

			new_sRGB.push(OkLCh.OkLChTosRGB(new_OkLCh[i]));

			new_OkLCh_css += `${new_OkLCh[i].CSSColor} `;
			new_sRGB_css += `${new_sRGB[i].CSSColor} `;
			new_Hex_css += `${sRGB.sRGBToHex(new_sRGB[i])} `;
		}

		console.log('New OkLCh', new_OkLCh);
		console.log('New sRGB', new_sRGB);

		console.log(new_OkLCh_css);
		console.log(new_sRGB_css);
		console.log(new_Hex_css);
	},

	manual: function (hex1 = '#0000ff', hex2 = '#ffff00', startC = 1) {

		// For creating a full circle that fits inside gamut without using fallback

		const c = startC;
		let col1 = OkLCh.sRGBToOkLCh(sRGB.HexTosRGB(hex1));
		let col2 = OkLCh.sRGBToOkLCh(sRGB.HexTosRGB(hex2));

		// col1.l = 2 / 3;
		// col2.l = 2 / 3;

		col1.c = c;
		col2.c = c;

		// col1.h = 0;
		// col2.h = 0;

		col1.fallback();
		col2.fallback();

		const col1RGB = OkLCh.OkLChTosRGB(col1);
		const col2RGB = OkLCh.OkLChTosRGB(col2);

		console.log(col1RGB.CSSColor, col2RGB.CSSColor);
		console.log(sRGB.sRGBToHex(col1RGB), sRGB.sRGBToHex(col2RGB));
	},

	highestChroma: function (hue = 0, iterations = 512) {
		let chroma = 0;
		let lightness = 0;

		for (let i = 0; i < Math.floor(iterations); ++i) {
			const l = i / (Math.floor(iterations) - 1.);

			let lch = new OkLCh(l, 1, hue);
			lch.fallback();

			if (lch.c > chroma) {
				chroma = lch.c;
				lightness = l;
			}
		}

		const lch = new OkLCh(lightness, chroma, hue);
		const rgb = OkLCh.OkLChTosRGB(lch);
		const lab = OkLab.sRGBtoOKLab(rgb);
		console.log('Highest Chroma', rgb.CSSColor, sRGB.sRGBToHex(rgb), lab.CSSColor, lch.CSSColor);
		console.log(rgb);
		console.log(lab);
		console.log(lch);

		return lch.copy();
	},

	customHueMix: function (hex1, hex2, t, method = OkLCh.HueMethod.Shorter) {
		const col1_sRGB = sRGB.HexTosRGB(hex1);
		const col2_sRGB = sRGB.HexTosRGB(hex2);

		const col1_OkLCh = OkLCh.sRGBToOkLCh(col1_sRGB);
		const col2_OkLCh = OkLCh.sRGBToOkLCh(col2_sRGB);

		const out_OkLCh = OkLCh.HueInterpolate(col1_OkLCh, col2_OkLCh, t, method);
		const out_sRGB = OkLCh.OkLChTosRGB(out_OkLCh);

		console.log(out_sRGB, out_OkLCh);
		console.log(out_sRGB.CSSColor);
		console.log(sRGB.sRGBToHex(out_sRGB));
	},

	// Find linear end colour that sits at edge of sRGB gamut
	linearMax: function (hexStart, hexMid, maxIterations = 100) {
		// console.clear();
		const start_sRGB = sRGB.HexTosRGB(hexStart);
		const mid_sRGB = sRGB.HexTosRGB(hexMid);

		const start = OkLab.sRGBtoOKLab(start_sRGB);
		const midC = OkLab.sRGBtoOKLab(mid_sRGB);

		let lo = midC.copy();
		let hi = midC.copy();

		hi.l = (midC.l - start.l) * 100 + start.l;
		hi.a = (midC.a - start.a) * 100 + start.a;
		hi.b = (midC.b - start.b) * 100 + start.b;

		let iter = 0;
		while (iter < maxIterations) {
			const oldRGB = OkLab.OkLabtosRGB(lo);

			let mid = start.copy();
			mid.l = (lo.l + hi.l) / 2;
			mid.a = (lo.a + hi.a) / 2;
			mid.b = (lo.b + hi.b) / 2;

			if (mid.isInside) {
				lo = mid.copy();

				const newRGB = OkLab.OkLabtosRGB(lo);
				if (oldRGB.CSSColor === newRGB.CSSColor) break;
			} else {
				hi = mid.copy();
			}
			++iter;
		}
		console.log(start, midC);
		console.log(lo, hi);

		const lo_sRGB = OkLab.OkLabtosRGB(lo);
		console.log(lo_sRGB.CSSColor);
		console.log(sRGB.sRGBToHex(lo_sRGB));

		const midT = (midC.l - start.l) / (lo.l - start.l);
		console.log('Mid t', midT);
	}
}