import p5Types from "p5";
import GenericSketch from "./generic_sketch";

export default class DiamondSketch extends GenericSketch {
  constructor(
    p5Instance: p5Types,
    canvasWidth: number,
    canvasHeight: number,
    colorTable: p5Types.Table,
    seedValue: number
  ) {
    super(p5Instance, canvasWidth, canvasHeight, colorTable, seedValue);
  }

  draw() {
    this.p5.background(255);
    let space = this.p5.random(30, 100);
    this.p5.fill(0);
    for (let x = 0; x < this.canvasWidth + 50; x += space) {
      for (let y = 0; y < this.canvasHeight + 50; y += space) {
        this.p5.triangle(x, y - 30, x - 3, y - 10, x + 3, y - 10);
        this.p5.triangle(x, y + 30, x - 3, y + 10, x + 3, y + 10);
        this.p5.triangle(x - 30, y, x - 10, y - 3, x - 10, y + 3);
        this.p5.triangle(x + 30, y, x + 10, y - 3, x + 10, y + 3);
      }
    }
    for (let x = space / 2; x < this.canvasWidth + 50; x += space) {
      for (let y = space / 2; y < this.canvasHeight + 50; y += space) {
        this.p5.triangle(x, y - 30, x - 3, y - 10, x + 3, y - 10);
        this.p5.triangle(x, y + 30, x - 3, y + 10, x + 3, y + 10);
        this.p5.triangle(x - 30, y, x - 10, y - 3, x - 10, y + 3);
        this.p5.triangle(x + 30, y, x + 10, y - 3, x + 10, y + 3);
      }
    }
  }
}
