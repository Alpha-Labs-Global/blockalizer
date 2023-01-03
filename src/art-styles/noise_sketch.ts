import p5Types from "p5";
import GenericSketch from "./generic_sketch";

interface BlockInfo {
  blockHash: string;
  blockNumber: string;
  from: string;
  timeStamp: string;
  to: string;
}

export default class NoiseSketch extends GenericSketch {
  boxSize: number;
  rez: number; // resolution
  options: number;

  constructor(
    p5Instance: p5Types,
    canvasWidth: number,
    canvasHeight: number,
    colorTable: p5Types.Table,
    blockNumber: number,
    blockInfo: any,
    opts: any
  ) {
    super(p5Instance, canvasWidth, canvasHeight, colorTable, blockNumber);
    console.log("info", blockInfo);
    const info = blockInfo as BlockInfo;
    const hashBinary = this.hex2bin(info.blockHash);
    console.log(hashBinary);

    this.options = 100;
    const numOfBoxes = opts.numOfBoxes;
    this.boxSize = canvasHeight / numOfBoxes;
    this.rez = 0.1;
  }

  draw() {
    this.p5.noStroke();
    for (let x = 0; x < this.canvasWidth; x += this.boxSize) {
      for (let y = 0; y < this.canvasHeight; y += this.boxSize) {
        let noiseValue = this.p5.noise(x, y);
        // F = 1 / (options - 1)
        // 2 -- 0, 1
        // 3 -- 0, 0.5, 1
        // 4 -- 0, 0.33, 0.67, 1
        // 5 -- 0, 0.25, 0.5, 0.75, 1
        let chunkSize = 1 / this.options;
        let bucket = 0;
        for (let chunkEnd = chunkSize; chunkEnd <= 1; chunkEnd += chunkSize) {
          if (noiseValue < chunkEnd) {
            break;
          }
          bucket += 1 / (this.options - 1);
        }
        this.p5.fill(255 * bucket);
        this.p5.rect(x, y, this.boxSize, this.boxSize);
        this.p5.fill(255);
        const bucketText = bucket.toFixed(2);
        this.p5.text(bucketText, x + this.boxSize / 4, y + this.boxSize / 2);
      }
    }
  }

  hex2bin(hex: string) {
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
}
