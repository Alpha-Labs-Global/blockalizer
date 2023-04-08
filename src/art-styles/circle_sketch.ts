// fill scribble effect
// draw squares first

import p5 from "p5";
import p5Types, { Color } from "p5";
import GenericSketch from "./generic_sketch";

export interface CircleSketchOptions {
  numOfBoxes: number;
  paletteIndex: number;
}

export class CircleSketch extends GenericSketch {
  backgroundColor: p5Types.Color; // background color to use if overridden
  sizeOfBox: number; // size in px of each individual square
  colorPalette: Array<Color>; // Color Palette to be used
  paletteIndex: number; // Selected index from color table
  gridSize: number; // Size of the grid
  margins: number; // margin around sketch;
  sketchWidth: number;
  sketchHeight: number;
  strokeWidth: number; // stroke width to use
  strokeWidthOutline: number;
  strokeWidthFill: number;
  artTypeRandNum: number; // 0, 1

  constructor(
    p5Instance: p5Types,
    canvasWidth: number,
    canvasHeight: number,
    colorTable: p5Types.Table,
    blockNumber: number,
    blockBits: string,
    opts: CircleSketchOptions
  ) {
    super(p5Instance, canvasWidth, canvasHeight, colorTable, blockNumber);
    const blockBitsDecomp = blockBits.split("").map((b) => Number(b));

    // CONTROLS
    this.gridSize = opts.numOfBoxes;
    this.backgroundColor = this.p5.color(14, 15, 15);
    this.strokeWidth = 1.5;

    const squareSize = Math.min(this.canvasHeight, this.canvasWidth);
    this.margins = 0;

    this.sketchHeight = squareSize;
    this.sketchWidth = squareSize;

    this.paletteIndex = opts.paletteIndex;
    this.printColors(this.paletteIndex);
    this.colorPalette = this.generatePalette(this.paletteIndex);

    // this.p5.randomSeed(blockNumber);
    this.artTypeRandNum = Math.floor(this.p5.random(0, 100)) % 2;
    this.reseed();

    switch (this.gridSize) {
      case 3:
        this.strokeWidthFill = 5;
        this.strokeWidth = 3;
        this.strokeWidthOutline = 3;
        break;
      case 6:
        this.strokeWidthFill = 3.5;
        this.strokeWidth = 2;
        this.strokeWidthOutline = 2;
        break;
      case 9:
        this.strokeWidthFill = 2.5;
        this.strokeWidth = 1;
        this.strokeWidthOutline = 1;
        break;
      case 12:
        this.strokeWidthFill = 2;
        this.strokeWidth = 0.5;
        this.strokeWidthOutline = 0.5;
        break;
      default:
        this.strokeWidthFill = 3;
        this.strokeWidth = 0.5;
        this.strokeWidthOutline = 0.5;
        break;
    }

    this.sizeOfBox = (squareSize - this.strokeWidthOutline) / this.gridSize;

  }

  setup(canvasParentRef: Element) {
    this.p5
      .createCanvas(this.canvasWidth, this.canvasHeight)
      .parent(canvasParentRef);

    this.p5.frameRate(120); // highest possible framerate
    this.preview();
    this.p5.noLoop();
  }

  scaffolding() {
    console.log("> scaffolding: ");
    this.outline();
   let bitIndex = 0;
    for (
      let j = this.margins;
      j < this.sketchHeight - this.margins;
      j += this.sizeOfBox
    ) {
      for (
        let i = this.margins;
        i < this.sketchWidth - this.margins;
        i += this.sizeOfBox
      ) {
        this.generateCircles(i, j);
        bitIndex += 1;
      }
    }
  }
  // draw() {
  //   // TODO: draw the shape from pre-generated data
  // }

  preview() {
    this.scaffolding();
  }

  generateCircles(i: number, j: number) {
    this.generateCircleOutline(i, j, this.sizeOfBox);
  }

  outline() {
    const strokeColor = this.pickColors(0);
    for (let j = this.margins; j < this.canvasHeight; j += this.sizeOfBox) {
      this.p5.push();
      this.p5.strokeWeight(this.strokeWidthOutline);
      this.p5.stroke(strokeColor);
      this.p5.line(0, j + this.strokeWidthOutline / 2, this.canvasWidth, j + this.strokeWidthOutline / 2);
      this.p5.pop();
    }
    for (let i = this.margins; i < this.canvasWidth; i += this.sizeOfBox) {
      this.p5.push();
      this.p5.strokeWeight(this.strokeWidthOutline);
      this.p5.stroke(strokeColor);
      this.p5.line(i + this.strokeWidthOutline / 2, 0, i + this.strokeWidthOutline / 2, this.canvasHeight);
      this.p5.pop();
    }
  }

  generateCircleOutline(
    i: number,
    j: number,
    size: number,
  ) {
    this.p5.push();
    const mainColor = this.pickColors(0);
    /**
     * 0 - filled full circle
     * 1 - unfilled full circle
     * 2 - facing right
     * 3 - facing left
     * 4 - facing top
     */
    const circleTypeRandNum = Math.floor(this.p5.random(0, 100)) % 5;

    /**
     * 0 - includes 1 circle
     * 1 - includes 4 circles
     */
    const margin = size / 8;
    const width = size - 2 * margin;
    const height = width;

    this.p5.strokeWeight(this.strokeWidthOutline * 2/ 3);
    this.p5.stroke(mainColor);
    if (this.artTypeRandNum == 0) {
      if (circleTypeRandNum == 0) {
        this.p5.fill(mainColor);
      } else {
        this.p5.fill(0, 0, 0, 0);
      }

      if (circleTypeRandNum < 2) {
        this.p5.ellipse(
          i + width / 2 + margin,
          j + height / 2 + margin,
          width,
          height
        );
      } else {
        const startAt = (circleTypeRandNum - 2) * this.p5.PI / 2 - this.p5.PI / 2;
        this.p5.arc(
          i + width / 2 + margin,
          j + height / 2 + margin,
          width,
          height,
          startAt,
          startAt + this.p5.PI
        );
      }
    } else {
      const subMargin = margin / 2;
      const subSize = width / 2;
      let startX = i;
      let startY = j;
      for (let subId = 0; subId < 4; subId ++){
        const noFillRand = Math.floor(this.p5.random(0, 100)) % 2;
        if (noFillRand == 0) {
          this.p5.fill(mainColor);
        } else {
          this.p5.fill(0, 0, 0, 0);
        }

        this.p5.ellipse(
          startX + subSize / 2 + subMargin,
          startY + subSize / 2 + subMargin,
          subSize,
          subSize
        );

        if (subId % 2 == 0) {
          startX = i + subSize + subMargin * 2;
        } else {
          startX = i;
        }

        if (Math.floor(subId + 1 / 2) == 0) {
          startY = j;
        } else {
          startY = j + subSize + subMargin * 2;
        }
      }
    }

    this.p5.pop();
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
