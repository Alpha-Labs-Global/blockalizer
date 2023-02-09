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
  gridSize: number; // Size of the grid
  blocksToRemove: Set<number>; // Set of blocks to remove

  // DEPRECATED
  alpha: number; // color opacity for each shape

  constructor(
    p5Instance: p5Types.Graphics,
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
    this.gridSize = opts.numOfBoxes;
    this.alpha = opts.opacity; // lowers values create a layered effect
    this.firstColorForStroke = true; // uses the first RGB color from palette
    this.backgroundOverrideColor = this.p5.color(14, 15, 15);
    this.strokeOverrideColor = this.p5.color(255, 255, 255);
    this.strokeWidth = opts.strokeWidth;
    this.toggleOpacity = opts.opacitySwitch;
    this.noFill = opts.noFill;
    this.removeBlocks = opts.removeBlocks;
    this.drawHalf = true;

    const lengthOfBlockOrientation = this.gridSize * this.gridSize;
    this.blockOrientation = blockBitsDecomp.slice(0, lengthOfBlockOrientation);

    this.sizeOfBox = this.canvasWidth / this.gridSize;
    this.paletteIndex = opts.paletteIndex;

    // console.log(`size of box: ${this.sizeOfBox}px`);
    // console.log("alpha:", this.alpha);
    // console.log(`Palette selected: ${this.paletteIndex}`);
    this.printColors(this.paletteIndex);

    if (this.toggleOpacity) {
      this.colorPalette = this.generatePaletteWithOpacity(this.paletteIndex);
    } else {
      this.colorPalette = this.generatePalette(this.paletteIndex);
    }

    this.blocksToRemove = this.computeBlocksToRemove2();
    this.reseed();

    // console.log(`stroke width: ${this.strokeWidth}px`);
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
        // console.log(
        //   `stroke: rgb(${r},${g},${b}) %c  `,
        //   `background: rgb(${r},${g},${b});`
        // );
      }
    }

    let r = this.p5.red(this.backgroundOverrideColor);
    let g = this.p5.green(this.backgroundOverrideColor);
    let b = this.p5.blue(this.backgroundOverrideColor);
    // console.log(
    //   `background: rgb(${r},${g},${b}) %c  `,
    //   `background: rgb(${r},${g},${b});`
    // );
    this.p5.background(this.backgroundOverrideColor);

    this.drawShapes();
  }

  fillDefaultStroke() {
    let [r, g, b] = [
      this.colorTable.getNum(this.paletteIndex, 0),
      this.colorTable.getNum(this.paletteIndex, 1),
      this.colorTable.getNum(this.paletteIndex, 2),
    ];
    // console.log(
    //   `stroke: rgb(${r},${g},${b}) %c  `,
    //   `background: rgb(${r},${g},${b});`
    // );
    this.p5.stroke(r, g, b);
    this.p5.strokeWeight(this.strokeWidth);
  }

  drawShapes() {
    let bitIndex = 0;
    for (let j = 0; j < this.canvasHeight; j += this.sizeOfBox) {
      for (let i = 0; i < this.canvasWidth; i += this.sizeOfBox) {
        this.drawShape(i, j, bitIndex);
        // const bucketText = bitIndex.toString();
        // this.p5.push();
        // this.p5.fill(255);
        // this.p5.noStroke();
        // this.p5.text(bucketText, i, j + this.sizeOfBox / 4);
        // this.p5.pop();
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

    if (this.shouldDrawBlock(bitIndex)) {
      this.drawDoublePalettePatterns(n3, i, j, color, this.sizeOfBox, bitIndex);
    }
    this.drawOuterEdge();
  }

  shouldDrawBlock(bitIndex: number) {
    return !this.blocksToRemove.has(bitIndex);
    // let percentRemoval = 0;
    // switch (this.removeBlocks) {
    //   case 0:
    //     percentRemoval = 0;
    //     break;
    //   case 1:
    //     percentRemoval = 0.1;
    //     break;
    //   case 2:
    //     percentRemoval = 0.2;
    //     break;
    //   case 3:
    //     percentRemoval = 0.3;
    //     break;
    // }
    // return this.p5.random() > percentRemoval;
  }

  drawOuterEdge() {
    this.p5.fill(0, 0, 0, 0);
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

  computeBlocksToRemove(): Set<number> {
    let result = new Set<number>();
    const blockRemovalMatrix = [
      [0, 1, 2, 3],
      [0, 3, 6, 9],
      [0, 7, 14, 21],
      [0, 12, 24, 36],
    ];
    let countOfBlockToRemove;
    switch (this.gridSize) {
      case 3:
        countOfBlockToRemove = blockRemovalMatrix[0][this.removeBlocks];
        break;
      case 6:
        countOfBlockToRemove = blockRemovalMatrix[1][this.removeBlocks];
        break;
      case 9:
        countOfBlockToRemove = blockRemovalMatrix[2][this.removeBlocks];
        break;
      case 12:
        countOfBlockToRemove = blockRemovalMatrix[3][this.removeBlocks];
        break;
      default:
        countOfBlockToRemove = 0;
        break;
    }
    const rez = 0.1;
    let noiseGrid: Array<number> = [];
    for (let i = 0; i < this.gridSize; i++) {
      let noiseRow: Array<number> = [];
      for (let j = 0; j < this.gridSize; j++) {
        noiseRow.push(this.p5.noise(i * rez, j * rez));
      }
      noiseGrid = noiseGrid.concat(noiseRow);
    }

    let i = 0;
    while (i < countOfBlockToRemove) {
      const max = Math.max(...noiseGrid);
      const index = noiseGrid.indexOf(max);
      noiseGrid[index] = 0;
      result.add(index);
      i++;
    }
    return result;
  }

  computeBlocksToRemove2() {
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
