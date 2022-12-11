import p5Types from "p5";
import GenericSketch from "./generic_sketch";

export default class TenPrintSketch extends GenericSketch {
  size: number;
  rez: number;

  constructor(
    p5Instance: p5Types,
    canvasWidth: number,
    canvasHeight: number,
    colorTable: p5Types.Table,
    seedValue: number
  ) {
    super(p5Instance, canvasWidth, canvasHeight, colorTable, seedValue);

    this.size = 25;
    this.rez = 0.008;
  }

  draw() {
    this.p5.background(255);
    for (let x = 0; x < this.canvasWidth; x += this.size + 0) {
      for (let y = 0; y < this.canvasHeight; y += this.size + 0) {
        let n = this.p5.noise(x * this.rez, y * this.rez) - 0.2;
        let c = this.p5.random(2);
        //c = n*4; //let noise decide
        if (c < 1) {
          this.p5.line(x, y, x + this.size, y + this.size);
        } //if (c<2)
        else {
          this.p5.line(x, y + this.size, x + this.size, y);
        }
        // else if (c<3){
        //   line(x,y,x,y+size)
        // }
        // else if (c<4){
        //   line(x,y,x+size,y)
        // }
      }
    }
  }
}
