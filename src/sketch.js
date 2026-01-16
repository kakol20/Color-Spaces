function setup() {
	const cnvWidth = windowWidth - 20;
	const cnvHeight = 50;
  let cnv = createCanvas(cnvWidth, cnvHeight);

	cnv.position(10, 170);

	noLoop();
}

function draw() {
  // background(255);

	generate();
}

function generate() {
	// console.log('Generate Button Pressed');

	const count = $('#countInput').val() * 1;
	console.log('Count', count);

	if (count >= 2) {
		// Do gradient
	} else {
		// Just show first colour
		const col1sRGB = sRGB.HexTosRGB($('#colorA').val());
		console.log('Colour 1 sRGB', col1sRGB);

		background($('#colorA').val());
	}
}