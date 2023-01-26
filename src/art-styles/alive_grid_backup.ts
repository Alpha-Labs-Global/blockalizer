// move left to right
// color swipe
// sheen effect
// change shape
// lightning

import p5Types, { Color } from "p5";
import GenericSketch from "./generic_sketch";

export interface AliveGridOptions {
  numOfBoxes: number;
  paletteIndex: number;
  noFill: boolean;
  removeBlocks: number;
}

export class AliveGridSketch extends GenericSketch {
  backgroundColor: p5Types.Color; // background color to use if overridden
  sizeOfBox: number; // size in px of each individual square
  strokeWidth: number; // stroke width to use
  noFill: boolean; // setting it to false removes all color
  removeBlocks: number; // 0 means none, 1 is low, 2 is medium, 3 is high
  drawHalf: boolean; // only draw half of the block (1 triangle only)
  blockOrientation: Array<number>; // Inform the shape of the block. 1 is ◣ and 0 is ◢.
  colorPalette: Array<Color>; // Color Palette to be used
  paletteIndex: number; // Selected index from color table
  gridSize: number; // Size of the grid
  blocksToRemove: Set<number>; // Set of blocks to remove
  iterations: number; // iterate over bits

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
    this.drawHalf = true;

    const lengthOfBlockOrientation = this.gridSize * this.gridSize;
    this.blockOrientation = blockBitsDecomp.slice(0, lengthOfBlockOrientation);

    this.sizeOfBox = this.canvasWidth / this.gridSize;
    this.paletteIndex = opts.paletteIndex;

    console.log(`size of box: ${this.sizeOfBox}px`);
    console.log(`Palette selected: ${this.paletteIndex}`);
    this.printColors(this.paletteIndex);

    this.colorPalette = this.generatePaletteWithOpacity(this.paletteIndex);

    this.blocksToRemove = this.computeBlocksToRemove();
    console.log("removed blocks: ", Array.from(this.blocksToRemove));
    this.reseed();

    console.log(`stroke width: ${this.strokeWidth}px`);

    this.iterations = 0;
  }

  setup(canvasParentRef: Element) {
    this.p5
      .createCanvas(this.canvasWidth, this.canvasHeight)
      .parent(canvasParentRef);

    // this.p5.noLoop();
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
    this.p5.background(this.backgroundColor);

    this.drawShapes(0);
    this.p5.frameRate(2);
  }

  draw() {
    this.iterations++;
    this.drawShapes(this.iterations);
  }

  drawShapes(startingIndex: number) {
    this.drawOuterEdge();
    let bitIndex = startingIndex;
    for (let j = 0; j < this.canvasHeight; j += this.sizeOfBox) {
      for (let i = 0; i < this.canvasWidth; i += this.sizeOfBox) {
        this.drawShape(i, j, bitIndex);
        bitIndex += 1;
      }
    }
  }

  drawShape(i: number, j: number, bitIndex: number) {
    let noiseColor = this.p5.random();
    let color = this.pickColors(noiseColor);

    const rez2 = 0.1;
    let n3 = this.p5.noise(i * rez2, j * rez2);

    if (this.shouldDrawBlock(bitIndex)) {
      this.drawDoublePalettePatterns(n3, i, j, color, this.sizeOfBox, bitIndex);
    }
  }

  shouldDrawBlock(bitIndex: number) {
    return !this.blocksToRemove.has(bitIndex);
  }

  drawOuterEdge() {
    this.p5.fill(0, 0, 0);
    this.p5.rect(1, 1, this.canvasWidth - 2, this.canvasHeight - 2);
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
    const noColor = this.p5.color(0, 0, 0, 0);
    const offset = 0;
    const startI = i + offset;
    const endI = i + size - offset;
    const startJ = j + offset;
    const endJ = j + size - offset;
    if (orientation === 0) {
      if (n3 < 0.5) {
        // ◢ Lower right triangle
        this.p5.fill(randomColor);
        this.p5.triangle(endI, startJ, endI, endJ, startI, endJ);
        // ◤ Upper left triangle
        this.p5.fill(noColor);
        this.p5.triangle(startI, endJ, startI, startJ, endI, startJ);
      } else {
        // ◢ Lower right triangle
        this.p5.fill(noColor);
        this.p5.triangle(endI, startJ, endI, endJ, startI, endJ);
        // ◤ Upper left triangle
        this.p5.fill(randomColor);
        this.p5.triangle(startI, endJ, startI, startJ, endI, startJ);
      }
    } else {
      if (n3 < 0.5) {
        // ◣ Lower left triangle
        this.p5.fill(randomColor);
        this.p5.triangle(startI, startJ, endI, endJ, startI, endJ);
        // ◥ Upper right triangle
        this.p5.fill(noColor);
        this.p5.triangle(startI, startJ, endI, endJ, endI, startJ);
      } else {
        // ◥ Upper right triangle
        this.p5.fill(randomColor);
        this.p5.triangle(startI, startJ, endI, endJ, endI, startJ);
        // ◣ Lower left triangle
        this.p5.fill(noColor);
        this.p5.triangle(startI, startJ, endI, endJ, startI, endJ);
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
}
