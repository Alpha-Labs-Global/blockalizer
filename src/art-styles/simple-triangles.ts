import p5Types from "p5";
import GenericSketch from "./generic_sketch";

export default class SimpleTrianglesSketch extends GenericSketch {
  rez: number;
  size: number;

  constructor(
    p5Instance: p5Types,
    canvasWidth: number,
    canvasHeight: number,
    colorTable: p5Types.Table
  ) {
    super(p5Instance, canvasWidth, canvasHeight, colorTable);

    this.rez = 0.02;
    this.size = 50;
  }

  draw() {
    this.p5.colorMode(this.p5.HSB, 360, 100, 100, 100);
    const colorStart = this.p5.random(260);
    this.p5.background(255);
    let n1, n2;
    for (let i = 0; i < this.canvasWidth; i += this.size) {
      for (let j = 0; j < this.canvasHeight; j += this.size) {
        n1 = this.p5.noise(i * this.rez, j * this.rez);
        n2 = this.p5.noise(i * this.rez + 10000, j * this.rez + 10000);
        if (n1 < 0.5) {
          this.p5.fill(this.p5.floor(n1 * 100) + colorStart, 100, 100, 100);
          this.p5.triangle(
            i,
            j,
            i + this.size,
            j + this.size,
            i,
            j + this.size
          );
          this.p5.fill(
            this.p5.floor(100 - n1 * 100) + colorStart,
            100,
            100,
            100
          );
          this.p5.triangle(
            i,
            j,
            i + this.size,
            j + this.size,
            i + this.size,
            j
          );
        } else {
          this.p5.fill(this.p5.floor(n2 * 100) + colorStart, 100, 100, 100);
          this.p5.triangle(i + this.size, j, i, j + this.size, i, j);
          this.p5.fill(
            this.p5.floor(100 - n2 * 100) + colorStart,
            100,
            100,
            100
          );
          this.p5.triangle(
            i + this.size,
            j,
            i,
            j + this.size,
            i + this.size,
            j + this.size
          );
        }
      }
    }
  }
}
