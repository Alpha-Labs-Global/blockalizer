import p5Types from "p5";
import GenericSketch from "./generic_sketch";

export default class FlowfieldSketch extends GenericSketch {
  num: number;
  noiseScale: number;
  noiseStrength: number;
  particles: Array<number>;

  constructor(
    p5Instance: p5Types,
    canvasWidth: number,
    canvasHeight: number,
    colorTable: p5Types.Table
  ) {
    super(p5Instance, canvasWidth, canvasHeight, colorTable);

    this.num = 2000;
    this.noiseScale = 500;
    this.noiseStrength = 1;
    this.particles = [this.num];
  }

  draw() {
    // background(0);
    this.p5.fill(0, 10);
    this.p5.noStroke();
    this.p5.rect(0, 0, this.canvasWidth, this.canvasWidth);
    for (let i = 0; i < this.particles.length; i++) {
      //   this.particles[i].run();
    }
  }
}
