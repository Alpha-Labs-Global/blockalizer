import p5Types from "p5";

export default class DrawColoredTriangles {
  p5: p5Types;
  canvasWidth: number;
  canvasHeight: number;
  colorTable: p5Types.Table;
  factor: number;
  size: number;
  largest: number;
  alph: number;
  sF: number;
  palette1: number;
  palette2: number;
  // let canv, col, col2, col3, col4, dec1, dec2, pos, n;
  // let r1, g1, b1, sF, seed;

  constructor(
    p5Instance: p5Types,
    canvasWidth: number,
    canvasHeight: number,
    colorTable: p5Types.Table
  ) {
    this.p5 = p5Instance;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.colorTable = colorTable;
    this.factor = 0;

    let numb = this.p5.floor(this.p5.random(3, 20));
    this.size = this.canvasWidth / numb;
    this.largest = this.p5.floor(this.p5.random(1, 10));
    this.alph = this.p5.random(120, 220);
    if (this.p5.random(15) < 1) {
      this.alph = 255;
    }

    this.sF = 0;
    this.palette1 = 0;
    this.palette2 = 0;
  }

  draw() {
    this.p5.noStroke();
    this.palette1 = this.p5.floor(this.p5.random(676));
    this.palette2 = this.p5.floor(this.p5.random(676));
    let r0 =
      this.colorTable.getNum(this.palette1, 0) +
      this.colorTable.getNum(this.palette2, 0) / 2;
    let g0 =
      (this.colorTable.getNum(this.palette1, 1) +
        this.colorTable.getNum(this.palette2, 1)) /
      2;
    let b0 =
      (this.colorTable.getNum(this.palette1, 2) +
        this.colorTable.getNum(this.palette2, 2)) /
      2;
    this.p5.background(r0, g0, b0);
    this.drawShapes();
  }

  drawShapes() {
    let rez = this.p5.random(0.003, 0.01);
    this.factor += 1000;
    this.sF = 360 / this.p5.random(2, 40);
    for (
      let i = this.canvasWidth;
      i > -this.size * this.largest;
      i -= this.size
    ) {
      for (
        let j = this.canvasHeight;
        j > -this.size * this.largest;
        j -= this.size
      ) {
        let n1 = this.p5.noise(i * rez + this.factor, j * rez + this.factor);
        let n2 = this.p5.noise(
          i * rez + this.factor + 10000,
          j * rez + this.factor + 10000
        );
        let n3 = this.p5.noise(
          i * rez + this.factor + 20000,
          j * rez + this.factor + 20000
        );
        let col3, col4, r1, g1, b1, r2, g2, b2;
        let col1 = this.p5.map(n1, 0, 1, 0, 360);
        let col2 = this.p5.map(n2, 0, 1, 0, 360);
        let dec1 = this.p5.fract(col1 / this.sF);
        let dec2 = this.p5.fract(col2 / this.sF);
        if (dec1 < 0.2) {
          col3 = 0;
        } else if (dec1 < 0.4) {
          col3 = 1;
        } else if (dec1 < 0.6) {
          col3 = 2;
        } else if (dec1 < 0.8) {
          col3 = 3;
        } else {
          col3 = 4;
        }
        if (dec2 < 0.2) {
          col4 = 0;
        } else if (dec2 < 0.4) {
          col4 = 1;
        } else if (dec2 < 0.6) {
          col4 = 2;
        } else if (dec2 < 0.8) {
          col4 = 3;
        } else {
          col4 = 4;
        }
        r1 = this.colorTable.getNum(this.palette1, col3 * 3);
        g1 = this.colorTable.getNum(this.palette1, col3 * 3 + 1);
        b1 = this.colorTable.getNum(this.palette1, col3 * 3 + 2);
        r2 = this.colorTable.getNum(this.palette2, col4 * 3);
        g2 = this.colorTable.getNum(this.palette2, col4 * 3 + 1);
        b2 = this.colorTable.getNum(this.palette2, col4 * 3 + 2);
        let size2 = this.size * this.p5.floor(this.p5.random(1, this.largest));
        if (n3 < 0.25) {
          this.p5.fill(r1, g1, b1, this.alph);
          this.p5.triangle(i, j, i + size2, j + size2, i, j + size2);
          this.p5.fill(r2, g2, b2, this.alph);
          this.p5.triangle(i, j, i + size2, j + size2, i + size2, j);
        } else if (n3 < 0.5) {
          this.p5.fill(r1, g1, b1, this.alph);
          this.p5.triangle(i + size2, j, i + size2, j + size2, i, j + size2);
          this.p5.fill(r2, g2, b2, this.alph);
          this.p5.triangle(i, j + size2, i, j, i + size2, j);
        } else if (n3 < 0.75) {
          this.p5.fill(r1, g1, b1, this.alph);
          this.p5.triangle(i, j, i + size2, j + size2, i + size2, j);
          this.p5.fill(r2, g2, b2, this.alph);
          this.p5.triangle(i, j, i + size2, j + size2, i, j + size2);
        } else {
          this.p5.fill(r1, g1, b1, this.alph);
          this.p5.triangle(i, j + size2, i, j, i + size2, j);
          this.p5.fill(r2, g2, b2, this.alph);
          this.p5.triangle(i + size2, j, i + size2, j + size2, i, j + size2);
        }
      }
    }
  }
}
