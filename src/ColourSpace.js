class sRGB {
  constructor(r = 0, g = 0, b = 0) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  clamp() {
    this.r = Math.max(Math.min(this.r, 1), 0);
    this.g = Math.max(Math.min(this.g, 1), 0);
    this.b = Math.max(Math.min(this.b, 1), 0);
  }

  get isInside() {
    return this.r <= 1 && this.r >= 0 && this.g <= 1 && this.g >= 0 && this.b <= 1 && this.b >= 0
  }

  copy() {
    return new sRGB(this.r, this.g, this.b);
  }

  mult(s) {
    this.r *= s;
    this.g *= s;
    this.b *= s;
  }

  get CSSColor() {
    let rVal = Math.round(Math.max(Math.min(this.r, 1), 0) * 255);
    let gVal = Math.round(Math.max(Math.min(this.g, 1), 0) * 255);
    let bVal = Math.round(Math.max(Math.min(this.b, 1), 0) * 255);
    return 'rgb(' + rVal + ',' + gVal + ',' + bVal + ')';
  }

  static HexTosRGB(hex) {
    const hexStr = hex.substring(1);
    const hexInt = Number('0x' + hexStr);

    const rMask = 0xFF0000;
    const gMask = 0x00FF00;
    const bMask = 0x0000FF;

    const rVal = ((hexInt & rMask) >> 16) / 255;
    const gVal = ((hexInt & gMask) >> 8) / 255;
    const bVal = (hexInt & bMask) / 255;

    return new sRGB(rVal, gVal, bVal);
  }
}

class OkLab {
  constructor(l = 0, a = 0, b = 0) {
    this.l = l;
    this.a = a;
    this.b = b;
  }

  mult(s) {
    this.l *= s;
    this.a *= s;
    this.b *= s;
  }

  add(otherLab) {
    this.l += otherLab.l;
    this.a += otherLab.a;
    this.b += otherLab.b;
  }

  sub(otherLab) {
    this.l -= otherLab.l;
    this.a -= otherLab.a;
    this.b -= otherLab.b;
  }

  copy() {
    return new OkLab(this.l, this.a, this.b);
  }

  static mix(lab1, lab2, t) {
    let out = lab2.copy();
    out.sub(lab1);
    out.mult(t);
    out.add(lab1);

    return out.copy();
  }

  static sRGBtoOKLab(srgb) {
    let l1 = srgb.r;
    let a1 = srgb.g;
    let b1 = srgb.b;

    // to Linear RGB
    l1 = Math.pow(l1, 2.224874);
    a1 = Math.pow(a1, 2.224874);
    b1 = Math.pow(b1, 2.224874);

    // to Linear LMS
    let l2 = 0.412242 * l1 + 0.536262 * a1 + 0.051428 * b1;
    let a2 = 0.211943 * l1 + 0.680702 * a1 + 0.107374 * b1;
    let b2 = 0.088359 * l1 + 0.281847 * a1 + 0.630130 * b1;

    // to LMS
    l1 = Math.cbrt(l2);
    a1 = Math.cbrt(a2);
    b1 = Math.cbrt(b2);

    // to OkLab
    l2 = 0.210454 * l1 + 0.793618 * a1 - 0.004072 * b1;
    a2 = 1.977998 * l1 - 2.428592 * a1 + 0.450594 * b1;
    b2 = 0.025904 * l1 + 0.782772 * a1 - 0.808676 * b1;

    return new OkLab(l2, a2, b2);
  }

  static OkLabtosRGB(lab) {
    let r1 = lab.l;
    let g1 = lab.a;
    let b1 = lab.b

    // to LMS
    let r2 = r1 + 0.396338 * g1 + 0.215804 * b1;
    let g2 = r1 - 0.105561 * g1 - 0.063854 * b1;
    let b2 = r1 - 0.089484 * g1 - 1.291486 * b1;

    // to Linear LMS
    r1 = r2 * r2 * r2;
    g1 = g2 * g2 * g2;
    b1 = b2 * b2 * b2;

    // to Linear RGB
    r2 = 4.076539 * r1 - 3.307097 * g1 + 0.230822 * b1;
    g2 = -1.268606 * r1 + 2.609748 * g1 - 0.341164 * b1;
    b2 = -0.004198 * r1 - 0.703568 * g1 + 1.707206 * b1;

    // to sRGB
    r1 = MathCustom.NRoot(r2, 2.224874);
    g1 = MathCustom.NRoot(g2, 2.224874);
    b1 = MathCustom.NRoot(b2, 2.224874);

    return new sRGB(r1, g1, b1);
  }
}