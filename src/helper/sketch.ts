import p5Types from "p5";

// import colors from "../data/default.json";
// import colors from "../data/fourcolornostroke.json";
import colors from "../data/palette.json";

import {
  ColoredTriangleOptions,
  ColoredTrianglesSketch,
} from "../art-styles/colored-triangles";
import GenericSketch from "../art-styles/generic_sketch";
import NoiseSketch from "../art-styles/noise_sketch";
import NoneSketch from "../art-styles/none_sketch";

interface SketchOptions {
  numOfBoxes?: number;
  smearing?: number;
  opacity?: number;
  strokeWidth?: number;
  paletteIndex?: number;
  opacitySwitch?: boolean;
  noFill?: boolean;
  removeBlocks?: number;
}

export function assign_sketch(
  p5: p5Types,
  canvasWidth: number,
  canvasHeight: number,
  table: p5Types.Table,
  blockNumber: string,
  blockInfo: any,
  selectedStyle: string,
  opts: SketchOptions = {}
) {
  let sketch = new GenericSketch(
    p5,
    canvasWidth,
    canvasHeight,
    table,
    parseInt(blockNumber)
  );
  switch (selectedStyle) {
    case "triangles":
      let coloredTriangleOptions: ColoredTriangleOptions = {
        numOfBoxes: opts.numOfBoxes || 9,
        opacity: opts.opacity || 255,
        strokeWidth: opts.strokeWidth || 2,
        paletteIndex: opts.paletteIndex || 0,
        opacitySwitch: opts.opacitySwitch || false,
        noFill: opts.noFill || false,
        removeBlocks: opts.removeBlocks || 0,
      };
      sketch = new ColoredTrianglesSketch(
        p5,
        canvasWidth,
        canvasHeight,
        table,
        parseInt(blockNumber),
        coloredTriangleOptions
      );
      break;
    case "noise":
      let noiseOptions = {
        numOfBoxes: opts.numOfBoxes || 9,
      };
      sketch = new NoiseSketch(
        p5,
        canvasWidth,
        canvasHeight,
        table,
        parseInt(blockNumber),
        blockInfo,
        noiseOptions
      );
      break;
    case "none":
      sketch = new NoneSketch(
        p5,
        canvasWidth,
        canvasWidth,
        table,
        parseInt(blockNumber)
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
  colors.map((color: any) => {
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
    "triangles",
    "noise",
    "none",

    // deprecated styles

    // "simple-squares",
    // "ascii",
    // "colored-rectangles",
    // "ten-print",
    // "diamond",
    // "simple-triangles",
    // "flow-field",
  ];
}
