const LinearRGB = (function () {
  // c: p5.Color
  function sRGBtoLinear(c) {
    const r = red(c) / 255.0;
    const g = green(c) / 255.0;
    const b = blue(c) / 255.0;

    let out = [r, g, b]

    for (let i = 0; i < 3; i++) {
      if (out[i] <= 0.04045) {
        out[i] = out[i] / 12.92;
      } else {
        out[i] = Math.pow((out[i] + 0.055) / 1.055, 2.4);
      }
    }

    return out;
  }

  // c: array
  function LineartosRGB(c) {
    let out = JSON.parse(JSON.stringify(c)); // deep copy

    for (let i = 0; i < 3; i++) {
      if (out[i] <= 0.0031318) {
        out[i] = out[i] * 12.92;
      } else {
        out[i] = Math.pow(1.055 * out[i], 1 / 2.4) - 0.055;
      }
    }

    return out;
  }
  return {

    mix(c1, c2, t) {
      const color1 = sRGBtoLinear(c1);
      const color2 = sRGBtoLinear(c2);

      let mixed = [0, 0, 0];

      // mix
      for (let i = 0; i < 3; i++) {
        mixed[i] = map(t, 0, 1, color1[i], color2[i]);
      }

      mixed = LineartosRGB(mixed);

      // convert back to p5.Color

      return color(mixed[0] * 255, mixed[1] * 255, mixed[2] * 255);
    }
  }
})();