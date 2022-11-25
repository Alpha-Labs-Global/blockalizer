import p5Types from "p5";

export default class DrawWheel {
  p5: p5Types;
  canvasWidth: number;
  canvasHeight: number;
  palette: Array<p5Types.Color>;

  constructor(
    p5Instance: p5Types,
    canvasWidth: number,
    canvasHeight: number,
    palette: Array<p5Types.Color>
  ) {
    this.p5 = p5Instance;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.palette = palette;
  }

  crystalSize: number = 350;
  sides: number = 6;

  draw() {
    this.p5.rectMode(this.p5.CENTER);
    this.testLines();
    //outlineShape()
    this.simpleLines();
  }

  simpleLines() {
    const stepsOut = 8;
    const numSteps = this.randomSelectTwo()
      ? stepsOut
      : Math.floor(stepsOut * 1.25);
    const step = this.crystalSize / 2 / numSteps;
    const start = Math.floor(this.p5.random(0, numSteps));
    const stop = Math.floor(this.p5.random(start, numSteps + 1));

    let numShapes = this.randomSelectTwo() ? this.sides : this.sides * 2;
    const strokeColor = this.getRandomFromPalette();
    const weight = this.randomSelectTwo() ? 1 : 3;

    const angle = (2 * this.p5.PI) / numShapes;

    this.p5.noFill();
    this.p5.stroke(strokeColor);
    this.p5.strokeWeight(weight);
    this.p5.push();
    this.p5.translate(this.canvasWidth / 2, this.canvasHeight / 2);
    for (let i = 0; i < numShapes; i++) {
      this.p5.line(start * step, 0, stop * step, 0);
      this.p5.rotate(angle);
    }
    this.p5.pop();
  }

  outlineShape() {
    const strokeColor = this.getRandomFromPalette();
    const weight = this.randomSelectTwo() ? 1 : 3;
    const hexagonTrue = this.randomSelectTwo();

    this.p5.stroke(strokeColor);
    this.p5.strokeWeight(weight);
    this.p5.push();
    this.p5.translate(this.canvasWidth / 2, this.canvasHeight / 2);
    if (hexagonTrue) {
      this.hexagon(0, 0, this.crystalSize / 2);
    } else {
      this.p5.ellipse(0, 0, this.crystalSize, this.crystalSize);
    }
    this.p5.pop();
  }

  testLines() {
    let numShapes = this.randomSelectTwo() ? this.sides : this.sides * 2;
    const strokeColor = this.getRandomFromPalette();

    this.p5.noFill();
    this.p5.stroke(this.palette[0]);
    this.p5.strokeWeight(1);
    this.p5.push();
    this.p5.translate(this.canvasWidth / 2, this.canvasHeight / 2);
    this.p5.ellipse(0, 0, this.crystalSize, this.crystalSize);
    this.p5.stroke(strokeColor);
    const angle = (2 * this.p5.PI) / numShapes;
    for (let i = 0; i < numShapes; i++) {
      this.p5.line(0, 0, 0, this.crystalSize / 2);
      this.p5.rotate(angle);
    }
    this.p5.pop();
  }

  hexagon(posX: number, posY: number, radius: number) {
    const rotAngle = this.p5.PI / 3;
    this.p5.beginShape();
    for (let i = 0; i < 6; i++) {
      const thisVertex = this.pointOnCircle(posX, posY, radius, i * rotAngle);
      this.p5.vertex(thisVertex.x, thisVertex.y);
    }
    this.p5.endShape(this.p5.CLOSE);
  }

  pointOnCircle(posX: number, posY: number, radius: number, angle: number) {
    const x = posX + radius * this.p5.cos(angle);
    const y = posY + radius * this.p5.sin(angle);
    return this.p5.createVector(x, y);
  }

  randomSelectTwo() {
    const rando = this.p5.random(1);
    if (rando > 0.5) {
      return true;
    } else {
      return false;
    }
  }

  getRandomFromPalette() {
    const rando2 = Math.floor(this.p5.random(0, this.palette.length));
    return this.palette[rando2];
  }
}
