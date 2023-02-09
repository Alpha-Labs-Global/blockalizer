/*
import p5Types from "p5";
import GenericSketch from "./generic_sketch";

export default class CubeSketch extends GenericSketch {
  cubeSize: number;
  cubeSpeedX: number;
  cubeSpeedY: number;
  colorMatrix: Array<Array<Array<p5Types.Color>>>;
  gap: number;
  noOfCubes: number;
  paletteIndex: number;

  constructor(
    p5Instance: p5Types,
    canvasWidth: number,
    canvasHeight: number,
    colorTable: p5Types.Table,
    seedValue: number,
    opts: any
  ) {
    super(p5Instance, canvasWidth, canvasHeight, colorTable, seedValue);

    this.colorMatrix = [];
    this.gap = opts.gap;
    this.cubeSize = 40;
    this.cubeSpeedX = 0.01;
    this.cubeSpeedY = 0.01;
    this.noOfCubes = opts.cubeSize;
    this.paletteIndex = opts.paletteIndex;
  }

  setup(canvasParentRef: Element) {
    this.p5
      .createCanvas(this.canvasWidth, this.canvasHeight, this.p5.WEBGL)
      .parent(canvasParentRef);
    this.p5.camera(200, -200, -300, 0, 0, 0, 0, 1, 0);

    const r1 = this.colorTable.getNum(this.paletteIndex, 0);
    const g1 = this.colorTable.getNum(this.paletteIndex, 1);
    const b1 = this.colorTable.getNum(this.paletteIndex, 2);
    const r2 = this.colorTable.getNum(this.paletteIndex, 3);
    const g2 = this.colorTable.getNum(this.paletteIndex, 4);
    const b2 = this.colorTable.getNum(this.paletteIndex, 5);

    const c1 = this.p5.color(r1, g1, b1);
    const c2 = this.p5.color(r2, g2, b2);
    c2.setAlpha(255);
    const c3 = this.p5.color(r2, g2, b2);
    c3.setAlpha(204);
    const c4 = this.p5.color(r2, g2, b2);
    c4.setAlpha(153);
    const c5 = this.p5.color(r2, g2, b2);
    c5.setAlpha(102);
    const c6 = this.p5.color(r2, g2, b2);
    c6.setAlpha(51);
    const colorPalette = [c1, c2, c3, c4, c5, c6];

    this.p5.noStroke();
    this.colorMatrix = [];
    for (let i = 0; i < this.noOfCubes; i++) {
      let colorX = [];
      for (let j = 0; j < this.noOfCubes; j++) {
        let colorY = [];
        for (let k = 0; k < this.noOfCubes; k++) {
          const index = this.p5.random([0, 1, 2, 3, 4, 5]);
          const color = colorPalette[index] || this.p5.color(255, 255, 255);
          colorY.push(color);
        }
        colorX.push(colorY);
      }
      this.colorMatrix.push(colorX);
    }
  }

  draw() {
    this.p5.background(this.p5.color(14, 15, 15));
    this.p5.rotateY(this.p5.frameCount * this.cubeSpeedX);
    this.p5.rotateX(this.p5.frameCount * this.cubeSpeedY);
    this.p5.directionalLight(255, 255, 255, -500, 500, 500);
    for (let i = 0; i < this.noOfCubes; i++) {
      for (let j = 0; j < this.noOfCubes; j++) {
        for (let k = 0; k < this.noOfCubes; k++) {
          this.p5.push();
          this.p5.translate(
            (this.cubeSize + this.gap) * i -
              ((this.noOfCubes - 1) / 2) * (this.cubeSize + this.gap),
            (this.cubeSize + this.gap) * j -
              ((this.noOfCubes - 1) / 2) * (this.cubeSize + this.gap),
            (this.cubeSize + this.gap) * k -
              ((this.noOfCubes - 1) / 2) * (this.cubeSize + this.gap)
          );
          const color = this.colorMatrix[i][j][k];
          this.p5.ambientMaterial(color);
          // this.p5.specularMaterial(color);
          this.p5.box(this.cubeSize);
          this.p5.pop();
        }
      }
    }
  }
}
*/

export {};
