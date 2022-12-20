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

export interface ColoredTriangleOptions {
  numOfBoxes: number;
  smearing: number;
  opacity: number;
  strokeWidth: number;
  paletteIndex: number;
  opacitySwitch: boolean;
  noFill: boolean;
}

export class ColoredTrianglesSketch extends GenericSketch {
  sizeOfBox: number; // size in px of each individual square
  alpha: number; // color opacity for each shape
  paletteIndex: number; // selected index from the palette table
  setStroke: boolean; // true or false if stroke should be set
  largest: number; // the maximum size of triangle to draw (2-10)
  factorIncrease: number; // factor of increase for noise
  totalNumberOfPalettes: number; // count of palettes to choose from
  colorsPerPaletteCount: number; // number of colors in a palette
  firstColorForStroke: boolean; // whether to use default stroke color or override
  backgroundOverrideColor: p5Types.Color; // background color to use if overridden
  strokeOverrideColor: p5Types.Color; // stroke color to use if overridden
  strokeWidth: number; // stroke width to use
  toggleOpacity: boolean; // when set to true it toggles opacity as opposed to color
  noFill: boolean; // setting it to false removes all color

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
    // higher value creates overlayed effect of triangles
    // 2 would create only triangles
    this.largest = opts.smearing;
    let numberOfBoxesPerWidth = opts.numOfBoxes;
    this.alpha = opts.opacity; // lowers values create a layered effect
    this.firstColorForStroke = true; // uses the first RGB color from palette
    this.backgroundOverrideColor = this.p5.color(14, 15, 15);
    this.strokeOverrideColor = this.p5.color(255, 255, 255);
    this.strokeWidth = opts.strokeWidth;
    this.toggleOpacity = opts.opacitySwitch;
    this.noFill = opts.noFill;

    this.factor = 0;
    this.sizeOfBox = this.canvasWidth / numberOfBoxesPerWidth;
    this.sF = 360 / this.p5.random(2, 40);
    this.paletteIndex = opts.paletteIndex;

    console.log(`size of box: ${this.sizeOfBox}px`);
    console.log("largest:", this.largest);
    console.log("alpha:", this.alpha);
    console.log("sF: ", this.sF);
    console.log(`Palette selected: ${this.paletteIndex}`);
    this.printColors(this.paletteIndex);

    console.log(`stroke width: ${this.strokeWidth}px`);
  }

  draw() {
    if (!this.setStroke) {
      this.p5.noStroke();
    } else {
      if (this.firstColorForStroke) this.fillDefaultStroke();
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

    let r = this.p5.red(this.backgroundOverrideColor);
    let g = this.p5.green(this.backgroundOverrideColor);
    let b = this.p5.blue(this.backgroundOverrideColor);
    console.log(
      `background: rgb(${r},${g},${b}) %c  `,
      `background: rgb(${r},${g},${b});`
    );
    this.p5.background(this.backgroundOverrideColor);

    this.drawShapes();
  }

  fillDefaultStroke() {
    let [r, g, b] = [
      this.colorTable.getNum(this.paletteIndex, 0),
      this.colorTable.getNum(this.paletteIndex, 1),
      this.colorTable.getNum(this.paletteIndex, 2),
    ];
    console.log(
      `stroke: rgb(${r},${g},${b}) %c  `,
      `background: rgb(${r},${g},${b});`
    );
    this.p5.stroke(r, g, b);
    this.p5.strokeWeight(this.strokeWidth);
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
    color1 = this.pickColors(this.paletteIndex, noiseColor1);
    color2 = this.pickColors(this.paletteIndex, noiseColor2);

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

    // if first color used for stroke that exclude it from the range
    let endOfFirstRange = this.firstColorForStroke
      ? 2 * segmentSize
      : segmentSize;
    let i = this.firstColorForStroke ? 1 : 0;
    for (
      let endOfRange = endOfFirstRange;
      endOfRange <= 1;
      endOfRange += segmentSize
    ) {
      if (dec <= endOfRange) {
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
    let alpha = this.pickAlpha();
    color.setAlpha(alpha);
    return color;
  }

  pickAlpha() {
    if (!this.toggleOpacity) {
      return this.alpha;
    }
    if (this.noFill) {
      return 0;
    }
    return 255 * this.p5.random([0.2, 0.4, 0.6, 0.8, 1]);
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
