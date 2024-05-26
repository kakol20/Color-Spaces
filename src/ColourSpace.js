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

  get CSSColor() {
    const l = Math.max(Math.min(this.l, 1), 0);
    return 'oklab(' + MathCustom.Round(l, 3) + ', ' + MathCustom.Round(this.a, 3) + ', ' + MathCustom.Round(this.b, 3) + ')';
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
    l1 = l1 <= 0.04045 ? l1 / 12.92 : Math.pow((l1 + 0.055) / 1.055, 2.4);
    a1 = a1 <= 0.04045 ? a1 / 12.92 : Math.pow((a1 + 0.055) / 1.055, 2.4);
    b1 = b1 <= 0.04045 ? b1 / 12.92 : Math.pow((b1 + 0.055) / 1.055, 2.4);

    // to Linear LMS
    let l2 = 0.41224204990 * l1 + 0.5362616219 * a1 + 0.05142804289 * b1;
    let a2 = 0.21194297300 * l1 + 0.6807021848 * a1 + 0.10737408160 * b1;
    let b2 = 0.08835888959 * l1 + 0.2818474475 * a1 + 0.63012965340 * b1;

    // to LMS
    l1 = Math.cbrt(l2);
    a1 = Math.cbrt(a2);
    b1 = Math.cbrt(b2);

    // to OkLab
    l2 = 0.2104542553 * l1 + 0.7936177850 * a1 - 0.0040720468 * b1;
    a2 = 1.9779984950 * l1 - 2.4285922050 * a1 + 0.4505937099 * b1;
    b2 = 0.0259040371 * l1 + 0.7827717662 * a1 - 0.8086757660 * b1;

    return new OkLab(l2, a2, b2);
    // return new OkLab(MathCustom.Round(l2, 7), MathCustom.Round(a2, 7), MathCustom.Round(b2, 7));
  }

  static OkLabtosRGB(lab) {
    let r1 = lab.l;
    let g1 = lab.a;
    let b1 = lab.b

    // to LMS
    let r2 = r1 + 0.39633779220 * g1 + 0.21580375810 * b1;
    let g2 = r1 - 0.10556134230 * g1 - 0.06385417477 * b1;
    let b2 = r1 - 0.08948418209 * g1 - 1.29148553800 * b1;

    // to Linear LMS
    r1 = r2 * r2 * r2;
    g1 = g2 * g2 * g2;
    b1 = b2 * b2 * b2;

    // to Linear RGB
    r2 =  4.076538816000 * r1 - 3.3070968280 * g1 + 0.2308224516 * b1;
    g2 = -1.268606251000 * r1 + 2.6097476770 * g1 - 0.3411636353 * b1;
    b2 = -0.004197563774 * r1 - 0.7035684095 * g1 + 1.7072056180 * b1;

    // to sRGB
    r1 = r2 <= 0.00313058 ? 12.92 * r2 : (MathCustom.NRoot(r2, 2.4) * 1.055) - 0.055;
    g1 = g2 <= 0.00313058 ? 12.92 * g2 : (MathCustom.NRoot(g2, 2.4) * 1.055) - 0.055;
    b1 = b2 <= 0.00313058 ? 12.92 * b2 : (MathCustom.NRoot(b2, 2.4) * 1.055) - 0.055;

    return new sRGB(r1, g1, b1);
    // return new sRGB(MathCustom.Round(r1, 7), MathCustom.Round(g1, 7), MathCustom.Round(b1, 7));
  }
}

class OkLCh {
  constructor(l = 0, c = 0, h = 0) {
    this.l = l;
    this.c = c;
    this.h = h;
  }

  static LabToLCh(lab) {
    const l = lab.l;
    const c = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
    const h = MathCustom.UnsignedMod(Math.atan2(lab.b, lab.a), MathCustom.TAU);
    return new OkLCh(l, c, h);
    // return new OkLCh(MathCustom.Round(l, 7), MathCustom.Round(c, 7), MathCustom.Round(h, 7));
  }

  static sRGBToOkLCh(srgb) {
    return OkLCh.LabToLCh(OkLab.sRGBtoOKLab(srgb));
  }

  static LChToLab(lch) {
    const l = lch.l;
    const a = lch.c * Math.cos(lch.h);
    const b = lch.c * Math.sin(lch.h);
    return new OkLab(l, a, b);
    // return new OkLab(MathCustom.Round(l, 7), MathCustom.Round(a, 7), MathCustom.Round(b, 7));
  }

  static OkLChTosRGB(lch) {
    return OkLab.OkLabtosRGB(OkLCh.LChToLab(lch));
  }

  copy() {
    return new OkLCh(this.l, this.c, this.h);
  }

  get isInside() {
    return (OkLCh.sRGBToOkLCh(this)).isInside;
  }

  get CSSColor() {
    const l = Math.max(Math.min(this.l, 1), 0);
    const h = this.h * MathCustom.RadToDeg;
    return 'oklch(' + MathCustom.Round(l, 3) + ', ' + MathCustom.Round(this.c, 3) + ', ' + MathCustom.Round(h, 3) + ')';
  }

  fallback(change = 0.001) {
    this.l = Math.max(Math.min(this.l, 1), 0);
    this.c = this.l === 0 || this.l === 1 ? 0 : this.c;

    let current = OkLCh.OkLChTosRGB(this.copy());
    while (!current.isInside) {
      this.c -= change;
      this.c = Math.max(this.c, 0);

      if (this.c === 0) break;
      current = OkLCh.OkLChTosRGB(this);
    }
  }
 }