import p5Types from "p5";

export default class GenericSketch {
  p5: p5Types;
  canvasWidth: number;
  canvasHeight: number;
  colorTable: p5Types.Table;
  seedValue: number;

  constructor(
    p5Instance: p5Types,
    canvasWidth: number,
    canvasHeight: number,
    colorTable: p5Types.Table,
    seedValue: number
  ) {
    this.p5 = p5Instance;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.colorTable = colorTable;
    this.seedValue = seedValue;

    this.p5.randomSeed(this.seedValue);
    this.p5.noiseSeed(this.seedValue);
  }

  reseed() {
    this.p5.randomSeed(this.seedValue);
  }

  setup(canvasParentRef: Element) {
    this.p5
      .createCanvas(this.canvasWidth, this.canvasHeight)
      .parent(canvasParentRef);

    this.p5.noLoop();
  }

  draw() {}
}
