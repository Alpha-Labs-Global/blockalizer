/*

import p5 from "p5";
import p5Types from "p5";
import GenericSketch from "../generic_sketch";

class Particle {
  loc: p5Types.Vector;
  dir: p5Types.Vector;
  speed: number;
  p5: p5Types;
  noiseScale: number;
  noiseStrength: number;
  width: number;
  height: number;

  constructor(
    _loc: p5Types.Vector,
    _dir: p5Types.Vector,
    _speed: number,
    p5: p5Types,
    noiseScale: number,
    noiseStrength: number,
    width: number,
    height: number
  ) {
    this.loc = _loc;
    this.dir = _dir;
    this.speed = _speed;
    this.p5 = p5;
    this.noiseScale = noiseScale;
    this.noiseStrength = noiseStrength;
    this.width = width;
    this.height = height;
    // var col;
  }

  run() {
    this.move();
    this.checkEdges();
    this.update();
  }

  move() {
    let angle =
      this.p5.noise(
        this.loc.x / this.noiseScale,
        this.loc.y / this.noiseScale,
        this.p5.frameCount / this.noiseScale
      ) *
      this.p5.TWO_PI *
      this.noiseStrength; //0-2PI
    this.dir.x = this.p5.cos(angle);
    this.dir.y = this.p5.sin(angle);
    var vel = this.dir.copy();
    var d = 1; //direction change
    vel.mult(this.speed * d); //vel = vel * (speed*d)
    this.loc.add(vel); //loc = loc + vel
  }

  checkEdges() {
    //float distance = dist(width/2, height/2, loc.x, loc.y);
    //if (distance>150) {
    if (
      this.loc.x < 0 ||
      this.loc.x > this.width ||
      this.loc.y < 0 ||
      this.loc.y > this.height
    ) {
      this.loc.x = this.p5.random(this.width * 1.2);
      this.loc.y = this.p5.random(this.height);
    }
  }

  update() {
    this.p5.fill(255);
    this.p5.ellipse(this.loc.x, this.loc.y, this.loc.z);
  }
}

export default class FlowfieldSketch extends GenericSketch {
  num: number;
  noiseScale: number;
  noiseStrength: number;
  particles: Array<Particle>;

  constructor(
    p5Instance: p5Types,
    canvasWidth: number,
    canvasHeight: number,
    colorTable: p5Types.Table,
    seedValue: number
  ) {
    super(p5Instance, canvasWidth, canvasHeight, colorTable, seedValue);

    this.num = 2000;
    this.noiseScale = 500;
    this.noiseStrength = 1;
    this.particles = new Array<Particle>(this.num);
  }

  setup(canvasParentRef: Element) {
    this.p5
      .createCanvas(this.canvasWidth, this.canvasHeight)
      .parent(canvasParentRef);

    this.p5.noStroke();
    for (let i = 0; i < this.num; i++) {
      //x value start slightly outside the right of canvas, z value how close to viewer
      let loc = this.p5.createVector(
        this.p5.random(this.canvasWidth * 1.2),
        this.p5.random(this.canvasHeight),
        2
      );
      let angle = 0; //any value to initialize
      let dir = this.p5.createVector(this.p5.cos(angle), this.p5.sin(angle));
      var speed = this.p5.random(0.5, 2);
      // var speed = random(5,map(mouseX,0,width,5,20));   // faster
      this.particles[i] = new Particle(
        loc,
        dir,
        speed,
        this.p5,
        this.noiseScale,
        this.noiseStrength,
        this.canvasWidth,
        this.canvasHeight
      );
    }
  }

  draw() {
    // background(0);
    this.p5.background(0, 10);
    this.p5.fill(0, 10);
    this.p5.noStroke();
    this.p5.rect(0, 0, this.canvasWidth, this.canvasHeight);
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].run();
    }
  }
}

*/

export {};
