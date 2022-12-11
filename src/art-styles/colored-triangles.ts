import p5Types from "p5";
import GenericSketch from "./generic_sketch";

/* Palette has a collection of 5 colors and we consider two palettes

{
  R1, G1, B1, // used for background
  R2, G2, B2, //   randomly
  R3, G3, B3, //     used
  R4, G4, B4, //    in the
  R5, G5, B5  //    palette 1
}

{
  R1, G1, B1, // used for background
  R2, G2, B2, //   randomly
  R3, G3, B3, //     used
  R4, G4, B4, //    in the
  R5, G5, B5  //    palette 2
}
*/

export default class ColoredTriangleSketch extends GenericSketch {
  sizeOfBox: number; // size in px of each individual square
  alpha: number; // color opacity for each shape
  paletteIndex1: number; // randomly selected index from the palette table
  paletteIndex2: number; // randomly selected index from the palette table
  setStroke: boolean; // true or false if stroke should be set
  largest: number; // the maximum size of triangle to draw (2-10)
  factorIncrease: number; // factor of increase for noise
  mixTwoColors: boolean; // whether to mix two sets of colors or not
  setBackground: boolean; // whether to have a background or not; relevant when lower alpha
  totalNumberOfPalettes: number; // count of palettes to choose from

  factor: number;
  rez: number;
  sF: number;

  constructor(
    p5Instance: p5Types,
    canvasWidth: number,
    canvasHeight: number,
    colorTable: p5Types.Table,
    seedValue: number
  ) {
    super(p5Instance, canvasWidth, canvasHeight, colorTable, seedValue);
    this.totalNumberOfPalettes = colorTable.rows.length;

    // CONTROLS
    this.factorIncrease = 10000;
    this.setStroke = true;
    this.rez = this.p5.random(0.003, 0.01);
    this.mixTwoColors = false;
    this.setBackground = false;
    // higher value creates overlayed effect of triangles
    // 2 would create only triangles
    this.largest = 2;
    let numberOfBoxesPerWidth = 9;
    this.alpha = 255; // lowers values create a layered effect

    this.factor = 0;
    this.sizeOfBox = this.canvasWidth / numberOfBoxesPerWidth;
    this.sF = 360 / this.p5.random(2, 40);
    this.paletteIndex1 = this.p5.floor(
      this.p5.random(this.totalNumberOfPalettes)
    );
    this.paletteIndex2 = this.p5.floor(
      this.p5.random(this.totalNumberOfPalettes)
    );

    console.log(`size of box: ${this.sizeOfBox}px`);
    console.log("largest:", this.largest);
    console.log("alpha:", this.alpha);
    console.log("sF: ", this.sF);
    console.log(
      `Palette selected: ${this.paletteIndex1}, ${this.paletteIndex2}`
    );
    this.printColors(this.paletteIndex1);
    this.printColors(this.paletteIndex2);
  }

  draw() {
    if (!this.setStroke) {
      this.p5.noStroke();
    }

    if (this.setBackground) this.drawBackground();

    this.drawShapes();
  }

  drawBackground() {
    let r0 =
      (this.colorTable.getNum(this.paletteIndex1, 0) +
        this.colorTable.getNum(this.paletteIndex2, 0)) /
      2;
    let g0 =
      (this.colorTable.getNum(this.paletteIndex1, 1) +
        this.colorTable.getNum(this.paletteIndex2, 1)) /
      2;
    let b0 =
      (this.colorTable.getNum(this.paletteIndex1, 2) +
        this.colorTable.getNum(this.paletteIndex2, 2)) /
      2;
    console.log(
      `background: rgb(${r0},${g0},${b0}) %c  `,
      `background: rgb(${r0},${g0},${b0});`
    );
    this.p5.background(r0, g0, b0);
  }

  drawShapes() {
    console.log(`rez: ${this.rez} (0.003, 0.01), sF: ${this.sF}°`);
    for (
      let i = this.canvasWidth;
      i > -this.sizeOfBox * this.largest;
      i -= this.sizeOfBox
    ) {
      for (
        let j = this.canvasHeight;
        j > -this.sizeOfBox * this.largest;
        j -= this.sizeOfBox
      ) {
        this.drawShape(i, j);
      }
    }
  }

  drawShape(i: number, j: number) {
    // console.log(
    //   "noise1 (x,y): ",
    //   i * this.rez + this.factor,
    //   j * this.rez + this.factor
    // );
    let noiseColor1 = this.p5.noise(
      i * this.rez + this.factor,
      j * this.rez + this.factor
    );
    // console.log(
    //   "noise2 (x,y): ",
    //   i * this.rez + this.factor + 10000,
    //   j * this.rez + this.factor + 10000
    // );
    let noiseColor2 = this.p5.noise(
      i * this.rez + this.factor + this.factorIncrease,
      j * this.rez + this.factor + this.factorIncrease
    );

    let r1, g1, b1, r2, g2, b2;
    [r1, g1, b1] = this.pickColors(this.paletteIndex1, noiseColor1);
    [r2, g2, b2] = this.pickColors(this.paletteIndex2, noiseColor2);
    // console.log(
    //   `color1: rgb(${r1},${g1},${b1}) %c  `,
    //   `background: rgb(${r1},${g1},${b1});`
    // );
    // console.log(
    //   `color2: rgb(${r2},${g2},${b2}) %c  `,
    //   `background: rgb(${r2},${g2},${b2});`
    // );
    // [r1, g1, b1] = [255, 0, 0];
    // [r2, g2, b2] = [0, 255, 0];

    // selects size of the triangle (number of blocks to occupy)
    let size = this.sizeOfBox * this.p5.floor(this.p5.random(1, this.largest));
    let n3 = this.p5.noise(
      i * this.rez + this.factor + 2 * this.factorIncrease,
      j * this.rez + this.factor + 2 * this.factorIncrease
    );
    if (n3 < 0.25) {
      // ◣ Lower left triangle
      this.p5.fill(r1, g1, b1, this.alpha);
      this.p5.triangle(i, j, i + size, j + size, i, j + size);
      // ◥ Upper right triangle
      this.p5.fill(r2, g2, b2, this.alpha);
      this.p5.triangle(i, j, i + size, j + size, i + size, j);
    } else if (n3 < 0.5) {
      // ◢ Lower right triangle
      this.p5.fill(r1, g1, b1, this.alpha);
      this.p5.triangle(i + size, j, i + size, j + size, i, j + size);
      // ◤ Upper left triangle
      this.p5.fill(r2, g2, b2, this.alpha);
      this.p5.triangle(i, j + size, i, j, i + size, j);
    } else if (n3 < 0.75) {
      // ◥ Upper right triangle
      this.p5.fill(r1, g1, b1, this.alpha);
      this.p5.triangle(i, j, i + size, j + size, i + size, j);
      // ◣ Lower left triangle
      this.p5.fill(r2, g2, b2, this.alpha);
      this.p5.triangle(i, j, i + size, j + size, i, j + size);
    } else {
      // ◤ Upper left triangle
      this.p5.fill(r1, g1, b1, this.alpha);
      this.p5.triangle(i, j + size, i, j, i + size, j);
      // ◢ Lower right triangle
      this.p5.fill(r2, g2, b2, this.alpha);
      this.p5.triangle(i + size, j, i + size, j + size, i, j + size);
    }
  }

  pickColors(paletteIndex: number, n: number) {
    let colorIndex;
    let col = this.p5.map(n, 0, 1, 0, 360);
    let dec = this.p5.fract(col / this.sF);
    if (dec < 0.2) {
      colorIndex = 0;
    } else if (dec < 0.4) {
      colorIndex = 1;
    } else if (dec < 0.6) {
      colorIndex = 2;
    } else if (dec < 0.8) {
      colorIndex = 3;
    } else {
      colorIndex = 4;
    }

    // selects random color from the palette for each r, g, b
    let r, g, b;
    r = this.colorTable.getNum(paletteIndex, colorIndex * 3);
    g = this.colorTable.getNum(paletteIndex, colorIndex * 3 + 1);
    b = this.colorTable.getNum(paletteIndex, colorIndex * 3 + 2);
    return [r, g, b];
  }

  printColors(index: number) {
    let r1 = this.colorTable.getNum(index, 0);
    let g1 = this.colorTable.getNum(index, 1);
    let b1 = this.colorTable.getNum(index, 2);
    let r2 = this.colorTable.getNum(index, 3);
    let g2 = this.colorTable.getNum(index, 4);
    let b2 = this.colorTable.getNum(index, 5);
    let r3 = this.colorTable.getNum(index, 6);
    let g3 = this.colorTable.getNum(index, 7);
    let b3 = this.colorTable.getNum(index, 8);
    let r4 = this.colorTable.getNum(index, 9);
    let g4 = this.colorTable.getNum(index, 10);
    let b4 = this.colorTable.getNum(index, 11);
    let r5 = this.colorTable.getNum(index, 12);
    let g5 = this.colorTable.getNum(index, 13);
    let b5 = this.colorTable.getNum(index, 14);

    console.log(
      `palette ${index}: %c  %c  %c  %c  %c  `,
      `background: rgb(${r1},${g1},${b1});`,
      `background: rgb(${r2},${g2},${b2});`,
      `background: rgb(${r3},${g3},${b3});`,
      `background: rgb(${r4},${g4},${b4});`,
      `background: rgb(${r5},${g5},${b5});`
    );
  }
}
