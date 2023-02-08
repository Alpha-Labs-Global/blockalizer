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

  preload() {}

  setup(canvasParentRef: Element) {
    this.p5
      .createCanvas(this.canvasWidth, this.canvasHeight)
      .parent(canvasParentRef);

    this.p5.noLoop();
  }

  draw() {}

  point(x: number, y: number) {
    this.p5.push();
    this.p5.stroke(255);
    this.p5.strokeWeight(5);
    this.p5.point(x, y);
    this.p5.pop();
  }

  jaggedLine(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    opts: any = {}
  ) {
    // The level of detail in the line in number of pixels between each point.
    const pixelsPerSegment = opts.pixelsPerSegment || 1;
    const angleScale = opts.noiseScale || 2 * this.p5.PI; // 45 degrees
    const angleRez = opts.angleRez || 0.01;

    let start;
    let end;

    start = this.p5.createVector(startX, startY);
    end = this.p5.createVector(endX, endY);

    let lineLength = start.dist(end);
    let segments = Math.floor(lineLength / pixelsPerSegment);
    let points = 1 + segments;

    let angle = this.p5.atan2(end.y - start.y, end.x - start.x);

    const intervalY = pixelsPerSegment * this.p5.sin(angle);
    const intervalX = pixelsPerSegment * this.p5.cos(angle);

    let vertices = [[start.x, start.y]];

    for (let i = 1; i < points; i++) {
      let x = start.x + i * intervalX;
      let y = start.y + i * intervalY;

      let angleOffset =
        angleScale * (this.p5.noise(x * angleRez, y * angleRez) - 0.5);

      let yOffset = pixelsPerSegment * this.p5.sin(angle + angleOffset);
      let xOffset = pixelsPerSegment * this.p5.cos(angle + angleOffset);

      vertices.push([x + xOffset, y + yOffset]);
    }
    return vertices;
  }

  jaggedLineFreeFlow(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    opts: any = {}
  ) {
    // The level of detail in the line in number of pixels between each point.
    const pixelsPerSegment = opts.pixelsPerSegment || 5;
    const angleScale = opts.noiseScale || this.p5.PI / 4; // 45 degrees
    const angleRez = opts.angleRez || 0.01;

    let start;
    let end;

    start = this.p5.createVector(startX, startY);
    end = this.p5.createVector(endX, endY);

    let lineLength = start.dist(end);
    let segments = Math.floor(lineLength / pixelsPerSegment);
    let points = 1 + segments;

    let angle;

    let vertices = [[start.x, start.y]];

    for (let i = 1; i < points; i++) {
      let x = vertices[i - 1][0];
      let y = vertices[i - 1][1];

      angle = this.p5.atan2(end.y - y, end.x - x);

      let angleOffset =
        angleScale * (this.p5.noise(x * angleRez, y * angleRez) - 0.5);

      let yOffset = pixelsPerSegment * this.p5.sin(angle + angleOffset);
      let xOffset = pixelsPerSegment * this.p5.cos(angle + angleOffset);

      vertices.push([x + xOffset, y + yOffset]);
    }
    return vertices;
  }

  drawCrookedCircle(
    radius: number,
    steps: number,
    centerX: number,
    centerY: number
  ) {
    const rez = 0.1;

    let xValues = [];
    let yValues = [];
    for (var i = 0; i < steps; i++) {
      let rad = radius + (radius / 10) * (this.p5.noise(i * rez) - 0.5);
      xValues[i] = centerX + rad * this.p5.cos((2 * this.p5.PI * i) / steps);
      yValues[i] = centerY + rad * this.p5.sin((2 * this.p5.PI * i) / steps);
    }
    this.p5.beginShape();
    for (let i = 0; i < xValues.length; i++) {
      this.p5.curveVertex(xValues[i], yValues[i]);
      this.point(xValues[i], yValues[i]);
    }
    this.p5.endShape(this.p5.CLOSE);
  }
}
