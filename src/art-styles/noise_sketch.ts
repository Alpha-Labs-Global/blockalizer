import p5Types from "p5";
import GenericSketch from "./generic_sketch";

export default class NoiseSketch extends GenericSketch {
  boxSize: number;
  rez: number;

  constructor(
    p5Instance: p5Types,
    canvasWidth: number,
    canvasHeight: number,
    colorTable: p5Types.Table,
    seedValue: number
  ) {
    super(p5Instance, canvasWidth, canvasHeight, colorTable, seedValue);

    this.boxSize = 1;
    this.rez = 0.01;
  }

  draw() {
    this.p5.noStroke();
    for (let x = 0; x < this.canvasWidth; x += this.boxSize) {
      for (let y = 0; y < this.canvasHeight; y += this.boxSize) {
        var c = 255 * this.p5.noise(this.rez * x, this.rez * y);
        this.p5.fill(c);
        this.p5.rect(x, y, this.boxSize, this.boxSize);
      }
    }
  }
}
