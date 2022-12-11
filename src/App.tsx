import React, { SyntheticEvent, useState } from "react";
import Sketch from "react-p5";
import p5Types from "p5";

import "./App.css";

import GenericSketch from "./art-styles/generic_sketch";

import {
  assign_sketch,
  load_colors,
  all_sketch_styles,
} from "./art-styles/helper";

interface ComponentProps {}

const App: React.FC<ComponentProps> = (props: ComponentProps) => {
  const styles = all_sketch_styles();
  const [selectedStyle, setStyle] = useState("colored-triangles");
  const styleHandler = (e: any) => {
    setStyle(e.currentTarget.value);
  };
  const [showStyle, setShowStyle] = useState(false);

  const [selectedSeed, setSeed] = useState("8");
  const seedHandler = (e: any) => {
    setSeed(e.currentTarget.value);
  };

  /* CONTROL */
  const [numOfBoxes, setNumOfBoxes] = useState(9);
  const [smearing, setSmearing] = useState(2);
  const [opacity, setOpacity] = useState(255);
  const [strokeWidth, setStrokeWidth] = useState(2);

  const keyGenerator = () => {
    return (
      selectedSeed +
      selectedStyle +
      numOfBoxes.toString() +
      smearing.toString() +
      opacity.toString() +
      strokeWidth.toString()
    );
  };

  const [uniqueKey, setUniqueKey] = useState(keyGenerator());

  const canvasWidth: number = 400;
  const canvasHeight: number = 400;
  let sketch: GenericSketch;

  const preload = (p5: p5Types) => {
    let table: p5Types.Table = load_colors();
    let opts = {
      numOfBoxes: numOfBoxes,
      smearing: smearing,
      opacity: opacity,
      strokeWidth: strokeWidth,
    };

    sketch = assign_sketch(
      p5,
      canvasWidth,
      canvasHeight,
      table,
      selectedSeed,
      selectedStyle,
      opts
    );
  };

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    console.log("canvas setup again...");
    sketch.setup(canvasParentRef);
  };

  const draw = (p5: p5Types) => {
    console.log("DRAW", selectedStyle);
    // p5.background(230);
    sketch.draw();
  };

  const regenerate = (e: React.SyntheticEvent) => {
    if (uniqueKey != keyGenerator()) {
      setUniqueKey(keyGenerator());
      // p5Instance.redraw();
      console.log("unique key changed...");
    }
  };

  const save = (e: React.SyntheticEvent) => {
    console.log("sent to backend...");
    // TODO
  };

  const styleSelector = (
    <div>
      Style:{" "}
      <select name="select" value={selectedStyle} onChange={styleHandler}>
        {styles.map(function (n, i) {
          return (
            <option value={n} key={i}>
              {n}
            </option>
          );
        })}
      </select>
    </div>
  );

  const colorPaletteColumnIndices = Array.from(
    { length: load_colors().columns.length / 3 },
    (_, i) => i * 3
  );
  const colorPalette = (
    <div>
      {load_colors().rows.map((c, i) => (
        <div className="panel" key={i}>
          <span className="panelIndex">{i + 1}</span>
          {colorPaletteColumnIndices.map((i) => (
            <div
              className="box"
              key={i}
              style={{
                backgroundColor: `rgb(${c.getNum(i)},${c.getNum(
                  i + 1
                )},${c.getNum(i + 2)})`,
              }}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );

  const numOfBoxesHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumOfBoxes(parseInt(e.currentTarget.value));
    regenerate(e);
  };

  const smearingHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSmearing(parseInt(e.currentTarget.value));
    regenerate(e);
  };

  const opacityHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpacity(parseInt(e.currentTarget.value));
    regenerate(e);
  };

  const strokeWidthHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStrokeWidth(parseInt(e.currentTarget.value));
    regenerate(e);
  };

  return (
    <div className="App">
      {showStyle ? styleSelector : null}
      <div>
        <div>
          Block Number{" "}
          <input
            type="number"
            value={selectedSeed.toString()}
            onChange={seedHandler}
          />
          <button onClick={regenerate}>Regenerate</button>
        </div>
        <div>
          <div>
            Number of Boxes
            <input
              type="range"
              min="2"
              max="12"
              defaultValue="9"
              step="1"
              onChange={numOfBoxesHandler}
            />
            {numOfBoxes}
          </div>
          <div>
            Smearing
            <input
              type="range"
              min="2"
              max="10"
              defaultValue="2"
              step="1"
              onChange={smearingHandler}
            />
            {smearing}
          </div>
          <div>
            Opacity
            <input
              type="range"
              min="0"
              max="255"
              defaultValue="255"
              step="10"
              onChange={opacityHandler}
            />
            {opacity}
          </div>
          <div>
            Stroke Width
            <input
              type="range"
              min="0"
              max="5"
              defaultValue="2"
              step="1"
              onChange={strokeWidthHandler}
            />
            {strokeWidth}
          </div>
        </div>
        <div>
          <button disabled={true} onClick={save}>
            Mint
          </button>
        </div>
      </div>
      <hr />
      <Sketch key={uniqueKey} setup={setup} draw={draw} preload={preload} />
      <hr />
      <h2>Color Palette</h2>
      {colorPalette}
    </div>
  );
};

export default App;
