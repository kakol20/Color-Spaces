const ProcessManager = (function () {
  let state = 'nothing';

  const maxFPS = 60;

  const debugStates = true;

  const squareSize = 50;

  function drawColors(color, x, y) {
    noStroke();
    fill(color);

    rect(x, y, squareSize);
  }

  return {
    changeState(s) {
      state = s;

      if (debugStates) console.log('State Change: ' + s);
    },

    setup() {
      this.generatePalette();
    },

    generatePalette() {
      // console.log('Button pressed');
      clear();

      const start = DOMManager.startColorPicker.color();
      const end = DOMManager.endColorPicker.color();

      // console.log(start);
      // console.log(end);

      // console.log(red(start));

      background(28);

      // drawColors(DOMManager.startColorPicker.color(), 10, DOMManager.domHeight);

      const iLimit = Math.floor((windowWidth - squareSize - 20) / squareSize) + 1;

      // console.log(iLimit);

      for (let i = 0; i < DOMManager.colorCount.value(); i++) {
        const t = i / (DOMManager.colorCount.value() - 1);

        // const c = sRGB.mix(start, end, t);
        let c;

        switch (DOMManager.spaceSelect.selected()) {
          case 'sRGB':
            c = sRGB.mix(start, end, t);
            break;
          case 'Linear RGB':
            c = LinearRGB.mix(start, end, t);
            break;
          default:
            c = sRGB.mix(start, end, t);
            break;
        }

        let posX, posY;

        if (i < iLimit) {
          posX = (squareSize * i) + 10;
          posY = DOMManager.domHeight;
        } else {
          posX = (squareSize * (i % iLimit)) + 10;
          posY = DOMManager.domHeight + squareSize * Math.floor(i / iLimit);
        }

        drawColors(c, posX, posY);
        // console.log(c);
      }
    },

    draw(dt) {
      switch (state) {
        default:
          // do nothing
          break;
      }
    }
  }
})()