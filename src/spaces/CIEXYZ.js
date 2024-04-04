const CIEXYZ = (function () {
  // http://www.brucelindbloom.com/index.html?Eqn_RGB_to_XYZ.html
  const toXYZMat = new Matrix([
    [0.4124564, 0.2126729, 0.0193339],
    [0.3575761, 0.7151522, 0.1191920],
    [0.1804375, 0.0721750, 0.9503041]
  ]);

  const toRGBMat = new Matrix();
  toRGBMat.copy(toXYZMat);
  toRGBMat.invert3x3();

  return {
    // rgb: array
    // out: array
    ToXYZ(rgb) {
      const col = Matrix.Arr3ToMat(rgb);

      let out = new Matrix();
      out.copy(toXYZMat);
      out.mult(col);

      return Matrix.MatToArr3(out);
    },

    // xyz: array
    // out: array
    ToLRGB(xyz) {
      const col = Matrix.Arr3ToMat(xyz);

      let out = new Matrix();
      out.copy(toRGBMat);
      out.mult(col);

      return Matrix.MatToArr3(out);
    },

    mix(c1, c2, t) {
      let color1 = LinearRGB.sRGBtoLinear(c1);
      let color2 = LinearRGB.sRGBtoLinear(c2);

      // convert to xyz
      color1 = this.ToXYZ(color1);
      color2 = this.ToXYZ(color2);

      let mixed = [0, 0, 0];

      // mix
      for (let i = 0; i < 3; i++) {
        mixed[i] = map(t, 0, 1, color1[i], color2[i]);
      }

      // convert back to linear rgb
      mixed = this.ToLRGB(mixed);

      // clamp
      for (let i = 0; i < 3; i++) {
        mixed[i] = mixed[i] > 1 ? 1 : mixed[i];
        mixed[i] = mixed[i] < 0 ? 0 : mixed[i];
      }

      // convert back to sRGB
      mixed = LinearRGB.LineartosRGB(mixed);
      return color(mixed[0] * 255, mixed[1] * 255, mixed[2] * 255);
    }
  }
})();