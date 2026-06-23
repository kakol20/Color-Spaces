let ditherThreshold = new Bayer(16);

function setup() {
	const cnvWidth = document.documentElement.clientWidth - 20;
	const cnvHeight = 50;
	let cnv = createCanvas(cnvWidth, cnvHeight);

	// cnv.position(10, 170);
	cnv.position(10, 135);

	noLoop();

	addEventListener("change", () => {
		generate();
	})
}

function GetIndex(x, y, w) {
	return 4 * (x + y * w);
}

const ditherFactor = 255.
const dithering_R = 1. / ditherFactor;
function DitherValue(val, x, y) {
	const M = ditherThreshold.GetThreshold(x, y) * -1.;
	let newVal = val;

	newVal += M * dithering_R;
	newVal = newVal < 0. ? 0. : newVal > 1. ? 1. : newVal;
	return Math.floor((ditherFactor + 1) * newVal) / ditherFactor;
}

function ColDToUint(v) {
	let out = Math.floor(v * 256);
	return out > 255 ? 255 : out < 0 ? 0 : out;
}

function draw() {
	generate();
}

function generate() {
	const boxHeight = 50;
	const top = 135;

	// console.log('Generate Button Pressed');
	console.clear();

	console.log('Bayer Threshold', ditherThreshold.values);

	const count = $('#countInput').val() * 1;
	console.log('Count', count);

	const pixD = pixelDensity();
	const maxCount = Math.min((width - 20) / 2, 256);
	console.log('Max Count', maxCount);

	if (count >= 2 && count < maxCount) {
		// Do gradient
		const col1sRGB = sRGB.HexTosRGB($('#colorA').val());
		console.log('Colour 1 sRGB', col1sRGB);
		const col1Lab = OkLab.sRGBtoOKLab(col1sRGB);
		console.log('Colour 1 OkLab', col1Lab);

		const col2sRGB = sRGB.HexTosRGB($('#colorB').val());
		console.log('Colour 2', col2sRGB);
		const col2Lab = OkLab.sRGBtoOKLab(col2sRGB);
		console.log('Colour 2 OkLab', col2Lab);

		const mixType = $('#select').val();
		console.log('Mix Type', mixType);

		let palette = [];

		// ----- GENERATE PALETTE -----
		for (let i = 0; i < count; ++i) {
			const t = i / (count - 1);

			if (i === 0) {
				palette.push(col1sRGB);
			} else if (i === count - 1) {
				palette.push(col2sRGB);
			} else {
				let col1, col2, newCol;

				switch (mixType) {
					case 'sRGB':
						const sr = col1sRGB.r * (1 - t) + col2sRGB.r * t;
						const sg = col1sRGB.g * (1 - t) + col2sRGB.g * t;
						const sb = col1sRGB.b * (1 - t) + col2sRGB.b * t;
						palette.push(new sRGB(sr, sg, sb));
						break;
					case 'OkLab':
						const mixLab = OkLab.mix(col1Lab, col2Lab, t);
						const mixsRGB = OkLab.OkLabtosRGB(mixLab);
						palette.push(mixsRGB);
						break;
					case 'Linear RGB':
						const col1Lin = LinearRGB.sRGBToLinear(col1sRGB);
						const col2Lin = LinearRGB.sRGBToLinear(col2sRGB);
						const lr = col1Lin.r * (1 - t) + col2Lin.r * t;
						const lg = col1Lin.g * (1 - t) + col2Lin.g * t;
						const lb = col1Lin.b * (1 - t) + col2Lin.b * t;
						palette.push(LinearRGB.LinearTosRGB(new LinearRGB(lr, lg, lb)));
						break;
					case 'OkLCh Shorter':
						col1 = OkLCh.sRGBToOkLCh(col1sRGB);
						col2 = OkLCh.sRGBToOkLCh(col2sRGB);

						newCol = OkLCh.HueInterpolate(col1, col2, t, mixType);
						palette.push(OkLCh.OkLChTosRGB(newCol));
						break;
					case 'OkLCh Longer':
						col1 = OkLCh.sRGBToOkLCh(col1sRGB);
						col2 = OkLCh.sRGBToOkLCh(col2sRGB);

						newCol = OkLCh.HueInterpolate(col1, col2, t, mixType);
						palette.push(OkLCh.OkLChTosRGB(newCol));
						break;
					case 'OkLCh Increasing':
						col1 = OkLCh.sRGBToOkLCh(col1sRGB);
						col2 = OkLCh.sRGBToOkLCh(col2sRGB);

						newCol = OkLCh.HueInterpolate(col1, col2, t, mixType);
						palette.push(OkLCh.OkLChTosRGB(newCol));
						break;
					case 'OkLCh Decreasing':
						col1 = OkLCh.sRGBToOkLCh(col1sRGB);
						col2 = OkLCh.sRGBToOkLCh(col2sRGB);

						newCol = OkLCh.HueInterpolate(col1, col2, t, mixType);
						palette.push(OkLCh.OkLChTosRGB(newCol));
						break;
					default:
						console.error('Unknown mix type: ' + mixType);
				}
			}
		}

		// ----- TEXT OUTPUT -----

		let out = '';

		let textArea = '<textarea wrap="off" id="textOut" style="position: absolute; left: 10px;';
		textArea += ' height: auto; width: auto;';
		textArea += ' top: ' + (top + 10 + boxHeight) + 'px;"';
		textArea += '>';
		let textAreaText = ['', '', ''];

		for (let i = 0; i < palette.length; ++i) {
			const valRGB = palette[i];
			const valLab = OkLab.sRGBtoOKLab(valRGB);
			const valLCh = OkLCh.LabToLCh(valLab);
			textAreaText[0] += valRGB.CSSColor;
			textAreaText[1] += valLab.CSSColor;
			textAreaText[2] += valLCh.CSSColor;

			if (i < palette.length - 1) {
				textAreaText[0] += "\n";
				textAreaText[1] += "\n";
				textAreaText[2] += "\n";
			}
		}

		textArea += textAreaText[0] + '\n\n' + textAreaText[1] + '\n\n' + textAreaText[2];
		textArea += '</textarea>';

		$('#output').html(out + textArea);

		$('#textOut').css('height', $('#textOut').prop('scrollHeight') + 'px');
		$('#textOut').css('width', ($('#textOut').prop('scrollWidth') + 10) + 'px');

		// Resize canvas in case window size gets changed
		let cnvWidth = document.documentElement.clientWidth - 20;
		if (count * 50 < cnvWidth) cnvWidth = count * 50;

		const cnvHeight = 50;
		resizeCanvas(cnvWidth, cnvHeight, true);
		background(255);

		// ----- DRAW PALETTE -----

		// Calculate Scaling Values
		// const scaleX = (width - pixD) / count;
		// const targetWidth = Math.floor(count * scaleX);
		// const scaleXint = Math.ceil(targetWidth / count);

		loadPixels();
		for (let x = 0; x < width * pixD; ++x) {
			const palIndex = Math.floor((x * count) / (width * pixD));

			const output = palette[palIndex];

			for (let y = 0; y < height * pixD; ++y) {
				const index = GetIndex(x, y, width * pixD);

				pixels[index + 0] = ColDToUint(output.r);
				pixels[index + 1] = ColDToUint(output.g);
				pixels[index + 2] = ColDToUint(output.b);
			}
		}
		updatePixels();
	} else if (count >= maxCount || count <= 0) {
		// Get colours
		const col1sRGB = sRGB.HexTosRGB($('#colorA').val());
		console.log('Colour 1 sRGB', col1sRGB);
		const col1Lab = OkLab.sRGBtoOKLab(col1sRGB);
		console.log('Colour 1 OkLab', col1Lab);

		const col2sRGB = sRGB.HexTosRGB($('#colorB').val());
		console.log('Colour 2', col2sRGB);
		const col2Lab = OkLab.sRGBtoOKLab(col2sRGB);
		console.log('Colour 2 OkLab', col2Lab);

		const mixType = $('#select').val();
		console.log('Mix Type', mixType);

		// ----- TEXT OUTPUT -----

		let out = '';

		let textArea = '<textarea wrap="off" id="textOut" style="position: absolute; left: 10px;';
		textArea += ' height: auto; width: auto;';
		textArea += ' top: ' + (top + 10 + boxHeight) + 'px;"';
		textArea += '>';

		textArea += count <= 0 ? 'Count set to zero or negative' : 'Count Exceeds Max!';
		textArea += '\nShowing dithered gradient instead\n\n';

		textArea += col1sRGB.CSSColor + '\n' + col2sRGB.CSSColor + '\n\n';
		textArea += col1Lab.CSSColor + '\n' + col2Lab.CSSColor + '\n\n';
		textArea += OkLCh.LabToLCh(col1Lab).CSSColor + '\n' + OkLCh.LabToLCh(col2Lab).CSSColor;

		textArea += '</textarea>';

		$('#output').html(out + textArea);

		$('#textOut').css('height', $('#textOut').prop('scrollHeight') + 'px');
		$('#textOut').css('width', ($('#textOut').prop('scrollWidth') + 10) + 'px');

		// Resize canvas in case window size gets changed
		let cnvWidth = document.documentElement.clientWidth - 20;

		// ----- DRAW AS A DITHERED GRADIENT -----

		const cnvHeight = 50;
		resizeCanvas(cnvWidth, cnvHeight, true);
		background(28);

		loadPixels();
		for (let x = 0; x < width * pixD; ++x) {
			const t = x / (width * pixD);

			if (x === 10) console.log('Debug t', t);
			let col, col1, col2, newCol;

			switch (mixType) {
				case 'sRGB':
					const sr = col1sRGB.r * (1 - t) + col2sRGB.r * t;
					const sg = col1sRGB.g * (1 - t) + col2sRGB.g * t;
					const sb = col1sRGB.b * (1 - t) + col2sRGB.b * t;
					col = new sRGB(sr, sg, sb);
					break;
				case 'OkLab':
					const mixLab = OkLab.mix(col1Lab, col2Lab, t);
					col = OkLab.OkLabtosRGB(mixLab);
					break;
				case 'Linear RGB':
					const col1Lin = LinearRGB.sRGBToLinear(col1sRGB);
					const col2Lin = LinearRGB.sRGBToLinear(col2sRGB);
					const lr = col1Lin.r * (1 - t) + col2Lin.r * t;
					const lg = col1Lin.g * (1 - t) + col2Lin.g * t;
					const lb = col1Lin.b * (1 - t) + col2Lin.b * t;
					col = LinearRGB.LinearTosRGB(new LinearRGB(lr, lg, lb));
					break;
					case 'OkLCh Shorter':
						col1 = OkLCh.sRGBToOkLCh(col1sRGB);
						col2 = OkLCh.sRGBToOkLCh(col2sRGB);

						newCol = OkLCh.HueInterpolate(col1, col2, t, mixType);
						col = OkLCh.OkLChTosRGB(newCol);
						break;
					case 'OkLCh Longer':
						col1 = OkLCh.sRGBToOkLCh(col1sRGB);
						col2 = OkLCh.sRGBToOkLCh(col2sRGB);

						newCol = OkLCh.HueInterpolate(col1, col2, t, mixType);
						col = OkLCh.OkLChTosRGB(newCol);
						break;
					case 'OkLCh Increasing':
						col1 = OkLCh.sRGBToOkLCh(col1sRGB);
						col2 = OkLCh.sRGBToOkLCh(col2sRGB);

						newCol = OkLCh.HueInterpolate(col1, col2, t, mixType);
						col = OkLCh.OkLChTosRGB(newCol);
						break;
					case 'OkLCh Decreasing':
						col1 = OkLCh.sRGBToOkLCh(col1sRGB);
						col2 = OkLCh.sRGBToOkLCh(col2sRGB);

						newCol = OkLCh.HueInterpolate(col1, col2, t, mixType);
						col = OkLCh.OkLChTosRGB(newCol);
						break;
				default:
					col = col1sRGB.copy();
					console.error('Unknown mix type: ' + mixType);
			}

			for (let y = 0; y < height * pixD; ++y) {
				const index = GetIndex(x, y, width * pixD);

				const r = col.r;
				const g = col.g;
				const b = col.b;

				pixels[index + 0] = ColDToUint(DitherValue(r, x, y));
				pixels[index + 1] = ColDToUint(DitherValue(g, x, y));
				pixels[index + 2] = ColDToUint(DitherValue(b, x, y));
			}
		}
		updatePixels();
	} else {
		// Just show first colour

		// Resize canvas in case window size gets changed
		let cnvWidth = document.documentElement.clientWidth - 20;
		if (cnvWidth > 50) cnvWidth = 50;

		const cnvHeight = 50;
		resizeCanvas(cnvWidth, cnvHeight, true);

		const col1sRGB = sRGB.HexTosRGB($('#colorA').val());
		console.log('Colour 1 sRGB', col1sRGB);

		background($('#colorA').val());
	}
}