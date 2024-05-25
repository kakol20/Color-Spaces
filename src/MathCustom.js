class MathCustom {
  static NRoot(v, n) {
    let out = v;
    const exp = 1 / n;
    if (n % 1. === 0.) {
      out = Math.pow(out, exp);
    }
    else {
      let absroot = Math.pow(Math.abs(out), exp);
      if (out < 0.) absroot *= -1.;
      out = absroot;
    }
    return out;
  }

  static UnsignedMod(numer, denom) {
    return ((numer % denom) + denom) % denom;
  }

  static TAU = Math.PI * 2;
  static DegToRad = Math.PI / 180;
}