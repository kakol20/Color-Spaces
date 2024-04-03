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

      console.log(start);
      console.log(end);

      console.log(red(start));

      background(28);

      // drawColors(DOMManager.startColorPicker.color(), 10, DOMManager.domHeight);

      for (let i = 0; i < DOMManager.colorCount.value(); i++) {
        const posX = (squareSize * i) + 10;
        const posY = DOMManager.domHeight;
        const t = i / (DOMManager.colorCount.value() - 1);

        const c = sRGB.mix(start, end, t);

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