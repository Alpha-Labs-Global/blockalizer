// fill scribble effect
// draw squares first

import p5 from "p5";
import p5Types, { Color } from "p5";
import GenericSketch from "./generic_sketch";
import Scribble from "./scribble";

export interface AliveGridOptions {
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

export class AliveGridSketch extends GenericSketch {
  backgroundColor: p5Types.Color; // background color to use if overridden
  sizeOfBox: number; // size in px of each individual square
  noFill: boolean; // setting it to false removes all color
  removeBlocks: number; // 0 means none, 1 is low, 2 is medium, 3 is high
  blockOrientation: Array<number>; // Inform the shape of the block. 1 is ◣ and 0 is ◢.
  colorPalette: Array<Color>; // Color Palette to be used
  paletteIndex: number; // Selected index from color table
  gridSize: number; // Size of the grid
  blocksToRemove: Set<number>; // Set of blocks to remove
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

  constructor(
    p5Instance: p5Types,
    canvasWidth: number,
    canvasHeight: number,
    colorTable: p5Types.Table,
    blockNumber: number,
    blockBits: string,
    opts: AliveGridOptions
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
    this.margins = (squareSize * marginPct) / 100;

    this.sketchHeight = squareSize;
    this.sketchWidth = squareSize;
    const lengthOfBlockOrientation = this.gridSize * this.gridSize;
    this.blockOrientation = blockBitsDecomp.slice(0, lengthOfBlockOrientation);

    this.sizeOfBox = Math.ceil(squareSize - 2 * this.margins) / this.gridSize;
    this.paletteIndex = opts.paletteIndex;

    // console.log(`Palette selected: ${this.paletteIndex}`);
    this.printColors(this.paletteIndex);

    // this.colorPalette = this.generatePaletteWithOpacity(this.paletteIndex);
    this.colorPalette = this.generatePalette(this.paletteIndex);

    this.blocksToRemove = this.computeBlocksToRemove();
    // console.log("removed blocks: ", Array.from(this.blocksToRemove));
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
        this.strokeWidth = 1.5;
        this.strokeWidthOutline = 3;
        break;
      case 6:
        bowing = 3;
        roughness = 2;
        maxOffset = 1;
        this.fillGap = 5;
        this.strokeWidthFill = 3.5;
        this.strokeWidth = 1.5;
        this.strokeWidthOutline = 2;
        break;
      case 9:
        bowing = 3;
        roughness = 2;
        maxOffset = 1;
        this.fillGap = 4;
        this.strokeWidthFill = 2.5;
        this.strokeWidth = 1.5;
        this.strokeWidthOutline = 1;
        break;
      case 12:
        bowing = 2;
        roughness = 2;
        maxOffset = 1;
        this.fillGap = 3.5;
        this.strokeWidthFill = 2;
        this.strokeWidth = 1;
        this.strokeWidthOutline = 0.5;
        break;
      default:
        bowing = 3;
        roughness = 3;
        maxOffset = 1;
        this.fillGap = 5;
        this.strokeWidthFill = 3;
        this.strokeWidth = 1.5;
        this.strokeWidthOutline = 0.5;
        break;
    }

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
        this.p5.image(img, 0, 0, this.canvasWidth, this.canvasHeight);
        // this.p5.tint(50);
        this.p5.background(img);
        this.scaffolding();
        if (!this.animate) this.preview();
      },
      (e) => {
        console.log(e);
      }
    );

    // this.p5.image(this.paper!, 0, 0, this.canvasWidth, this.canvasHeight);
    // this.p5.background(this.paper!);
    // this.scaffolding();
    // if (!this.animate) this.preview();

    if (!this.animate) this.p5.noLoop();
  }

  draw() {
    const strokeScale = this.strokeWidth;
    const stokeRez = 0.02;

    // go over all triangles
    if (this.triangleIterator < this.allTriangles.length) {
      const vertices = this.allTriangles[this.triangleIterator];

      // check if triangle needs filling
      if (!this.fillDone) {
        if (this.noFill) {
          this.triangleIterator++;
          this.iterator = 1;
          this.fillDone = true;
        } else {
          this.drawFill();
        }
      } else {
        // draw triangle outline
        if (this.iterator < vertices.length) {
          const i = this.iterator;
          const x1 = vertices[i - 1][0];
          const y1 = vertices[i - 1][1];
          const x2 = vertices[i][0];
          const y2 = vertices[i][1];
          let strokeOffset =
            strokeScale *
            this.p5.noise(x1 * stokeRez + 1000, y1 * stokeRez + 1000);
          this.p5.strokeWeight(strokeOffset);
          this.p5.stroke(this.strokeColor);
          this.p5.beginShape();
          this.p5.vertex(x1, y1);
          this.p5.vertex(x2, y2);
          this.p5.endShape();

          this.iterator++;
        } else {
          // fill triangle
          this.fillDone = false;
        }
      }
    }
  }

  drawFill() {
    const fillLines = this.fillLines[this.triangleIterator];
    const fillColor = this.triangleFillColors[this.triangleIterator].toString();
    if (this.fillIterator < fillLines.length) {
      const lines = fillLines[this.fillIterator];

      if (this.lineIterator == 0) {
        this.p5.push();
        this.p5.strokeWeight(this.strokeWidthFill);
        this.p5.noFill();
        this.p5.stroke(fillColor);
        this.p5.beginShape();
      }

      let line;
      if (this.firstLine) {
        line = lines[0];
      } else {
        line = lines[1];
      }

      if (this.lineIterator < line.length) {
        const x = Number(line[this.lineIterator][0]);
        const y = Number(line[this.lineIterator][1]);
        const curve = line[this.lineIterator][2];
        // console.log("line details: ", x, y, curve);
        if (curve) {
          this.p5.curveVertex(x, y);
        } else {
          this.p5.vertex(x, y);
        }
        this.lineIterator++;
      } else {
        if (this.firstLine) {
          this.p5.endShape();
          this.p5.pop();
          this.lineIterator = 0;
          this.firstLine = false;
        } else {
          this.p5.endShape();
          this.p5.pop();
          this.lineIterator = 0;
          this.fillIterator++;
          this.firstLine = true;
        }
      }
    } else {
      // draw next triangle
      this.triangleIterator++;
      this.fillIterator = 0;
      this.iterator = 1;
      this.fillDone = true;
      // if (this.fillLines!.length > 0) this.p5.noLoop();
    }
  }

  scaffolding() {
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
        // this.point(j, i);
        this.generateTriangles(i, j, bitIndex);
        bitIndex += 1;
      }
    }
  }

  preview() {
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
        if (this.shouldDrawBlock(j * this.gridSize + i)) {
          const noiseColor = this.p5.random();
          const color = this.pickColors(noiseColor);
          this.triangleFillColors.push(color);
        }
      }
    }
  }

  generateTriangles(i: number, j: number, bitIndex: number) {
    const rez2 = 0.01;
    let n3 = this.p5.noise(i * rez2, j * rez2);

    if (this.shouldDrawBlock(bitIndex)) {
      // this.triangleFillColors.push(color); // extract out so not affected by random calls
      this.generateTriangleOutline(n3, i, j, this.sizeOfBox, bitIndex);
    }
  }

  shouldDrawBlock(bitIndex: number) {
    return !this.blocksToRemove.has(bitIndex);
  }

  outline() {
    for (let j = this.margins; j < this.canvasHeight; j += this.sizeOfBox) {
      this.p5.push();
      this.p5.strokeWeight(this.strokeWidthOutline);
      this.p5.stroke(0, 70);
      this.p5.line(0, j, this.canvasWidth, j);
      this.p5.pop();
    }
    for (let i = this.margins; i < this.canvasWidth; i += this.sizeOfBox) {
      this.p5.push();
      this.p5.strokeWeight(this.strokeWidthOutline);
      this.p5.stroke(0, 70);
      this.p5.line(i, 0, i, this.canvasHeight);
      this.p5.pop();
    }
  }

  generateTriangleOutline(
    n3: number,
    i: number,
    j: number,
    size: number,
    bitIndex: number
  ) {
    // 1 is ◣ and 0 is ◢
    this.p5.strokeJoin(this.p5.BEVEL);
    const orientation = this.blockOrientation[bitIndex];
    const offset = 0;
    const startI = i + offset;
    const endI = i + size - offset;
    const startJ = j + offset;
    const endJ = j + size - offset;
    let triangleSteps: any = [];
    if (orientation === 0) {
      if (n3 < 0.5) {
        // ◢ Lower right triangle
        triangleSteps = this.recordJaggedTriangle(
          endI,
          startJ,
          endI,
          endJ,
          startI,
          endJ
        );
        this.pushFilling(endI, startJ, endI, endJ, startI, endJ, false);
      } else {
        // ◤ Upper left triangle
        triangleSteps = this.recordJaggedTriangle(
          startI,
          endJ,
          startI,
          startJ,
          endI,
          startJ
        );
        this.pushFilling(startI, endJ, startI, startJ, endI, startJ, false);
      }
    } else {
      if (n3 < 0.5) {
        // ◣ Lower left triangle
        triangleSteps = this.recordJaggedTriangle(
          startI,
          startJ,
          endI,
          endJ,
          startI,
          endJ
        );
        this.pushFilling(startI, startJ, endI, endJ, startI, endJ, true);
      } else {
        // ◥ Upper right triangle
        triangleSteps = this.recordJaggedTriangle(
          startI,
          startJ,
          endI,
          endJ,
          endI,
          startJ
        );
        this.pushFilling(startI, startJ, endI, endJ, endI, startJ, true);
      }
    }
    this.allTriangles.push(triangleSteps);
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
    let opacityAdjustedColorlist = [0.2, 0.4, 0.6, 0.8, 1].map((opacity) => {
      const newColor = this.p5.color(
        this.p5.red(otherColor),
        this.p5.green(otherColor),
        this.p5.blue(otherColor)
      );
      newColor.setAlpha(opacity * 255);
      return newColor;
    });
    return colorList.concat(opacityAdjustedColorlist);
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

  computeBlocksToRemove() {
    let result = new Set<number>();
    const blowupAreaBasedOnSize: Map<number, number> = new Map([
      [3, 1],
      [6, 3],
      [9, 7],
      [12, 12],
    ]);
    const totalBlocks = this.gridSize * this.gridSize;
    const blowupArea = blowupAreaBasedOnSize.get(this.gridSize) || 0;
    const directions = [
      -1,
      1,
      this.gridSize,
      -this.gridSize,
      this.gridSize + 1,
      -this.gridSize - 1,
      -this.gridSize + 1,
      this.gridSize - 1,
    ];
    for (let j = 0; j < this.removeBlocks; j++) {
      let randomBlock = Math.floor(this.p5.random() * totalBlocks);
      let i = 0;
      while (i < blowupArea) {
        if (!result.has(randomBlock)) {
          result.add(randomBlock);
          i++;
        }

        let randomDirection =
          directions[Math.floor(this.p5.random() * directions.length)];

        randomBlock += randomDirection;
        if (randomBlock < 0) {
          randomBlock = totalBlocks - randomBlock;
        } else if (randomBlock > totalBlocks) {
          randomBlock = randomBlock - totalBlocks;
        }
      }
    }
    return result;
  }

  recordJaggedTriangle(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ) {
    const opts = {};
    const vertices1 = this.jaggedLineFreeFlow(x1, y1, x2, y2, opts);
    const vertices2 = this.jaggedLineFreeFlow(x2, y2, x3, y3, opts);
    const vertices3 = this.jaggedLineFreeFlow(x3, y3, x1, y1, opts);

    return vertices1.concat(vertices2).concat(vertices3);
  }

  pushFilling(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    leftTriangle: boolean
  ) {
    // the x coordinates of the border points of the hachure
    const xCoords = [x1, x2, x3];
    // the y coordinates of the border points of the hachure
    const yCoords = [y1, y2, y3];
    // the gap between two hachure lines
    const gap = this.fillGap;
    // the angle of the hachure in degrees
    let angle;
    if (leftTriangle) {
      angle = 45;
    } else {
      angle = 315;
    }

    // set the thikness of our hachure lines

    // fill the rect with a hachure
    this.fillLines.push(
      this.scribble.scribbleFilling(xCoords, yCoords, gap, angle)!
    );
  }
}
