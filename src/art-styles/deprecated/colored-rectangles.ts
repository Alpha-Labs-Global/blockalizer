/*
import p5Types from "p5";
import GenericSketch from "../generic_sketch";

export default class ColoredRectanglesSketch extends GenericSketch {
  size: number;
  widthMult: number;
  heightMult: number;

  constructor(
    p5Instance: p5Types,
    canvasWidth: number,
    canvasHeight: number,
    colorTable: p5Types.Table,
    seedValue: number
  ) {
    super(p5Instance, canvasWidth, canvasHeight, colorTable, seedValue);
    this.size = 30;
    this.widthMult = 4;
    this.heightMult = 4;
  }

  draw() {
    this.p5.angleMode(this.p5.DEGREES);
    this.p5.strokeWeight(3);
    //noStroke();
    let startR = this.p5.random(165);
    let startG = this.p5.random(165);
    let startB = this.p5.random(165);
    this.p5.background(startR + 45, startG + 45, startB + 45);
    for (
      let x = this.canvasWidth;
      x > -this.size * this.widthMult;
      x -= this.size
    ) {
      for (
        let y = this.canvasHeight;
        y > -this.size * this.heightMult;
        y -= this.size
      ) {
        this.p5.fill(
          this.p5.random(startR, startR + 90),
          this.p5.random(startG, startG + 90),
          this.p5.random(startB, startB + 90)
        );
        this.p5.push();
        this.p5.translate(x + this.size / 2, y + this.size / 2);
        //this.p5.rotate(floor(random(8))*45); //try commenting this out
        this.p5.rect(
          0,
          0,
          this.size * this.p5.floor(this.p5.random(1, this.widthMult)),
          this.size * this.p5.floor(this.p5.random(1, this.heightMult))
        );
        this.p5.pop();
      }
    }
  }
}

*/

export {};
