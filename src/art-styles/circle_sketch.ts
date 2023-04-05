// fill scribble effect
// draw squares first

import p5 from "p5";
import p5Types, { Color } from "p5";
import GenericSketch from "./generic_sketch";
import Scribble from "./scribble";

export interface CircleSketchOptions {
  numOfBoxes: number;
  paletteIndex: number;
  noFill: boolean;
  removeBlocks: number;
  animate: boolean;
  paperIndex: number;
}

// const paper_links: Array<string> = [
//   "https://maroon-petite-shrew-493.mypinata.cloud/ipfs/QmYPmQdJQJLtvMpbXgeHjWzatnyVyCMxcpQsknR8AbYuR6",
//   "https://maroon-petite-shrew-493.mypinata.cloud/ipfs/QmXdCnGST3VXiBBGAtEGLu4h3WyjZhayLJD9d6cUYtdDaj",
//   "https://maroon-petite-shrew-493.mypinata.cloud/ipfs/Qmc1UUU1dkfnKQNAtuZEq5QEDNpwAj4DR5N8eP2VFVxxgk",
// ];

const paper_links: Array<string> = [
  "https://blockalizer-animation-template.s3.us-east-2.amazonaws.com/paper1.webp",
  "https://blockalizer-animation-template.s3.us-east-2.amazonaws.com/paper2.webp",
  "https://blockalizer-animation-template.s3.us-east-2.amazonaws.com/paper3.webp",
];

export class CircleSketch extends GenericSketch {
  backgroundColor: p5Types.Color; // background color to use if overridden
  sizeOfBox: number; // size in px of each individual square
  noFill: boolean; // setting it to false removes all color
  removeBlocks: number; // 0 means none, 1 is low, 2 is medium, 3 is high
  blockOrientation: Array<number>; // Inform the shape of the block. 1 is ◣ and 0 is ◢.
  colorPalette: Array<Color>; // Color Palette to be used
  paletteIndex: number; // Selected index from color table
  gridSize: number; // Size of the grid
  iterator: number; // iterate over bits
  triangleIterator: number;
  margins: number; // margin around sketch;
  sketchWidth: number;
  sketchHeight: number;
  allTriangles: Array<Array<Array<number>>>; // arrays of trianges to array of vertices to a pair
  scribble: Scribble;
  fillLines: Array<Array<Array<Array<Array<number | boolean>>>>>;
  fillIterator: number;
  lineIterator: number;
  firstLine: boolean;
  fillDone: boolean;
  triangleFillColors: Array<p5Types.Color>;
  animate: boolean;
  paper: p5Types.Image | null;
  strokeWidth: number; // stroke width to use
  strokeWidthOutline: number;
  strokeWidthFill: number;
  fillGap: number;
  strokeColor: p5.Color;
  paperIndex: number; // 0,1,2
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
    this.noFill = opts.noFill;
    this.removeBlocks = opts.removeBlocks;
    this.animate = opts.animate;

    const marginPct = 5;
    const squareSize = Math.min(this.canvasHeight, this.canvasWidth);
    // this.margins = (squareSize * marginPct) / 100;
    this.margins = 0;

    this.sketchHeight = squareSize;
    this.sketchWidth = squareSize;
    const lengthOfBlockOrientation = this.gridSize * this.gridSize;
    this.blockOrientation = blockBitsDecomp.slice(0, lengthOfBlockOrientation);

    this.paletteIndex = opts.paletteIndex;
    this.printColors(this.paletteIndex);
    this.colorPalette = this.generatePalette(this.paletteIndex);

    // this.p5.randomSeed(blockNumber);
    this.artTypeRandNum = Math.floor(this.p5.random(0, 100)) % 2;
    this.reseed();

    let bowing = 3;
    let roughness = 4;
    let maxOffset = 3;
    switch (this.gridSize) {
      case 3:
        bowing = 2;
        roughness = 3;
        maxOffset = 2;
        this.fillGap = 6;
        this.strokeWidthFill = 5;
        this.strokeWidth = 3;
        this.strokeWidthOutline = 3;
        break;
      case 6:
        bowing = 3;
        roughness = 2;
        maxOffset = 1;
        this.fillGap = 5;
        this.strokeWidthFill = 3.5;
        this.strokeWidth = 2;
        this.strokeWidthOutline = 2;
        break;
      case 9:
        bowing = 3;
        roughness = 2;
        maxOffset = 1;
        this.fillGap = 4;
        this.strokeWidthFill = 2.5;
        this.strokeWidth = 1;
        this.strokeWidthOutline = 1;
        break;
      case 12:
        bowing = 2;
        roughness = 2;
        maxOffset = 1;
        this.fillGap = 3.5;
        this.strokeWidthFill = 2;
        this.strokeWidth = 0.5;
        this.strokeWidthOutline = 0.5;
        break;
      default:
        bowing = 3;
        roughness = 3;
        maxOffset = 1;
        this.fillGap = 5;
        this.strokeWidthFill = 3;
        this.strokeWidth = 0.5;
        this.strokeWidthOutline = 0.5;
        break;
    }

    this.sizeOfBox = (squareSize - this.strokeWidthOutline) / this.gridSize;

    if (this.noFill) {
      this.strokeColor = this.p5.color(
        this.colorTable.getNum(this.paletteIndex, 0),
        this.colorTable.getNum(this.paletteIndex, 1),
        this.colorTable.getNum(this.paletteIndex, 2)
      );
      switch (this.gridSize) {
        case 3:
          this.strokeWidth = 12;
          break;
        case 6:
          this.strokeWidth = 8;
          break;
        case 9:
          this.strokeWidth = 6;
          break;
        case 12:
          this.strokeWidth = 4;
          break;
        default:
          this.strokeWidth = 1.5;
          break;
      }
    } else {
      this.strokeColor = this.p5.color(10);
    }

    this.iterator = 1;
    this.lineIterator = 0;
    this.firstLine = true;
    this.triangleIterator = 0;
    this.allTriangles = [];
    this.scribble = new Scribble(this.p5, bowing, roughness, maxOffset);
    this.fillLines = [];
    this.fillIterator = 0;
    this.fillDone = true;
    this.triangleFillColors = [];
    this.paper = null;

    this.paperIndex = opts.paperIndex;
  }

  setup(canvasParentRef: Element) {
    this.p5
      .createCanvas(this.canvasWidth, this.canvasHeight)
      .parent(canvasParentRef);

    this.p5.frameRate(120); // highest possible framerate
    this.p5.loadImage(
      paper_links[this.paperIndex],
      (img) => {
        // console.log("paper image loaded");
        // this.p5.image(img, 0, 0, this.canvasWidth, this.canvasHeight);
        // this.p5.tint(50);
        // this.p5.background(img);
        this.preview();
      },
      (e) => {
        console.log(e);
      }
    );
    this.p5.noLoop();
  }

  scaffolding() {
    console.log("> scaffolding: ");
    this.outline();
    this.selectColors();
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
    const strokeScale = this.strokeWidth;
    const stokeRez = 0.02;

    for (let i = 0; i < this.allTriangles.length; i++) {
      // first draw all vertices
      const vertices = this.allTriangles[i];
      for (let j = 1; j < vertices.length; j++) {
        const x1 = vertices[j - 1][0];
        const y1 = vertices[j - 1][1];
        const x2 = vertices[j][0];
        const y2 = vertices[j][1];
        let strokeOffset =
          strokeScale *
          this.p5.noise(x1 * stokeRez + 1000, y1 * stokeRez + 1000);
        this.p5.stroke(this.strokeColor);
        this.p5.strokeWeight(strokeOffset);
        this.p5.beginShape();
        this.p5.vertex(x1, y1);
        this.p5.vertex(x2, y2);
        this.p5.endShape();
      }
    }

    // then fill them
    for (let i = 0; i < this.fillLines.length; i++) {
      const fillLines = this.fillLines[i];
      const fillColor = this.triangleFillColors[i].toString();
      this.p5.push();
      this.p5.strokeWeight(this.strokeWidthFill);
      this.p5.noFill();
      this.p5.stroke(fillColor);
      for (let j = 0; j < fillLines.length; j++) {
        const lines = fillLines[j];

        const firstLine = lines[0];
        const secondLine = lines[1];
        this.p5.beginShape();
        for (let k = 0; k < firstLine.length; k++) {
          const x = Number(firstLine[k][0]);
          const y = Number(firstLine[k][1]);
          const curve = firstLine[k][2];
          if (curve) {
            this.p5.curveVertex(x, y);
          } else {
            this.p5.vertex(x, y);
          }
        }
        this.p5.endShape();

        this.p5.beginShape();
        for (let k = 0; k < secondLine.length; k++) {
          const x = Number(secondLine[k][0]);
          const y = Number(secondLine[k][1]);
          const curve = secondLine[k][2];
          if (curve) {
            this.p5.curveVertex(x, y);
          } else {
            this.p5.vertex(x, y);
          }
        }
        this.p5.endShape();
      }
      this.p5.pop();
    }
  }

  selectColors() {
    for (let j = 0; j < this.gridSize; j++) {
      for (let i = 0; i < this.gridSize; i++) {
        const noiseColor = this.p5.random();
        const color = this.pickColors(noiseColor);
        this.triangleFillColors.push(color);
      }
    }
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
    // this.allTriangles.push(triangleSteps);
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
