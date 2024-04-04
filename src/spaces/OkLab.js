const OkLab = (function () {
  // https://bottosson.github.io/posts/oklab/
  const M1 = new Matrix([
    [0.8189330101, 0.0329845436, 0.0482003018],
    [0.3618667424, 0.9293118715, 0.2643662691],
    [-0.128859713, 0.0361456387, 0.6338517070]
  ]);
  const M2 = new Matrix([
    [0.2104542553, 1.9779984951, 0.0259040371],
    [0.7936177850, -2.4285922050, 0.7827717662],
    [-0.0040720468, 0.4505937099, -0.8086757660]
  ]);

  const M1inv = new Matrix(M1.mat);
  const M2inv = new Matrix(M2.mat);

  M1inv.invert3x3();
  M2inv.invert3x3();

  return {
    // xyz: array
    // out: array
    XYZtoLab(xyz) {
      // to matrix
      const xyzMat = Matrix.Arr3ToMat(xyz);

      // // convert to lms
      // let lms = new Matrix(M1.mat);
      // lms.mult(xyzMat);
      // // console.log(lms);

      // // apply non-linearity
      // let lmsnl = new Matrix(lms.mat);
      // lmsnl.cbrt();
      // // console.log(lmsnl);

      // // convert to Lab
      // let lab = new Matrix(M2.mat);
      // lab.mult(lmsnl);

      // return Matrix.MatToArr3(lab);

      let out1 = new Matrix(M1.mat);
      out1.mult(xyzMat);
      out1.cbrt();

      let out2 = new Matrix(M2.mat);
      out2.mult(out1);
      return Matrix.MatToArr3(out2);
    },
    
    LabtoXYZ(lab) {
      const labMat = Matrix.Arr3ToMat(lab);

      // let lmsnl = new Matrix(M2inv.mat);
      // lmsnl.mult(labMat);

      // // convert to lms
      // let lms = new Matrix(lmsnl.mat);
      // lms.pow(3);

      // // convert to xyz
      // let xyz = new Matrix(M1inv.mat);
      // xyz.mult(lms);

      let out1 = new Matrix(M2inv.mat);
      out1.mult(labMat);
      out1.pow(3);

      let out2 = new Matrix(M1inv.mat);
      out2.mult(out1);
      return Matrix.MatToArr3(out2);
    },

    mix(c1, c2, t) {
      // convert to linear rgb
      let color1 = LinearRGB.sRGBtoLinear(c1);
      let color2 = LinearRGB.sRGBtoLinear(c2);

      // convert to xyz
      color1 = CIEXYZ.ToXYZ(color1);
      color2 = CIEXYZ.ToXYZ(color2);

      // convert to Lab
      color1 = this.XYZtoLab(color1);
      color2 = this.XYZtoLab(color2);

      // mix
      let mixed = [0, 0, 0];
      for (let i = 0; i < 3; i++) {
        mixed[i] = map(t, 0, 1, color1[i], color2[i]);
      }

      // convert to xyz
      mixed = this.LabtoXYZ(mixed);

      // convert to linear rgb
      mixed = CIEXYZ.ToLRGB(mixed);

      // clamp
      for (let i = 0; i < 3; i++) {
        mixed[i] = mixed[i] > 1 ? 1 : mixed[i];
        mixed[i] = mixed[i] < 0 ? 0 : mixed[i];
      }

      // convert to sRGB
      mixed = LinearRGB.LineartosRGB(mixed);

      return color(mixed[0] * 255, mixed[1] * 255, mixed[2] * 255);
    }
  }
})();