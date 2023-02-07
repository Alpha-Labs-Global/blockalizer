/*
import p5Types from "p5";
import GenericSketch from "../generic_sketch";

export interface ColoredTriangleOptions {
  numOfBoxes: number;
  smearing: number;
  opacity: number;
  strokeWidth: number;
}

export class ColoredTrianglesSketch extends GenericSketch {
  sizeOfBox: number; // size in px of each individual square
  alpha: number; // color opacity for each shape
  paletteIndex1: number; // randomly selected index from the palette table
  paletteIndex2: number; // randomly selected index from the palette table
  setStroke: boolean; // true or false if stroke should be set
  largest: number; // the maximum size of triangle to draw (2-10)
  factorIncrease: number; // factor of increase for noise
  mixTwoColors: boolean; // whether to mix two sets of colors or not
  totalNumberOfPalettes: number; // count of palettes to choose from
  colorsPerPaletteCount: number; // number of colors in a palette
  useDefaultBackground: boolean; // whether to use default background or override
  useDefaultStrokeColor: boolean; // whether to use default stroke color or override
  backgroundOverrideColor: p5Types.Color; // background color to use if overridden
  strokeOverrideColor: p5Types.Color; // stroke color to use if overridden
  strokeWidth: number; // stroke width to use

  factor: number;
  rez: number;
  sF: number;

  constructor(
    p5Instance: p5Types,
    canvasWidth: number,
    canvasHeight: number,
    colorTable: p5Types.Table,
    seedValue: number,
    opts: ColoredTriangleOptions
  ) {
    super(p5Instance, canvasWidth, canvasHeight, colorTable, seedValue);
    this.totalNumberOfPalettes = colorTable.rows.length;
    this.colorsPerPaletteCount = colorTable.getColumnCount() / 3; // always RGB

    // CONTROLS
    this.factorIncrease = 10000;
    this.setStroke = true;
    this.rez = this.p5.random(0.003, 0.01);
    this.mixTwoColors = false;
    // higher value creates overlayed effect of triangles
    // 2 would create only triangles
    this.largest = opts.smearing;
    let numberOfBoxesPerWidth = opts.numOfBoxes;
    this.alpha = opts.opacity; // lowers values create a layered effect
    this.useDefaultBackground = false; // uses the first RGB color from palette
    this.useDefaultStrokeColor = false; // uses the first RGB color from palette
    this.backgroundOverrideColor = this.p5.color(14, 15, 15);
    this.strokeOverrideColor = this.p5.color(255, 255, 255);
    this.strokeWidth = opts.strokeWidth;

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
    if (this.mixTwoColors) this.printColors(this.paletteIndex2);
    console.log(`stroke width: ${this.strokeWidth}px`);
  }

  draw() {
    if (!this.setStroke) {
      this.p5.noStroke();
    } else {
      if (this.useDefaultStrokeColor) this.fillDefaultStroke();
      else {
        this.p5.stroke(this.strokeOverrideColor);
        this.p5.strokeWeight(this.strokeWidth);
        let r = this.p5.red(this.strokeOverrideColor);
        let g = this.p5.green(this.strokeOverrideColor);
        let b = this.p5.blue(this.strokeOverrideColor);
        console.log(
          `stroke: rgb(${r},${g},${b}) %c  `,
          `background: rgb(${r},${g},${b});`
        );
      }
    }

    if (this.useDefaultBackground) {
      this.fillDefaultBackground();
    } else {
      let r = this.p5.red(this.backgroundOverrideColor);
      let g = this.p5.green(this.backgroundOverrideColor);
      let b = this.p5.blue(this.backgroundOverrideColor);
      console.log(
        `background: rgb(${r},${g},${b}) %c  `,
        `background: rgb(${r},${g},${b});`
      );
      this.p5.background(this.backgroundOverrideColor);
    }

    this.drawShapes();
  }

  fillDefaultStroke() {
    let [r, g, b] = [
      this.colorTable.getNum(this.paletteIndex1, 0),
      this.colorTable.getNum(this.paletteIndex1, 1),
      this.colorTable.getNum(this.paletteIndex1, 2),
    ];
    console.log(
      `stroke: rgb(${r},${g},${b}) %c  `,
      `background: rgb(${r},${g},${b});`
    );
    this.p5.stroke(r, g, b);
    this.p5.strokeWeight(this.strokeWidth);
  }

  fillDefaultBackground() {
    let r, g, b;
    if (this.mixTwoColors) {
      r =
        (this.colorTable.getNum(this.paletteIndex1, 0) +
          this.colorTable.getNum(this.paletteIndex2, 0)) /
        2;
      g =
        (this.colorTable.getNum(this.paletteIndex1, 1) +
          this.colorTable.getNum(this.paletteIndex2, 1)) /
        2;
      b =
        (this.colorTable.getNum(this.paletteIndex1, 2) +
          this.colorTable.getNum(this.paletteIndex2, 2)) /
        2;
    } else {
      r = this.colorTable.getNum(this.paletteIndex1, 0);
      g = this.colorTable.getNum(this.paletteIndex1, 1);
      b = this.colorTable.getNum(this.paletteIndex1, 2);
    }
    console.log(
      `background: rgb(${r},${g},${b}) %c  `,
      `background: rgb(${r},${g},${b});`
    );
    this.p5.background(r, g, b);
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
    let noiseColor1 = this.p5.noise(
      i * this.rez + this.factor,
      j * this.rez + this.factor
    );
    let noiseColor2 = this.p5.noise(
      i * this.rez + this.factor + this.factorIncrease,
      j * this.rez + this.factor + this.factorIncrease
    );

    let color1, color2;
    color1 = this.pickColors(this.paletteIndex1, noiseColor1);
    if (this.mixTwoColors) {
      color2 = this.pickColors(this.paletteIndex2, noiseColor2);
    } else {
      color2 = this.pickColors(this.paletteIndex1, noiseColor2);
    }

    // selects size of the triangle (number of blocks to occupy)
    let size = this.sizeOfBox * this.p5.floor(this.p5.random(1, this.largest));
    let n3 = this.p5.noise(
      i * this.rez + this.factor + 2 * this.factorIncrease,
      j * this.rez + this.factor + 2 * this.factorIncrease
    );
    this.drawDoublePalettePatterns(n3, i, j, color1, color2, size);
  }

  drawDoublePalettePatterns(
    n3: number,
    i: number,
    j: number,
    color1: p5Types.Color,
    color2: p5Types.Color,
    size: number
  ) {
    if (n3 < 0.25) {
      // ◣ Lower left triangle
      this.p5.fill(color1);
      this.p5.triangle(i, j, i + size, j + size, i, j + size);
      // ◥ Upper right triangle
      this.p5.fill(color2);
      this.p5.triangle(i, j, i + size, j + size, i + size, j);
    } else if (n3 < 0.5) {
      // ◢ Lower right triangle
      this.p5.fill(color1);
      this.p5.triangle(i + size, j, i + size, j + size, i, j + size);
      // ◤ Upper left triangle
      this.p5.fill(color2);
      this.p5.triangle(i, j + size, i, j, i + size, j);
    } else if (n3 < 0.75) {
      // ◥ Upper right triangle
      this.p5.fill(color1);
      this.p5.triangle(i, j, i + size, j + size, i + size, j);
      // ◣ Lower left triangle
      this.p5.fill(color2);
      this.p5.triangle(i, j, i + size, j + size, i, j + size);
    } else {
      // ◤ Upper left triangle
      this.p5.fill(color1);
      this.p5.triangle(i, j + size, i, j, i + size, j);
      // ◢ Lower right triangle
      this.p5.fill(color2);
      this.p5.triangle(i + size, j, i + size, j + size, i, j + size);
    }
  }

  pickColors(paletteIndex: number, n: number) {
    let colorIndex = 0;
    // this.colorsPerPaletteCount
    let col = this.p5.map(n, 0, 1, 0, 360);
    let dec = this.p5.fract(col / this.sF);
    // distribute this range among the palette
    let segmentSize = 1 / this.colorsPerPaletteCount;
    for (
      let rangeEnd = segmentSize, i = 0;
      rangeEnd <= 1;
      rangeEnd += segmentSize
    ) {
      if (dec <= rangeEnd) {
        colorIndex = i;
        break;
      }
      i++;
    }

    // selects random color from the palette for each r, g, b
    let r, g, b;
    r = this.colorTable.getNum(paletteIndex, colorIndex * 3);
    g = this.colorTable.getNum(paletteIndex, colorIndex * 3 + 1);
    b = this.colorTable.getNum(paletteIndex, colorIndex * 3 + 2);
    let color = this.p5.color(r, g, b);
    color.setAlpha(this.alpha);
    return color;
  }

  printColors(index: number) {
    let str = `palette ${index}: `;
    let css_arr = [];
    for (let i = 0; i < this.colorsPerPaletteCount; i++) {
      let r = this.colorTable.getNum(index, 3 * i);
      let g = this.colorTable.getNum(index, 3 * i + 1);
      let b = this.colorTable.getNum(index, 3 * i + 2);
      str += "%c  ";
      css_arr.push(`background: rgb(${r},${g},${b});`);
    }
    console.log(str, ...css_arr);
  }
}
*/

export {};
