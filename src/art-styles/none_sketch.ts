import p5Types from "p5";
import GenericSketch from "./generic_sketch";

export default class NoneSketch extends GenericSketch {
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
    this.p5.strokeWeight(3);
    this.p5.stroke(255, 255, 255);
    this.p5.fill(0, 0, 0, 0);
    // setting some offsets so to show everything on the canvas
    this.p5.rect(1, 1, this.canvasWidth - 2, this.canvasHeight - 2);
    this.p5.triangle(
      this.canvasWidth - 2,
      1,
      1,
      this.canvasHeight - 2,
      this.canvasWidth - 2,
      this.canvasHeight - 2
    );
  }
}
