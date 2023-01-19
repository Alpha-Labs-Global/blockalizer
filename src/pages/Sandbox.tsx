import React, { useEffect, useState } from "react";
import Sketch from "react-p5";
import p5Types from "p5";

import {
  assign_sketch,
  load_colors,
  BlockInfo,
  all_sketch_styles,
} from "../helper/sketch";
import GenericSketch from "../art-styles/generic_sketch";

interface ComponentProps {}

const Sandbox: React.FC<ComponentProps> = (props: ComponentProps) => {
  let sketch: GenericSketch;
  const styles = all_sketch_styles();
  const colorNames = ["Alpine", "Tidal", "Autumn"];
  const canvasWidth = 400;
  const canvasHeight = 400;

  const [style, setStyle] = useState("grid");

  const blockNumber = 11973589;
  const blockInfo: BlockInfo = {
    blockHash:
      "0xdea542c62967cac8f0974d7afc26eb9b377a27353942a82c5181cc1434424145",
    blockNumber: blockNumber.toString(),
    from: "not_used",
    timeStamp: "not_used",
    to: "not_used",
  };

  const [gridSize, setGridSize] = useState(3);
  const [antiBlock, setAntiBlock] = useState(0);
  const [color, setColor] = useState("Alpine");
  const [fill, setFill] = useState(true);

  useEffect(() => {
    regenerate();
  }, [style, gridSize, antiBlock, fill, color]);

  const keyGenerator = () => {
    return (
      blockNumber +
      gridSize.toString() +
      antiBlock.toString() +
      color +
      fill.toString() +
      style
    );
  };

  const [uniqueKey, setUniqueKey] = useState(keyGenerator());

  const regenerate = () => {
    if (uniqueKey != keyGenerator()) {
      setUniqueKey(keyGenerator());
      // p5Instance.redraw();
      console.log("Regenerating Art...");
    }
  };

  const preload = (p5: p5Types) => {
    let paletteIndex = colorNames.indexOf(color);
    let table: p5Types.Table = load_colors();
    let opts = {
      numOfBoxes: gridSize,
      opacity: 255, // using fixed opacity
      strokeWidth: 1.5, // using fixed stroke width
      paletteIndex: paletteIndex,
      opacitySwitch: true,
      noFill: !fill,
      removeBlocks: antiBlock,
    };

    sketch = assign_sketch(
      p5,
      canvasWidth,
      canvasHeight,
      table,
      blockNumber.toString(),
      blockInfo as BlockInfo,
      style,
      opts
    );
  };

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    sketch.setup(canvasParentRef);
  };

  const draw = (p5: p5Types) => {
    sketch.draw();
  };

  const gridControls =
    style === "grid" ? (
      <div>
        <div className="flex flex-row">
          <p className="basis-1/2">Grid Size</p>
          <input
            className="basis-1/2"
            type="range"
            min="3"
            max="12"
            step="3"
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
          ></input>
        </div>
        <div className="flex flex-row">
          <p className="basis-1/2">Anti Block</p>
          <input
            className="basis-1/2"
            type="range"
            min="0"
            max="3"
            step="1"
            value={antiBlock}
            onChange={(e) => setAntiBlock(Number(e.target.value))}
          ></input>
        </div>
        <div className="flex flex-row">
          <p className="basis-1/2">Fill</p>
          <select
            className="bg-transparent opacity-50"
            onChange={(e) => setFill(e.target.value == "true")}
            value={fill.toString()}
          >
            {[true, false].map((s, i) => (
              <option key={i} value={s.toString()}>
                {s.toString()}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-row">
          <p className="basis-1/2">Color</p>
          <select
            className="bg-transparent opacity-50"
            onChange={(e) => setColor(e.target.value)}
            value={color}
          >
            {colorNames.map((s, i) => (
              <option key={i} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
    ) : null;

  return (
    <div className="m-10" style={{ width: "400px" }}>
      <h1 className="text-4xl">sandbox</h1>
      <select
        className="bg-transparent opacity-50 mt-5"
        onChange={(e) => setStyle(e.target.value)}
        value={style}
      >
        {styles.map((s, i) => (
          <option key={i} value={s}>
            {s}
          </option>
        ))}
      </select>
      <Sketch key={uniqueKey} setup={setup} draw={draw} preload={preload} />
      <div className="mt-5">{gridControls}</div>
    </div>
  );
};

export default Sandbox;
