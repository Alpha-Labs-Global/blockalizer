import p5Types from "p5";

// import colors from "../data/default.json";
import colors from "../data/palette.json";

import SimpleSquaresSketch from "./simple-squares";
import ColoredRectanglesSketch from "./colored-rectangles";
import TenPrintSketch from "./ten-print";
import DiamondSketch from "./diamond";
import SimpleTrianglesSketch from "./simple-triangles";
import {
  ColoredTriangleOptions,
  ColoredTrianglesSketch,
} from "./colored-triangles";
import AsciiSketch from "./ascii";
import FlowfieldSketch from "./flow-field";

export function assign_sketch(
  p5: p5Types,
  canvasWidth: number,
  canvasHeight: number,
  table: p5Types.Table,
  selectedSeed: string,
  selectedStyle: string,
  opts: any = {}
) {
  let sketch = new SimpleSquaresSketch(
    p5,
    canvasWidth,
    canvasHeight,
    table,
    parseInt(selectedSeed)
  );
  switch (selectedStyle) {
    case "colored-triangles":
      let coloredTriangleOptions: ColoredTriangleOptions = {
        numOfBoxes: opts.numOfBoxes,
        smearing: opts.smearing,
        opacity: opts.opacity,
        strokeWidth: opts.strokeWidth,
      };
      sketch = new ColoredTrianglesSketch(
        p5,
        canvasWidth,
        canvasHeight,
        table,
        parseInt(selectedSeed),
        coloredTriangleOptions
      );
      break;
    case "ascii":
      sketch = new AsciiSketch(
        p5,
        canvasWidth,
        canvasHeight,
        table,
        parseInt(selectedSeed)
      );
      break;
    case "colored-rectangles":
      sketch = new ColoredRectanglesSketch(
        p5,
        canvasWidth,
        canvasHeight,
        table,
        parseInt(selectedSeed)
      );
      break;
    case "ten-print":
      sketch = new TenPrintSketch(
        p5,
        canvasWidth,
        canvasHeight,
        table,
        parseInt(selectedSeed)
      );
      break;
    case "diamond":
      sketch = new DiamondSketch(
        p5,
        canvasWidth,
        canvasHeight,
        table,
        parseInt(selectedSeed)
      );
      break;
    case "simple-triangles":
      sketch = new SimpleTrianglesSketch(
        p5,
        canvasWidth,
        canvasHeight,
        table,
        parseInt(selectedSeed)
      );
      break;
    case "flow-field":
      sketch = new FlowfieldSketch(
        p5,
        canvasWidth,
        canvasHeight,
        table,
        parseInt(selectedSeed)
      );
      break;
  }
  return sketch;
}

export function load_colors(): p5Types.Table {
  let table: p5Types.Table;
  table = new p5Types.Table();
  let column: keyof typeof colors[0];
  for (column in colors[0]) {
    table.addColumn(column);
  }

  let row: p5Types.TableRow;
  colors.map((color) => {
    row = table.addRow();
    let prop: keyof typeof color;
    for (prop in color) {
      row?.set(prop, color[prop]);
    }
  });
  return table;
}

export function all_sketch_styles(): Array<string> {
  return [
    "colored-triangles",
    "simple-squares",
    "ascii",
    "colored-rectangles",
    "ten-print",
    "diamond",
    "simple-triangles",
    "flow-field",
  ];
}
