$(document).ready(function () {
  generate();
});

function generateDiv(left, top, bg_col, width, height) {
  let out = '<div style=\"position: absolute;';
  out += ' left: ' + Math.round(left) + 'px;';
  out += ' top: ' + Math.round(top) + 'px;';
  out += ' background-color: ' + bg_col + ';';
  out += ' width: ' + Math.round(width) + 'px;';
  out += ' height: ' + Math.round(height) + 'px;';
  out += '\"></div>';
  return out;
}

function generate() {
  // console.log('Generate Button Pressed');
  const count = $('#countInput').val() * 1;
  console.log('Count', count);

  if (count >= 2) {
    const col1sRGB = sRGB.HexTosRGB($('#colorA').val());
    console.log('Colour 1 sRGB', col1sRGB);
    const col1Lab = OkLab.sRGBtoOKLab(col1sRGB);
    console.log('Colour 1 OkLab', col1Lab);

    const col2sRGB = sRGB.HexTosRGB($('#colorB').val());
    console.log('Colour 2', col2sRGB);
    const col2Lab = OkLab.sRGBtoOKLab(col2sRGB);
    console.log('Colour 2 OkLab', col2Lab);

    const maxWidth = window.innerWidth - 20;
    const boxHeight = 50;
    const defaultBoxWidth = 50;

    // console.log(col1sRGB.CSSColor);
    // console.log(col2sRGB.CSSColor);

    console.log('Max Width', maxWidth);
    console.log('Box Height', boxHeight);

    // console.log(generateDiv(10, 170, col1sRGB.CSSColor, 50, 50));

    // ----- GENERATE PALETTE -----

    let out = '';
    // let out = generateDiv(10, 170, col1sRGB.CSSColor, defaultBoxWidth, boxHeight);
    const top = 170;

    const boxWidth = defaultBoxWidth * count > maxWidth ? Math.floor(maxWidth / count) : defaultBoxWidth;
    console.log('Box Width', boxWidth);

    // text area
    let textArea = '<textarea wrap="off" id="textOut" style="position: absolute; left: 10px;';
    textArea += ' height: auto; width: auto;';
    // textArea += ' overflow-wrap: normal; overflow-x: scroll;'
    textArea += ' top: ' + (top + 10 + boxHeight) + 'px;"';
    // textArea += ' rows=\"' + (count + 1) + '\">';
    // textArea += ' style="height: auto;"';
    textArea += '>';
    let textAreaText = ['', '', ''];

    for (let i = 0; i < count; i++) {
      const left = 10 + (i * boxWidth);
      if (i === 0) {
        const valLab = col1Lab.copy();
        const valLCh = OkLCh.LabToLCh(valLab);
        const valRGB = col1sRGB.copy();

        out += generateDiv(left, top, valRGB.CSSColor, boxWidth, boxHeight);
        textAreaText[0] += valRGB.CSSColor + '\n';
        textAreaText[1] += valLab.CSSColor + '\n';
        textAreaText[2] += valLCh.CSSColor + '\n';
      } else if (i === count - 1) {
        const valLab = col2Lab.copy();
        const valLCh = OkLCh.LabToLCh(valLab);
        const valRGB = col2sRGB.copy();

        out += generateDiv(left, top, valRGB.CSSColor, boxWidth, boxHeight);
        textAreaText[0] += valRGB.CSSColor;
        textAreaText[1] += valLab.CSSColor;
        textAreaText[2] += valLCh.CSSColor;
      } else {
        const t = i / (count - 1);

        let valLab = OkLab.mix(col1Lab, col2Lab, t);
        let valLCh = OkLCh.LabToLCh(valLab);
        valLCh.fallback();

        valLab = OkLCh.LChToLab(valLCh);
        const valRGB = OkLab.OkLabtosRGB(valLab);

        out += generateDiv(left, top, valRGB.CSSColor, boxWidth, boxHeight);

        textAreaText[0] += valRGB.CSSColor + '\n';
        textAreaText[1] += valLab.CSSColor + '\n';
        textAreaText[2] += valLCh.CSSColor + '\n';
      }
    }
    textArea += textAreaText[0] + '\n\n' + textAreaText[1] + '\n\n' + textAreaText[2];
    textArea += '</textarea>';

    $('#output').html(out + textArea);

    $('#textOut').css('height', $('#textOut').prop('scrollHeight') + 'px');
    $('#textOut').css('width', ($('#textOut').prop('scrollWidth') + 10) + 'px');

  }
}