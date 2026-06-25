const devTools = {
	decreaseCValues: function (hex1 = '#0000ff', hex2 = '#ffff00') {
		// if (mixType === 'OkLCh Shorter' ||
		// 	mixType === 'OkLCh Longer' ||
		// 	mixType === 'OkLCh Increasing' ||
		// 	mixType === 'OkLCh Decreasing') {
		// 	// check for fallback

		// 	let col1 = OkLCh.sRGBToOkLCh(col1sRGB);
		// 	let col2 = OkLCh.sRGBToOkLCh(col2sRGB);

		// 	let minC = 1;

		// 	let offset = {
		// 		largestPer: 0,
		// 		t: 0,
		// 		actualC: 0
		// 	}

		// 	for (let i = 0; i < palette.length; ++i) {
		// 		const t = i / (count - 1);
		// 		const expectedC = (col2.c - col1.c) * t + col1.c;

		// 		const col = OkLCh.sRGBToOkLCh(palette[i]);
		// 		minC = col.c < minC ? col.c : minC;

		// 		const percentageOff = ((expectedC - col.c) / expectedC) * 100;
		// 		// if (percentageOff < 5.) continue;
		// 		if (percentageOff > 1 && percentageOff > offset.largestPer) {
		// 			offset.largestPer = percentageOff;
		// 			offset.t = t;
		// 			offset.actualC = col.c
		// 		}
		// 	}
		// 	console.log('OkLCh Min', minC);
		// 	console.log('Fallback Check', offset);
		// 	// console.log('Largest Offset', largestOffset);

		// 	if (offset.largestPer > 0 && offset.t <= 0.5) {
		// 		// modify col1
		// 		const oldCol1 = col1.copy();
		// 		let newC = (offset.actualC - col2.c * offset.t) / (1 - offset.t);

		// 		if (newC < 0) {
		// 			// modify col2
		// 			const oldCol2 = col2.copy();
		// 			newC = (offset.actualC - col1.c) / offset.t + col1.c;
		// 			col2.c = newC;
		// 			col2.fallback();

		// 			const srgb = OkLCh.OkLChTosRGB(col2);
		// 			console.log('old col2', oldCol2.CSSColor);
		// 			console.log('new col2', srgb.CSSColor, col2.CSSColor);
		// 		} else {
		// 			col1.c = newC;
		// 			col1.fallback();

		// 			const srgb = OkLCh.OkLChTosRGB(col1);
		// 			console.log('old col1', oldCol1.CSSColor);
		// 			console.log('new col1', srgb.CSSColor, col1.CSSColor);
		// 		}

		// 	} else if (offset.largestPer > 0) {
		// 		// modify col2
		// 		const oldCol2 = col2.copy();
		// 		let newC = (offset.actualC - col1.c) / offset.t + col1.c;

		// 		if (newC < 0) {
		// 			const oldCol1 = col1.copy();
		// 			newC = (offset.actualC - col2.c * offset.t) / (1 - offset.t);
		// 			col1.c = newC;
		// 			col1.fallback();

		// 			const srgb = OkLCh.OkLChTosRGB(col1);
		// 			console.log('old col1', oldCol1.CSSColor);
		// 			console.log('new col1', srgb.CSSColor, col1.CSSColor);
		// 		} else {
		// 			col2.c = newC;
		// 			col2.fallback();

		// 			const srgb = OkLCh.OkLChTosRGB(col2);
		// 			console.log('old col2', oldCol2.CSSColor);
		// 			console.log('new col2', srgb.CSSColor, col2.CSSColor);
		// 		}
		// 	}
		// }
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
		rgb( 57,  83, 141) rgb(249, 251, 172)
		#39548C #F9FBAD

devTools.manual('#0000FF', '#FFFF00', 0.09814458811923257);
		*/
	}
}