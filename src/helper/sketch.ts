import p5Types from "p5";

// import colors from "../data/default.json";
import colors from "../data/palette.json";

import {
  ColoredTriangleOptions,
  ColoredTrianglesSketch,
} from "../art-styles/colored-triangles";
import GenericSketch from "../art-styles/generic_sketch";
// import NoiseSketch from "../art-styles/noise_sketch";
import NoneSketch from "../art-styles/none_sketch";
// import CubeSketch from "../art-styles/cube_sketch";
import { AliveGridOptions, AliveGridSketch } from "../art-styles/alive_grid";

export interface BlockInfo {
  blockHash: string;
  blockNumber: string;
  from: string;
  timeStamp: string;
  to: string;
}

interface SketchOptions {
  numOfBoxes?: number;
  smearing?: number;
  opacity?: number;
  strokeWidth?: number;
  paletteIndex?: number;
  opacitySwitch?: boolean;
  noFill?: boolean;
  removeBlocks?: number;
  gap?: number;
  cubeSize?: number;
  animate?: boolean;
  paperIndex?: number;
}

export function assign_sketch(
  p5: p5Types,
  canvasWidth: number,
  canvasHeight: number,
  table: p5Types.Table,
  blockNumber: string,
  blockInfo: BlockInfo,
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
    /*
    case "grid":
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
        hex2bin(blockInfo.blockHash),
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
        hex2bin(blockInfo.blockHash),
        noiseOptions
      );
      break;
      */
    case "none":
      sketch = new NoneSketch(
        p5,
        canvasWidth,
        canvasWidth,
        table,
        parseInt(blockNumber)
      );
      break;
    /*
    case "3d-cube":
      let cubeOpts: any = {
        gap: opts.gap || 0,
        cubeSize: opts.cubeSize || 3,
        paletteIndex: opts.paletteIndex || 0,
      };

      sketch = new CubeSketch(
        p5,
        canvasWidth,
        canvasWidth,
        table,
        parseInt(blockNumber),
        cubeOpts
      );
      break;
      */
    case "alive-grid":
      let aliveGridOptions: AliveGridOptions = {
        numOfBoxes: opts.numOfBoxes || 9,
        paletteIndex: opts.paletteIndex || 0,
        noFill: opts.noFill || false,
        removeBlocks: opts.removeBlocks || 0,
        animate: opts.animate || false,
        paperIndex: opts.paperIndex || 0,
      };
      sketch = new AliveGridSketch(
        p5,
        canvasWidth,
        canvasHeight,
        table,
        parseInt(blockNumber),
        hex2bin(blockInfo.blockHash),
        aliveGridOptions
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
    "grid",
    "noise",
    "none",
    "3d-cube",
    "alive-grid",

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

function hex2bin(hex: string) {
  hex = hex.replace("0x", "").toLowerCase();
  var out = "";
  for (var c of hex) {
    switch (c) {
      case "0":
        out += "0000";
        break;
      case "1":
        out += "0001";
        break;
      case "2":
        out += "0010";
        break;
      case "3":
        out += "0011";
        break;
      case "4":
        out += "0100";
        break;
      case "5":
        out += "0101";
        break;
      case "6":
        out += "0110";
        break;
      case "7":
        out += "0111";
        break;
      case "8":
        out += "1000";
        break;
      case "9":
        out += "1001";
        break;
      case "a":
        out += "1010";
        break;
      case "b":
        out += "1011";
        break;
      case "c":
        out += "1100";
        break;
      case "d":
        out += "1101";
        break;
      case "e":
        out += "1110";
        break;
      case "f":
        out += "1111";
        break;
      default:
        return "";
    }
  }

  return out;
}
