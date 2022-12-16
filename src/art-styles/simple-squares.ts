import p5Types from "p5";
import GenericSketch from "./generic_sketch";

export default class SimpleSquaresSketch extends GenericSketch {
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
    this.p5.fill(0);
    this.p5.strokeWeight(3);
    this.p5.rectMode(this.p5.CENTER);
    let space = 50;
    for (let x = 0; x < this.canvasWidth + 50; x += space) {
      for (let y = 0; y < this.canvasHeight + 50; y += space) {
        // line(x,y,x+space,y);
        // line(x,y,x,y+space);
        this.p5.square(x, y, 10);
        this.p5.square(x + space / 2, y + space / 2, 10);
      }
    }
  }
}
