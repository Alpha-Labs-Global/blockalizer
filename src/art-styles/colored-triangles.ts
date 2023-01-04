import p5Types, { Color } from "p5";
import GenericSketch from "./generic_sketch";

/* Palette has a collection of 5 colors and we consider two palettes or one

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
  opacity: number;
  strokeWidth: number;
  paletteIndex: number;
  opacitySwitch: boolean;
  noFill: boolean;
  removeBlocks: number;
}

export class ColoredTrianglesSketch extends GenericSketch {
  sizeOfBox: number; // size in px of each individual square
  setStroke: boolean; // true or false if stroke should be set
  firstColorForStroke: boolean; // whether to use default stroke color or override
  backgroundOverrideColor: p5Types.Color; // background color to use if overridden
  strokeOverrideColor: p5Types.Color; // stroke color to use if overridden
  strokeWidth: number; // stroke width to use
  toggleOpacity: boolean; // when set to true it toggles opacity as opposed to color
  noFill: boolean; // setting it to false removes all color
  removeBlocks: number; // 0 means none, 1 is low, 2 is medium, 3 is high
  drawHalf: boolean; // only draw half of the block (1 triangle only)
  blockOrientation: Array<number>; // Inform the shape of the block. 1 is ◣ and 0 is ◢.
  colorPalette: Array<Color>; // Color Palette to be used
  paletteIndex: number; // Selected index from color table

  // DEPRECATED
  alpha: number; // color opacity for each shape

  constructor(
    p5Instance: p5Types,
    canvasWidth: number,
    canvasHeight: number,
    colorTable: p5Types.Table,
    blockNumber: number,
    blockBits: string,
    opts: ColoredTriangleOptions
  ) {
    super(p5Instance, canvasWidth, canvasHeight, colorTable, blockNumber);
    const blockBitsDecomp = blockBits.split("").map((b) => Number(b));

    // CONTROLS
    this.setStroke = true;
    // higher value creates overlayed effect of triangles
    // 2 would create only triangles
    let numberOfBoxesPerWidth = opts.numOfBoxes;
    this.alpha = opts.opacity; // lowers values create a layered effect
    this.firstColorForStroke = true; // uses the first RGB color from palette
    this.backgroundOverrideColor = this.p5.color(14, 15, 15);
    this.strokeOverrideColor = this.p5.color(255, 255, 255);
    this.strokeWidth = opts.strokeWidth;
    this.toggleOpacity = opts.opacitySwitch;
    this.noFill = opts.noFill;
    this.removeBlocks = opts.removeBlocks;
    this.drawHalf = true;

    const lengthOfBlockOrientation =
      numberOfBoxesPerWidth * numberOfBoxesPerWidth;
    this.blockOrientation = blockBitsDecomp.slice(0, lengthOfBlockOrientation);

    this.sizeOfBox = this.canvasWidth / numberOfBoxesPerWidth;
    this.paletteIndex = opts.paletteIndex;

    console.log(`size of box: ${this.sizeOfBox}px`);
    console.log("alpha:", this.alpha);
    console.log(`Palette selected: ${this.paletteIndex}`);
    this.printColors(this.paletteIndex);

    if (this.toggleOpacity) {
      this.colorPalette = this.generatePaletteWithOpacity(this.paletteIndex);
    } else {
      this.colorPalette = this.generatePalette(this.paletteIndex);
    }

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
    let bitIndex = 0;
    for (let i = this.canvasWidth; i > -this.sizeOfBox; i -= this.sizeOfBox) {
      for (
        let j = this.canvasHeight;
        j > -this.sizeOfBox;
        j -= this.sizeOfBox
      ) {
        this.drawShape(i, j, bitIndex);
        bitIndex += 1;
      }
    }
  }

  drawShape(i: number, j: number, bitIndex: number) {
    // const rez1 = 100;
    // let noiseColor = this.p5.noise(i * rez1, j * rez1);
    let noiseColor = this.p5.random();
    let color = this.pickColors(noiseColor);

    const rez2 = 0.1;
    let n3 = this.p5.noise(i * rez2, j * rez2);

    if (this.shouldDrawBlock()) {
      this.drawDoublePalettePatterns(n3, i, j, color, this.sizeOfBox, bitIndex);
    }
    this.drawOuterEdge();
  }

  shouldDrawBlock() {
    let percentRemoval = 0;
    switch (this.removeBlocks) {
      case 0:
        percentRemoval = 0;
        break;
      case 1:
        percentRemoval = 0.05;
        break;
      case 2:
        percentRemoval = 0.15;
        break;
      case 3:
        percentRemoval = 0.35;
        break;
    }
    return this.p5.random() > percentRemoval;
  }

  drawOuterEdge() {
    this.p5.fill(0, 0, 0, 0);
    this.p5.rect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  drawDoublePalettePatterns(
    n3: number,
    i: number,
    j: number,
    randomColor: p5Types.Color,
    size: number,
    bitIndex: number
  ) {
    // 1 is ◣ and 0 is ◢
    const orientation = this.blockOrientation[bitIndex];
    const noColor = this.p5.color(0, 0, 0, 0);
    if (orientation == 0) {
      if (n3 < 0.5) {
        // ◢ Lower right triangle
        this.p5.fill(randomColor);
        this.p5.triangle(i + size, j, i + size, j + size, i, j + size);
        // ◤ Upper left triangle
        this.p5.fill(noColor);
        this.p5.triangle(i, j + size, i, j, i + size, j);
      } else {
        // ◢ Lower right triangle
        this.p5.fill(noColor);
        this.p5.triangle(i + size, j, i + size, j + size, i, j + size);
        // ◤ Upper left triangle
        this.p5.fill(randomColor);
        this.p5.triangle(i, j + size, i, j, i + size, j);
      }
    } else {
      if (n3 < 0.5) {
        // ◣ Lower left triangle
        this.p5.fill(randomColor);
        this.p5.triangle(i, j, i + size, j + size, i, j + size);
        // ◥ Upper right triangle
        this.p5.fill(noColor);
        this.p5.triangle(i, j, i + size, j + size, i + size, j);
      } else {
        // ◥ Upper right triangle
        this.p5.fill(randomColor);
        this.p5.triangle(i, j, i + size, j + size, i + size, j);
        // ◣ Lower left triangle
        this.p5.fill(noColor);
        this.p5.triangle(i, j, i + size, j + size, i, j + size);
      }
    }
  }

  generatePaletteWithOpacity(paletteIndex: number) {
    let strokeColor = this.p5.color(
      this.colorTable.getNum(paletteIndex, 0),
      this.colorTable.getNum(paletteIndex, 1),
      this.colorTable.getNum(paletteIndex, 2)
    );
    let otherColor = this.p5.color(
      this.colorTable.getNum(paletteIndex, 3),
      this.colorTable.getNum(paletteIndex, 4),
      this.colorTable.getNum(paletteIndex, 5)
    );

    let colorList = [strokeColor];
    [0.2, 0.4, 0.6, 0.8, 1].map((opacity) => {
      const newColor = this.p5.color(
        this.p5.red(otherColor),
        this.p5.green(otherColor),
        this.p5.blue(otherColor)
      );
      newColor.setAlpha(opacity * 255);
      colorList.push(newColor);
    });
    return colorList;
  }

  generatePalette(paletteIndex: number) {
    const colorsPerPaletteCount = this.colorTable.getColumnCount() / 3; // always RGB
    let colorList = [];
    for (let i = 0; i < colorsPerPaletteCount; i++) {
      const newColor = this.p5.color(
        this.colorTable.getNum(paletteIndex, i * 3),
        this.colorTable.getNum(paletteIndex, i * 3 + 1),
        this.colorTable.getNum(paletteIndex, i * 3 + 2)
      );
      colorList.push(newColor);
    }
    return colorList;
  }

  pickColors(n: number) {
    // distribute this range among the palette
    let segmentSize = 1 / this.colorPalette.length;
    let colorIndex = 0;
    for (
      let endOfRange = segmentSize;
      endOfRange <= 1;
      endOfRange += segmentSize
    ) {
      if (n <= endOfRange) {
        break;
      }
      colorIndex++;
    }

    let selectedColor = this.colorPalette[colorIndex];
    console.log(
      "index: ",
      colorIndex,
      n,
      segmentSize,
      selectedColor.toString()
    );
    if (this.noFill) {
      selectedColor.setAlpha(0); // simplest way to have no fill
    }
    return selectedColor;
  }

  printColors(index: number) {
    let str = `palette ${index}: `;
    let css_arr = [];
    const colorsPerPaletteCount = this.colorTable.getColumnCount() / 3; // always RGB
    for (let i = 0; i < colorsPerPaletteCount; i++) {
      let r = this.colorTable.getNum(index, 3 * i);
      let g = this.colorTable.getNum(index, 3 * i + 1);
      let b = this.colorTable.getNum(index, 3 * i + 2);
      str += "%c  ";
      css_arr.push(`background: rgb(${r},${g},${b});`);
    }
    console.log(str, ...css_arr);
  }
}
