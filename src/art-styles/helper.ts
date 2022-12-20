import { tab } from "@testing-library/user-event/dist/tab";
import p5Types from "p5";

// import colors from "../data/default.json";
// import colors from "../data/fourcolornostroke.json";
import colors from "../data/palette.json";

import {
  ColoredTriangleOptions,
  ColoredTrianglesSketch,
} from "./colored-triangles";
import GenericSketch from "./generic_sketch";
import NoiseSketch from "./noise_sketch";

export function assign_sketch(
  p5: p5Types,
  canvasWidth: number,
  canvasHeight: number,
  table: p5Types.Table,
  selectedSeed: string,
  selectedStyle: string,
  opts: any = {}
) {
  let sketch = new GenericSketch(
    p5,
    canvasWidth,
    canvasHeight,
    table,
    parseInt(selectedSeed)
  );
  switch (selectedStyle) {
    case "triangles":
      let coloredTriangleOptions: ColoredTriangleOptions = {
        numOfBoxes: opts.numOfBoxes,
        smearing: opts.smearing,
        opacity: opts.opacity,
        strokeWidth: opts.strokeWidth,
        paletteIndex: opts.paletteIndex,
        opacitySwitch: opts.opacitySwitch || false,
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
    case "noise":
      sketch = new NoiseSketch(
        p5,
        canvasWidth,
        canvasHeight,
        table,
        parseInt(selectedSeed)
      );
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
