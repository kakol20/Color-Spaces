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

      // let testMat = new Matrix([
      //   [1, 2, -1],
      //   [2, 1, 2],
      //   [-1, 2, 1]
      // ]);

      let testMat = new Matrix([
        [0.4124564, 0.2126729, 0.0193339],
        [0.3575761, 0.7151522, 0.1191920],
        [0.1804375, 0.0721750, 0.9503041]
      ]);

      console.log(testMat);

      testMat.invert3x3();
    },

    generatePalette() {
      console.log('Select: ' + DOMManager.spaceSelect.selected());

      const start = DOMManager.startColorPicker.color();
      const end = DOMManager.endColorPicker.color();

      background(28);

      const iLimit = Math.floor((windowWidth - squareSize - 20) / squareSize) + 1;

      // console.log(iLimit);

      for (let i = 0; i < DOMManager.colorCount.value(); i++) {
        const t = i / (DOMManager.colorCount.value() - 1);

        // const c = sRGB.mix(start, end, t);
        let c;

        // https://www.cs.rit.edu/~ncs/color/t_convert.html#RGB%20to%20XYZ%20&%20XYZ%20to%20RGB
        // https://bottosson.github.io/posts/oklab/
        // http://www.brucelindbloom.com/index.html?Eqn_RGB_to_XYZ.html
        switch (DOMManager.spaceSelect.selected()) {
          case 'sRGB':
            c = sRGB.mix(start, end, t);
            break;
          case 'Linear RGB':
            c = LinearRGB.mix(start, end, t);
            break;
          case 'CIE XYZ':
            c = CIEXYZ.mix(start, end, t);
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