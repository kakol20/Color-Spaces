const devTools = {
	scalingMethod: function (hex1 = '#0000ff', hex2 = '#ffff00', count = 256, method = OkLCh.HueMethod.Longer) {
		// const expectedC = (col2.c - col1.c) * t + col1.c;
		// let newC = (offset.actualC - col2.c * offset.t) / (1 - offset.t);
		// let newC = (offset.actualC - col1.c) / offset.t + col1.c;

		const col1_sRGB = sRGB.HexTosRGB(hex1);
		const col2_sRGB = sRGB.HexTosRGB(hex2);

		const col1_OkLCh = OkLCh.sRGBToOkLCh(col1_sRGB);
		const col2_OkLCh = OkLCh.sRGBToOkLCh(col2_sRGB);

		let minScale = 1;

		for (let i = 0; i < count; ++i) {
			const t = i / (count - 1);
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

		console.log('Old', col1_OkLCh.CSSColor, col2_OkLCh.CSSColor);
		console.log('New', newCol1_OkLCh.CSSColor, newCol2_OkLCh.CSSColor);
		console.log(newCol1_sRGB.CSSColor, newCol2_sRGB.CSSColor);
		console.log(sRGB.sRGBToHex(newCol1_sRGB), sRGB.sRGBToHex(newCol2_sRGB));

		/*
		OkLCh Shorter
		OkLCh Longer
		OkLCh Increasing
		OkLCh Decreasing

devTools.scalingMethod('#2D50A1', '#F8FBB2', 256, OkLCh.HueMethod.Shorter);
rgb( 50,  82, 152) rgb(248, 251, 187)
#325298 #F8FBBB
		*/
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

		/*
		rgb(193, 110,  98) rgb(193, 110,  98)

devTools.manual('#ff0000', '#ff0000', 0.10675064085838756);
		*/
	}
}