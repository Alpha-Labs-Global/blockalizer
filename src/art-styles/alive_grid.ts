// fill scribble effect
// draw squares first

import p5Types, { Color } from "p5";
import GenericSketch from "./generic_sketch";
import Scribble from "./scribble";

export interface AliveGridOptions {
  numOfBoxes: number;
  paletteIndex: number;
  noFill: boolean;
  removeBlocks: number;
}

const paper_links: Array<string> = [
  "https://maroon-petite-shrew-493.mypinata.cloud/ipfs/QmYPmQdJQJLtvMpbXgeHjWzatnyVyCMxcpQsknR8AbYuR6",
  "https://maroon-petite-shrew-493.mypinata.cloud/ipfs/QmXdCnGST3VXiBBGAtEGLu4h3WyjZhayLJD9d6cUYtdDaj",
  "https://maroon-petite-shrew-493.mypinata.cloud/ipfs/Qmc1UUU1dkfnKQNAtuZEq5QEDNpwAj4DR5N8eP2VFVxxgk",
];

export class AliveGridSketch extends GenericSketch {
  backgroundColor: p5Types.Color; // background color to use if overridden
  sizeOfBox: number; // size in px of each individual square
  strokeWidth: number; // stroke width to use
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
  sequencer: number;
  fillDone: boolean;

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
    this.margins = 10;

    this.sketchHeight = this.canvasHeight - 2 * this.margins;
    this.sketchWidth = this.canvasWidth - 2 * this.margins;
    const lengthOfBlockOrientation = this.gridSize * this.gridSize;
    this.blockOrientation = blockBitsDecomp.slice(0, lengthOfBlockOrientation);

    this.sizeOfBox = this.sketchWidth / this.gridSize;
    this.paletteIndex = opts.paletteIndex;

    console.log(`size of box: ${this.sizeOfBox}px`);
    console.log(`Palette selected: ${this.paletteIndex}`);
    this.printColors(this.paletteIndex);

    this.colorPalette = this.generatePaletteWithOpacity(this.paletteIndex);

    this.blocksToRemove = this.computeBlocksToRemove();
    console.log("removed blocks: ", Array.from(this.blocksToRemove));
    this.reseed();

    console.log(`stroke width: ${this.strokeWidth}px`);

    this.iterator = 1;
    this.lineIterator = 0;
    this.firstLine = true;
    this.triangleIterator = 0;
    this.allTriangles = [];
    this.scribble = new Scribble(this.p5);
    this.fillLines = [];
    this.fillIterator = 0;
    this.fillDone = true;

    // step 1: draw outer square
    // step 2: draw inner squares
    // step 3: draw triangle and fill each triangle on draw
    this.sequencer = 1;
  }

  setup(canvasParentRef: Element) {
    this.p5
      .createCanvas(this.canvasWidth, this.canvasHeight)
      .parent(canvasParentRef);

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

    r = this.p5.red(this.backgroundColor);
    g = this.p5.green(this.backgroundColor);
    b = this.p5.blue(this.backgroundColor);
    console.log(
      `background: rgb(${r},${g},${b}) %c  `,
      `background: rgb(${r},${g},${b});`
    );
    // this.p5.background(this.backgroundColor);

    this.p5.loadImage(
      paper_links[0],
      (img) => {
        console.log("paper image loaded");
        this.p5.image(img, 0, 0, this.canvasWidth, this.canvasHeight);
        this.p5.tint(50);
        this.p5.background(img);
        this.scaffolding();
        // this.drawShapes();
      },
      (e) => {
        console.log(e);
      }
    );
  }

  draw() {
    const strokeScale = 5;
    const stokeRez = 0.02;

    // go over all triangles
    if (this.triangleIterator < this.allTriangles.length) {
      const vertices = this.allTriangles[this.triangleIterator];

      // check if triangle needs filling
      if (!this.fillDone) {
        this.drawFill();
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
    if (this.fillIterator < fillLines.length) {
      const lines = fillLines[this.fillIterator];

      if (this.lineIterator == 0) {
        this.p5.push();
        this.p5.strokeWeight(3);
        this.p5.noFill();
        this.p5.stroke(0, 50, 180, 175);
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

  drawShapes() {
    // this.drawJaggedLine(20, 20, 20, 380);
    // this.drawJaggedLine(20, 20, 350, 20);
    // this.drawJaggedLine(20, 20, 380, 380);
    // this.drawJaggedSquare(20, 20, 300);
    // this.drawCrookedCircle(100, 10, 200, 200);
    // draw broken square
    // this.drawPerfectSquare();
    // const numOfSquares = 5;
    // const sizeOfSquare = this.canvasWidth / numOfSquares;
    // for (let i = 0; i < numOfSquares - 1; i++) {
    //   this.drawBrokenSquare(sizeOfSquare * i + 40, 10, sizeOfSquare);
    // }

    const opts = { fill: false };
    this.drawJaggedSquare(20, 20, 50, opts);

    // the x coordinates of the border points of the hachure
    var xCoords = [20, 70, 20];
    // the y coordinates of the border points of the hachure
    var yCoords = [20, 70, 70];
    // the gap between two hachure lines
    var gap = 5;
    // the angle of the hachure in degrees
    var angle = 45;
    // set the thikness of our hachure lines

    // fill the rect with a hachure
    this.fillLines.push(
      this.scribble.scribbleFilling(xCoords, yCoords, gap, angle)!
    );
    console.log(this.fillLines);
  }

  scaffolding() {
    this.drawOuterEdge();
    let bitIndex = 0;
    for (
      let j = this.margins;
      j < this.canvasHeight - this.margins;
      j += this.sizeOfBox
    ) {
      for (
        let i = this.margins;
        i < this.canvasWidth - this.margins;
        i += this.sizeOfBox
      ) {
        this.drawShape(i, j, bitIndex);
        bitIndex += 1;
      }
    }
  }

  drawShape(i: number, j: number, bitIndex: number) {
    let noiseColor = this.p5.random();
    let color = this.pickColors(noiseColor);

    const rez2 = 0.01;
    let n3 = this.p5.noise(i * rez2, j * rez2);

    if (this.shouldDrawBlock(bitIndex)) {
      this.drawDoublePalettePatterns(n3, i, j, color, this.sizeOfBox, bitIndex);
    }
  }

  shouldDrawBlock(bitIndex: number) {
    return !this.blocksToRemove.has(bitIndex);
  }

  drawOuterEdge() {
    this.p5.push();
    this.p5.noFill();
    // this.p5.strokeWeight(1.5);
    this.p5.rect(
      1 + this.margins,
      1 + this.margins,
      this.sketchWidth - 2,
      this.sketchHeight - 2
    );
    this.p5.pop();
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
    this.p5.strokeJoin(this.p5.BEVEL);
    const orientation = this.blockOrientation[bitIndex];
    const offset = 0;
    const startI = i + offset;
    const endI = i + size - offset;
    const startJ = j + offset;
    const endJ = j + size - offset;
    // this.p5.noFill();
    // this.p5.square(startI, startJ, size);
    const opts = { fillColor: randomColor, fill: true };
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
        this.pushFilling(endI, startJ, endI, endJ, startI, endJ);
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
        this.pushFilling(startI, endJ, startI, startJ, endI, startJ);
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
        this.pushFilling(startI, startJ, endI, endJ, startI, endJ);
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
        this.pushFilling(startI, startJ, endI, endJ, endI, startJ);
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

  drawJaggedTriangle(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    opts: any = {}
  ) {
    const strokeScale = opts.strokeScale || 2;
    const stokeRez = opts.strokeRez || 0.03;
    const fill = opts.fill || false;
    const fillColor = opts.fillColor || this.p5.color(0, 0, 255);

    const vertices1 = this.jaggedLineFreeFlow(x1, y1, x2, y2, opts);
    const vertices2 = this.jaggedLineFreeFlow(x2, y2, x3, y3, opts);
    const vertices3 = this.jaggedLineFreeFlow(x3, y3, x1, y1, opts);

    const vertices = vertices1.concat(vertices2).concat(vertices3);

    if (fill) {
      this.p5.push();
      this.p5.fill(fillColor);
      this.p5.noStroke();
      this.p5.beginShape();
      for (let i = 1; i < vertices.length; i++) {
        const x1 = vertices[i - 1][0];
        const y1 = vertices[i - 1][1];
        const x2 = vertices[i][0];
        const y2 = vertices[i][1];
        this.p5.vertex(x1, y1);
        this.p5.vertex(x2, y2);
      }
      this.p5.endShape();
      this.p5.pop();
    }

    for (let i = 1; i < vertices.length; i++) {
      const x1 = vertices[i - 1][0];
      const y1 = vertices[i - 1][1];
      const x2 = vertices[i][0];
      const y2 = vertices[i][1];
      let strokeOffset =
        strokeScale * this.p5.noise(x1 * stokeRez + 1000, y1 * stokeRez + 1000);
      this.p5.strokeWeight(strokeOffset);
      this.p5.beginShape();
      this.p5.vertex(x1, y1);
      this.p5.vertex(x2, y2);
      this.p5.endShape();
    }
  }

  drawJaggedSquare(
    startX: number,
    startY: number,
    length: number,
    opts: any = {}
  ) {
    const strokeScale = opts.strokeScale || 5;
    const stokeRez = opts.strokeRez || 0.03;
    const fill = opts.fill || false;
    const fillColor = opts.fillColor || this.p5.color(0, 0, 255);

    const endX = startX + length;
    const endY = startY + length;
    const vertices1 = this.jaggedLineFreeFlow(
      startX,
      startY,
      endX,
      startY,
      opts
    );
    const vertices2 = this.jaggedLineFreeFlow(endX, startY, endX, endY, opts);
    const vertices3 = this.jaggedLineFreeFlow(endX, endY, startX, endY, opts);
    const vertices4 = this.jaggedLineFreeFlow(
      startX,
      endY,
      startX,
      startY,
      opts
    );

    const vertices = vertices1
      .concat(vertices2)
      .concat(vertices3)
      .concat(vertices4);

    if (fill) {
      this.p5.push();
      this.p5.fill(fillColor);
      this.p5.noStroke();
      this.p5.beginShape();
      for (let i = 1; i < vertices.length; i++) {
        const x1 = vertices[i - 1][0];
        const y1 = vertices[i - 1][1];
        const x2 = vertices[i][0];
        const y2 = vertices[i][1];
        this.p5.vertex(x1, y1);
        this.p5.vertex(x2, y2);
      }
      this.p5.endShape();
      this.p5.pop();
    }

    for (let i = 1; i < vertices.length; i++) {
      const x1 = vertices[i - 1][0];
      const y1 = vertices[i - 1][1];
      const x2 = vertices[i][0];
      const y2 = vertices[i][1];
      let strokeOffset =
        strokeScale * this.p5.noise(x1 * stokeRez + 1000, y1 * stokeRez + 1000);
      this.p5.strokeWeight(strokeOffset);
      this.p5.beginShape();
      this.p5.vertex(x1, y1);
      this.p5.vertex(x2, y2);
      this.p5.endShape();
    }
  }

  drawJaggedLine(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    opts: any = {}
  ) {
    const strokeScale = opts.strokeScale || 3;
    const stokeRez = opts.strokeRez || 0.01;

    const vertices = this.jaggedLine(startX, startY, endX, endY, opts);

    // draw the actual line
    for (let i = 1; i < vertices.length; i++) {
      const x1 = vertices[i - 1][0];
      const y1 = vertices[i - 1][1];
      const x2 = vertices[i][0];
      const y2 = vertices[i][1];
      let strokeOffset =
        strokeScale * this.p5.noise(x1 * stokeRez + 1000, y1 * stokeRez + 1000);
      this.p5.strokeWeight(strokeOffset);
      this.p5.beginShape();
      this.p5.vertex(x1, y1);
      this.p5.vertex(x2, y2);
      this.p5.endShape();
    }
  }

  pushFilling(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ) {
    // the x coordinates of the border points of the hachure
    const xCoords = [x1, x2, x3];
    // the y coordinates of the border points of the hachure
    const yCoords = [y1, y2, y3];
    // the gap between two hachure lines
    const gap = 5;
    // the angle of the hachure in degrees
    const angle = 45;
    // set the thikness of our hachure lines

    // fill the rect with a hachure
    this.fillLines.push(
      this.scribble.scribbleFilling(xCoords, yCoords, gap, angle)!
    );
  }
}
