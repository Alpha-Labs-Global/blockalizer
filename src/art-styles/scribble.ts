/*
This file contains functions for drawing 2d primitives with a handy sketchy look in p5.js.

Author: Janneck Wullschleger in 07/2016
Web: http://itsjw.de
Mail: jw@itsjw.de

Updated: 24.02.2017 to use with a reference to the p5 instance.
Just put it in as param to the constructor.

Much of the source code is taken from the handy library for processing,
written by Jo Wood, giCentre, City University London based on an idea by Nikolaus Gradwohl.
The handy library is licensed under the GNU Lesser General Public License: http://www.gnu.org/licenses/.
*/

import p5Types from "p5";

const Relation = {
  LEFT: 1,
  RIGHT: 2,
  INTERSECTS: 3,
  AHEAD: 4,
  BEHIND: 5,
  SEPARATE: 6,
  UNDEFINED: 7,
};

class Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  undef: boolean;
  a: number;
  b: number;
  c: number;
  xi: number;
  yi: number;

  constructor(_x1: number, _y1: number, _x2: number, _y2: number) {
    this.x1 = _x1;
    this.y1 = _y1;
    this.x2 = _x2;
    this.y2 = _y2;

    this.xi = Number.MAX_VALUE;
    this.yi = Number.MAX_VALUE;

    this.a = this.y2 - this.y1;
    this.b = this.x1 - this.x2;
    this.c = this.x2 * this.y1 - this.x1 * this.y2;

    if (this.a == 0 && this.b == 0 && this.c == 0) {
      this.undef = true;
    } else {
      this.undef = false;
    }
  }

  getPx1() {
    return this.x1;
  }

  getPy1() {
    return this.y1;
  }

  getPx2() {
    return this.x2;
  }

  getPy2() {
    return this.y2;
  }

  isUndefined() {
    return this.undef;
  }

  getA() {
    return this.a;
  }

  getB() {
    return this.b;
  }

  getC() {
    return this.c;
  }

  getIntersectionX() {
    return this.xi;
  }

  getIntersectionY() {
    return this.yi;
  }

  getLength(tx1: number, ty1: number, tx2: number, ty2: number) {
    let dx = tx2 - tx1;
    let dy = ty2 - ty1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  compare(otherSegment: Segment) {
    if (this.isUndefined() || otherSegment.isUndefined()) {
      return Relation.UNDEFINED;
    }

    let grad1 = Number.MAX_VALUE;
    let grad2 = Number.MAX_VALUE;
    let int1 = 0;
    let int2 = 0;

    if (Math.abs(this.b) > 0.00001) {
      grad1 = -this.a / this.b;
      int1 = -this.c / this.b;
    }

    if (Math.abs(otherSegment.getB()) > 0.00001) {
      grad2 = -otherSegment.getA() / otherSegment.getB();
      int2 = -otherSegment.getC() / otherSegment.getB();
    }

    if (grad1 == Number.MAX_VALUE) {
      if (grad2 == Number.MAX_VALUE) {
        if (-this.c / this.a != -otherSegment.getC() / otherSegment.getA()) {
          return Relation.SEPARATE;
        }

        if (
          this.y1 >= Math.min(otherSegment.getPy1(), otherSegment.getPy2()) &&
          this.y1 <= Math.max(otherSegment.getPy1(), otherSegment.getPy2())
        ) {
          this.xi = this.x1;
          this.yi = this.y1;
          return Relation.INTERSECTS;
        }

        if (
          this.y2 >= Math.min(otherSegment.getPy1(), otherSegment.getPy2()) &&
          this.y2 <= Math.max(otherSegment.getPy1(), otherSegment.getPy2())
        ) {
          this.xi = this.x2;
          this.yi = this.y2;
          return Relation.INTERSECTS;
        }

        return Relation.SEPARATE;
      }

      this.xi = this.x1;
      this.yi = grad2 * this.xi + int2;

      if (
        (this.y1 - this.yi) * (this.yi - this.y2) < -0.00001 ||
        (otherSegment.getPy1() - this.yi) * (this.yi - otherSegment.getPy2()) <
          -0.00001
      ) {
        return Relation.SEPARATE;
      }

      if (Math.abs(otherSegment.getA()) < 0.00001) {
        if (
          (otherSegment.getPx1() - this.xi) *
            (this.xi - otherSegment.getPx2()) <
          -0.00001
        ) {
          return Relation.SEPARATE;
        }
        return Relation.INTERSECTS;
      }
      return Relation.INTERSECTS;
    }

    if (grad2 == Number.MAX_VALUE) {
      this.xi = otherSegment.getPx1();
      this.yi = grad1 * this.xi + int1;

      if (
        (otherSegment.getPy1() - this.yi) * (this.yi - otherSegment.getPy2()) <
          -0.00001 ||
        (this.y1 - this.yi) * (this.yi - this.y2) < -0.00001
      ) {
        return Relation.SEPARATE;
      }

      if (Math.abs(this.a) < 0.00001) {
        if ((this.x1 - this.xi) * (this.xi - this.x2) < -0.00001) {
          return Relation.SEPARATE;
        }
        return Relation.INTERSECTS;
      }
      return Relation.INTERSECTS;
    }

    if (grad1 == grad2) {
      if (int1 != int2) {
        return Relation.SEPARATE;
      }

      if (
        this.x1 >= Math.min(otherSegment.getPx1(), otherSegment.getPx2()) &&
        this.x1 <= Math.max(otherSegment.getPy1(), otherSegment.getPy2())
      ) {
        this.xi = this.x1;
        this.yi = this.y1;
        return Relation.INTERSECTS;
      }

      if (
        this.x2 >= Math.min(otherSegment.getPx1(), otherSegment.getPx2()) &&
        this.x2 <= Math.max(otherSegment.getPx1(), otherSegment.getPx2())
      ) {
        this.xi = this.x2;
        this.yi = this.y2;
        return Relation.INTERSECTS;
      }

      return Relation.SEPARATE;
    }

    this.xi = (int2 - int1) / (grad1 - grad2);
    this.yi = grad1 * this.xi + int1;

    if (
      (this.x1 - this.xi) * (this.xi - this.x2) < -0.00001 ||
      (otherSegment.getPx1() - this.xi) * (this.xi - otherSegment.getPx2()) <
        -0.00001
    ) {
      return Relation.SEPARATE;
    }
    return Relation.INTERSECTS;
  }
}

class HachureIterator {
  sinAngle: number;
  tanAngle: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
  gap: number;
  pos: number;
  deltaX: number | undefined;
  hGap: number | undefined;
  sLeft: Segment | undefined;
  sRight: Segment | undefined;

  constructor(
    _top: number,
    _bottom: number,
    _left: number,
    _right: number,
    _gap: number,
    _sinAngle: number,
    _cosAngle: number,
    _tanAngle: number
  ) {
    this.sinAngle = _sinAngle;
    this.tanAngle = _tanAngle;
    this.top = _top;
    this.bottom = _bottom;
    this.left = _left;
    this.right = _right;
    this.gap = _gap;

    if (Math.abs(this.sinAngle) < 0.0001) {
      this.pos = this.left + this.gap;
    } else if (Math.abs(this.sinAngle) > 0.9999) {
      this.pos = this.top + this.gap;
    } else {
      this.deltaX = (this.bottom - this.top) * Math.abs(this.tanAngle);
      this.pos = this.left - Math.abs(this.deltaX);
      this.hGap = Math.abs(this.gap / _cosAngle);
      this.sLeft = new Segment(this.left, this.bottom, this.left, this.top);
      this.sRight = new Segment(this.right, this.bottom, this.right, this.top);
    }
  }

  getNextLine() {
    if (Math.abs(this.sinAngle) < 0.0001) {
      if (this.pos < this.right) {
        let line = [this.pos, this.top, this.pos, this.bottom];
        this.pos += this.gap;
        return line;
      }
    } else if (Math.abs(this.sinAngle) > 0.9999) {
      if (this.pos < this.bottom) {
        let line = [this.left, this.pos, this.right, this.pos];
        this.pos += this.gap;
        return line;
      }
    } else {
      let xLower = this.pos - this.deltaX! / 2;
      let xUpper = this.pos + this.deltaX! / 2;
      let yLower = this.bottom;
      let yUpper = this.top;

      if (this.pos < this.right + this.deltaX!) {
        while (
          (xLower < this.left && xUpper < this.left) ||
          (xLower > this.right && xUpper > this.right)
        ) {
          this.pos += this.hGap!;
          xLower = this.pos - this.deltaX! / 2;
          xUpper = this.pos + this.deltaX! / 2;

          if (this.pos > this.right + this.deltaX!) {
            return null;
          }
        }

        const s = new Segment(xLower, yLower, xUpper, yUpper);

        if (s.compare(this.sLeft!) == Relation.INTERSECTS) {
          xLower = s.getIntersectionX();
          yLower = s.getIntersectionY();
        }
        if (s.compare(this.sRight!) == Relation.INTERSECTS) {
          xUpper = s.getIntersectionX();
          yUpper = s.getIntersectionY();
        }
        if (this.tanAngle > 0) {
          xLower = this.right - (xLower - this.left);
          xUpper = this.right - (xUpper - this.left);
        }

        let line = [xLower, yLower, xUpper, yUpper];
        this.pos += this.hGap!;
        return line;
      }
    }
    return null;
  }
}

export default class Scribble {
  sketch: p5Types;
  bowing: number;
  roughness: number;
  maxOffset: number;
  numEllipseSteps: number;
  ellipseInc: number;

  constructor(
    p5: p5Types,
    bowing: number,
    roughness: number,
    maxOffset: number
  ) {
    this.sketch = p5;
    this.bowing = bowing;
    this.roughness = roughness;
    this.maxOffset = maxOffset;
    this.numEllipseSteps = 9;
    this.ellipseInc = (Math.PI * 2) / this.numEllipseSteps;
  }

  getOffset(minVal: number, maxVal: number) {
    return this.roughness * (this.sketch.random() * (maxVal - minVal) + minVal);
  }

  scribbleFilling(
    xCoords: Array<number>,
    yCoords: Array<number>,
    gap: number,
    angle: number
  ) {
    let result = [];

    if (
      xCoords == null ||
      yCoords == null ||
      xCoords.length == 0 ||
      yCoords.length == 0
    ) {
      return;
    }

    const hachureAngle = this.sketch.radians(angle % 180);
    const cosAngle = Math.cos(hachureAngle);
    const sinAngle = Math.sin(hachureAngle);
    const tanAngle = Math.tan(hachureAngle);

    let left = xCoords[0];
    let right = xCoords[0];
    let top = yCoords[0];
    let bottom = yCoords[0];

    for (var i = 1; i < xCoords.length; i++) {
      left = Math.min(left, xCoords[i]);
      right = Math.max(right, xCoords[i]);
      top = Math.min(top, yCoords[i]);
      bottom = Math.max(bottom, yCoords[i]);
    }

    const it = new HachureIterator(
      top - 1,
      bottom + 1,
      left - 1,
      right + 1,
      gap,
      sinAngle,
      cosAngle,
      tanAngle
    );
    var rectCoords = null;

    while ((rectCoords = it.getNextLine()) != null) {
      var lines = this.getIntersectingLines(rectCoords, xCoords, yCoords);

      for (var i = 0; i < lines.length; i += 2) {
        if (i < lines.length - 1) {
          let p1 = lines[i];
          let p2 = lines[i + 1];
          const scribbledLineCombo = this.scribbleLine(
            p1[0],
            p1[1],
            p2[0],
            p2[1]
          );
          result.push(scribbledLineCombo);
        }
      }
    }
    return result;
  }

  getIntersectingLines(
    lineCoords: Array<number>,
    xCoords: Array<number>,
    yCoords: Array<number>
  ) {
    let intersections = [];
    let s1 = new Segment(
      lineCoords[0],
      lineCoords[1],
      lineCoords[2],
      lineCoords[3]
    );

    for (let i = 0; i < xCoords.length; i++) {
      let s2 = new Segment(
        xCoords[i],
        yCoords[i],
        xCoords[(i + 1) % xCoords.length],
        yCoords[(i + 1) % xCoords.length]
      );

      if (s1.compare(s2) == Relation.INTERSECTS) {
        intersections.push([s1.getIntersectionX(), s1.getIntersectionY()]);
      }
    }
    return intersections;
  }

  scribbleLine(x1: number, y1: number, x2: number, y2: number) {
    let lenSq = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
    let offset = this.maxOffset;

    if (this.maxOffset * this.maxOffset * 100 > lenSq) {
      offset = Math.sqrt(lenSq) / 10;
    }

    let halfOffset = offset / 2;
    let divergePoint = 0.2 + this.sketch.random() * 0.2;
    let midDispX = (this.bowing * this.maxOffset * (y2 - y1)) / 200;
    let midDispY = (this.bowing * this.maxOffset * (x1 - x2)) / 200;
    midDispX = this.getOffset(-midDispX, midDispX);
    midDispY = this.getOffset(-midDispY, midDispY);

    let vertices1 = [];
    let vertices2 = [];
    // this.sketch.noFill();

    // this.sketch.beginShape();
    // this.sketch.vertex(
    //   x1 + this.getOffset(-offset, offset),
    //   y1 + this.getOffset(-offset, offset)
    // );
    vertices1.push([
      x1 + this.getOffset(-offset, offset),
      y1 + this.getOffset(-offset, offset),
      false,
    ]);
    // this.sketch.curveVertex(
    //   x1 + this.getOffset(-offset, offset),
    //   y1 + this.getOffset(-offset, offset)
    // );
    vertices1.push([
      x1 + this.getOffset(-offset, offset),
      y1 + this.getOffset(-offset, offset),
      true,
    ]);
    // this.sketch.curveVertex(
    //   midDispX +
    //     x1 +
    //     (x2 - x1) * divergePoint +
    //     this.getOffset(-offset, offset),
    //   midDispY + y1 + (y2 - y1) * divergePoint + this.getOffset(-offset, offset)
    // );
    vertices1.push([
      midDispX +
        x1 +
        (x2 - x1) * divergePoint +
        this.getOffset(-offset, offset),
      midDispY +
        y1 +
        (y2 - y1) * divergePoint +
        this.getOffset(-offset, offset),
      true,
    ]);
    // this.sketch.curveVertex(
    //   midDispX +
    //     x1 +
    //     2 * (x2 - x1) * divergePoint +
    //     this.getOffset(-offset, offset),
    //   midDispY +
    //     y1 +
    //     2 * (y2 - y1) * divergePoint +
    //     this.getOffset(-offset, offset)
    // );
    vertices1.push([
      midDispX +
        x1 +
        2 * (x2 - x1) * divergePoint +
        this.getOffset(-offset, offset),
      midDispY +
        y1 +
        2 * (y2 - y1) * divergePoint +
        this.getOffset(-offset, offset),
      true,
    ]);
    // this.sketch.curveVertex(
    //   x2 + this.getOffset(-offset, offset),
    //   y2 + this.getOffset(-offset, offset)
    // );
    vertices1.push([
      x2 + this.getOffset(-offset, offset),
      y2 + this.getOffset(-offset, offset),
      true,
    ]);
    // this.sketch.vertex(
    //   x2 + this.getOffset(-offset, offset),
    //   y2 + this.getOffset(-offset, offset)
    // );
    vertices1.push([
      x2 + this.getOffset(-offset, offset),
      y2 + this.getOffset(-offset, offset),
      false,
    ]);
    // this.sketch.endShape();

    // this.sketch.beginShape();
    // this.sketch.vertex(
    //   x1 + this.getOffset(-halfOffset, halfOffset),
    //   y1 + this.getOffset(-halfOffset, halfOffset)
    // );
    vertices2.push([
      x1 + this.getOffset(-halfOffset, halfOffset),
      y1 + this.getOffset(-halfOffset, halfOffset),
      false,
    ]);
    // this.sketch.curveVertex(
    //   x1 + this.getOffset(-halfOffset, halfOffset),
    //   y1 + this.getOffset(-halfOffset, halfOffset)
    // );
    vertices2.push([
      x1 + this.getOffset(-halfOffset, halfOffset),
      y1 + this.getOffset(-halfOffset, halfOffset),
      true,
    ]);
    // this.sketch.curveVertex(
    //   midDispX +
    //     x1 +
    //     (x2 - x1) * divergePoint +
    //     this.getOffset(-halfOffset, halfOffset),
    //   midDispY +
    //     y1 +
    //     (y2 - y1) * divergePoint +
    //     this.getOffset(-halfOffset, halfOffset)
    // );
    vertices2.push([
      midDispX +
        x1 +
        (x2 - x1) * divergePoint +
        this.getOffset(-halfOffset, halfOffset),
      midDispY +
        y1 +
        (y2 - y1) * divergePoint +
        this.getOffset(-halfOffset, halfOffset),
      true,
    ]);
    // this.sketch.curveVertex(
    //   midDispX +
    //     x1 +
    //     2 * (x2 - x1) * divergePoint +
    //     this.getOffset(-halfOffset, halfOffset),
    //   midDispY +
    //     y1 +
    //     2 * (y2 - y1) * divergePoint +
    //     this.getOffset(-halfOffset, halfOffset)
    // );
    vertices2.push([
      midDispX +
        x1 +
        2 * (x2 - x1) * divergePoint +
        this.getOffset(-halfOffset, halfOffset),
      midDispY +
        y1 +
        2 * (y2 - y1) * divergePoint +
        this.getOffset(-halfOffset, halfOffset),
      true,
    ]);
    // this.sketch.curveVertex(
    //   x2 + this.getOffset(-halfOffset, halfOffset),
    //   y2 + this.getOffset(-halfOffset, halfOffset)
    // );
    vertices2.push([
      x2 + this.getOffset(-halfOffset, halfOffset),
      y2 + this.getOffset(-halfOffset, halfOffset),
      true,
    ]);
    this.sketch.vertex(
      x2 + this.getOffset(-halfOffset, halfOffset),
      y2 + this.getOffset(-halfOffset, halfOffset)
    );
    vertices2.push([
      x2 + this.getOffset(-halfOffset, halfOffset),
      y2 + this.getOffset(-halfOffset, halfOffset),
      false,
    ]);
    // this.sketch.endShape();

    return [vertices1, vertices2];
  }
}

/*  

  buildEllipse(
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    offset: number,
    overlap: number
  ) {
    const radialOffset = this.getOffset(-0.5, 0.5) - Math.PI / 2;

    this.sketch.beginShape();
    this.sketch.curveVertex(
      this.getOffset(-offset, offset) +
        cx +
        0.9 * rx * Math.cos(radialOffset - this.ellipseInc),
      this.getOffset(-offset, offset) +
        cy +
        0.9 * ry * Math.sin(radialOffset - this.ellipseInc)
    );

    for (
      let theta = radialOffset;
      theta < Math.PI * 2 + radialOffset - 0.01;
      theta += this.ellipseInc
    ) {
      this.sketch.curveVertex(
        this.getOffset(-offset, offset) + cx + rx * Math.cos(theta),
        this.getOffset(-offset, offset) + cy + ry * Math.sin(theta)
      );
    }

    this.sketch.curveVertex(
      this.getOffset(-offset, offset) +
        cx +
        rx * Math.cos(radialOffset + Math.PI * 2 + overlap * 0.5),
      this.getOffset(-offset, offset) +
        cy +
        ry * Math.sin(radialOffset + Math.PI * 2 + overlap * 0.5)
    );

    this.sketch.curveVertex(
      this.getOffset(-offset, offset) +
        cx +
        0.98 * rx * Math.cos(radialOffset + overlap),
      this.getOffset(-offset, offset) +
        cy +
        0.98 * ry * Math.sin(radialOffset + overlap)
    );

    this.sketch.curveVertex(
      this.getOffset(-offset, offset) +
        cx +
        0.9 * rx * Math.cos(radialOffset + overlap * 0.5),
      this.getOffset(-offset, offset) +
        cy +
        0.9 * ry * Math.sin(radialOffset + overlap * 0.5)
    );
    this.sketch.endShape();
  }

  this.scribbleCurve = function( x1, y1, x2, y2, x3, y3, x4, y4 ) {
    this.sketch.bezier(  x1+this.getOffset( -2, 2 ), y1+this.getOffset( -2, 2 ),
             x3+this.getOffset( -4, 4 ), y3+this.getOffset( -3, 3 ),
             x4+this.getOffset( -3, 3 ), y4+this.getOffset( -3, 3 ),
             x2+this.getOffset( -1, 1 ), y2+this.getOffset( -1, 1 ) );

    this.sketch.bezier(  x1+this.getOffset( -2, 2 ), y1+this.getOffset( -2, 2 ),
             x3+this.getOffset( -3, 3 ), y3+this.getOffset( -3, 3 ),
             x4+this.getOffset( -3, 3 ), y4+this.getOffset( -4, 4 ),
             x2+this.getOffset( -2, 2 ), y2+this.getOffset( -2, 2 ) );
  }
  
    this.scribbleRect = function( x, y, w, h ) {
      var halfWidth = w/2;
      var halfHeight = h/2;
      var left   = Math.min( x-halfWidth, x+halfWidth );
      var right  = Math.max( x-halfWidth, x+halfWidth );
      var top    = Math.min( y-halfHeight, y+halfHeight );
      var bottom = Math.max( y-halfHeight, y+halfHeight );
  
        this.scribbleLine( left, top, right, top );
        this.scribbleLine( right, top, right, bottom );
        this.scribbleLine( right, bottom, left, bottom );
        this.scribbleLine( left, bottom, left, top );
    }
  
    this.scribbleRoundedRect = function( x, y, w, h, radius ) {
      var halfWidth = w/2;
      var halfHeight = h/2;
  
      if ( radius == 0 || radius > halfWidth || radius > halfHeight ) {
        this.scribbleRect( x, y, w, h );
        return;
      }
  
      var left   = Math.min( x-halfWidth, x+halfWidth );
      var right  = Math.max( x-halfWidth, x+halfWidth );
      var top    = Math.min( y-halfHeight, y+halfHeight );
      var bottom = Math.max( y-halfHeight, y+halfHeight );
  
      this.scribbleLine( left+radius, top, right-radius, top, 1.5 );
      this.scribbleLine( right, top+radius, right, bottom-radius, 1.5 );
      this.scribbleLine( right-radius, bottom, left+radius, bottom, 1.5 );
      this.scribbleLine( left, bottom-radius, left, top+radius, 1.5 );
  
      this.scribbleCurve( left+radius, top, left, top+radius, left+radius*0.1, top+radius*0.1, left+radius*0.1, top+radius*0.1 );
      this.scribbleCurve( right-radius, top, right, top+radius, right-radius*0.1, top+radius*0.1, right-radius*0.1, top+radius*0.1 );
      this.scribbleCurve( left+radius, bottom, left, bottom-radius, left+radius*0.1, bottom-radius*0.1, left+radius*0.1, bottom-radius*0.1 );
      this.scribbleCurve( right-radius, bottom, right, bottom-radius, right-radius*0.1, bottom-radius*0.1, right-radius*0.1, bottom-radius*0.1 );
    }
  
    this.scribbleEllipse = function( x, y, w, h ) {
      var rx = Math.abs(w/2);
      var ry = Math.abs(h/2);
  
      rx += this.getOffset( -rx*0.05, rx*0.05 );
      ry += this.getOffset( -ry*0.05, ry*0.05 );
  
      this.buildEllipse( x, y, rx, ry, 1, this.ellipseInc*this.getOffset( 0.1, this.getOffset( 0.4, 1 ) ) );
      this.buildEllipse( x, y, rx, ry, 1.5, 0 );
    }
  
    
  }
  

  */
