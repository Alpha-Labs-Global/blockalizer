/*
import p5Types from "p5";
import GenericSketch from "../generic_sketch";

export default class AsciiSketch extends GenericSketch {
  f: number;
  col: Array<string>;

  constructor(
    p5Instance: p5Types,
    canvasWidth: number,
    canvasHeight: number,
    colorTable: p5Types.Table,
    seedValue: number
  ) {
    super(p5Instance, canvasWidth, canvasHeight, colorTable, seedValue);

    this.f = 40; //font size
    this.col = ["red", "yellow", "green", "orange", "purple"];
  }

  draw() {
    this.p5.background(0);
    //background(random(255));
    this.p5.textSize(this.f);
    for (let x = 0; x < this.canvasWidth + this.f; x += this.f * 0.7) {
      for (let y = 0; y < this.canvasHeight + this.f; y += this.f * 1.2) {
        let c = this.p5.random(3);
        this.p5.stroke(this.col[this.p5.floor(this.p5.random(5))]);
        this.p5.fill(this.col[this.p5.floor(this.p5.random(5))]);
        // let colSel = this.col[this.p5.floor(this.p5.random(5))];
        // this.p5.stroke(colSel);
        // this.p5.fill(colSel);
        if (c < 1) {
          this.p5.text("░", x, y);
        } else if (c < 2) {
          this.p5.text("▒", x, y);
        } else if (c < 3) {
          this.p5.text("▓", x, y);
        } else if (c < 4) {
          this.p5.text("█", x, y);
        }
      }
    }
  }
}
*/

export {};
