import p5Types from "p5";
import GenericSketch from "./generic_sketch";

export default class NoiseSketch extends GenericSketch {
  boxSize: number;
  rez: number; // resolution
  options: number;

  constructor(
    p5Instance: p5Types.Graphics,
    canvasWidth: number,
    canvasHeight: number,
    colorTable: p5Types.Table,
    blockNumber: number,
    blockBits: string,
    opts: any
  ) {
    super(p5Instance, canvasWidth, canvasHeight, colorTable, blockNumber);
    console.log("bits", blockBits);

    this.options = 10;
    // const numOfBoxes = opts.numOfBoxes;
    const numOfBoxes = 12;
    this.boxSize = canvasHeight / numOfBoxes;
    this.rez = 0.1;
  }

  draw() {
    this.p5.noStroke();
    let i = 0;
    for (let y = 0; y < this.canvasHeight - this.boxSize; y += this.boxSize) {
      for (let x = 0; x < this.canvasWidth - this.boxSize; x += this.boxSize) {
        let noiseValue = this.p5.noise(x, y);
        // F = 1 / (options - 1)
        // 2 -- 0, 1
        // 3 -- 0, 0.5, 1
        // 4 -- 0, 0.33, 0.67, 1
        // 5 -- 0, 0.25, 0.5, 0.75, 1
        let chunkSize = 1 / this.options;
        let bucket = 0;
        for (let chunkEnd = chunkSize; chunkEnd <= 1; chunkEnd += chunkSize) {
          if (noiseValue < chunkEnd) {
            break;
          }
          bucket += 1 / (this.options - 1);
        }
        this.p5.fill(255 * bucket);
        this.p5.rect(x, y, this.boxSize, this.boxSize);
        this.p5.fill(255);
        // const bucketText = bucket.toFixed(2);
        const bucketText = i.toString();
        this.p5.text(bucketText, x, y + this.boxSize / 2);
        i++;
      }
    }
    this.p5.stroke(255, 0, 0);
    this.p5.strokeWeight(3);
    this.p5.noFill();
    this.p5.rect(0, 0, this.canvasWidth, this.canvasHeight);
    this.p5.rect(
      0,
      0,
      this.canvasWidth - 3 * this.boxSize,
      this.canvasHeight - 3 * this.boxSize
    );
    this.p5.rect(
      0,
      0,
      this.canvasWidth - 6 * this.boxSize,
      this.canvasHeight - 6 * this.boxSize
    );
    this.p5.rect(
      0,
      0,
      this.canvasWidth - 9 * this.boxSize,
      this.canvasHeight - 9 * this.boxSize
    );
  }
}
