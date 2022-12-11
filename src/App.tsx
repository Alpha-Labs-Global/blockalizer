import React, { useState } from "react";
import Sketch from "react-p5";
import p5Types from "p5";

import "./App.css";

import colors from "./data/colors.json";

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

  const [uniqueKey, setUniqueKey] = useState(selectedSeed + selectedStyle);

  const canvasWidth: number = 400;
  const canvasHeight: number = 400;
  let sketch: GenericSketch;

  const preload = (p5: p5Types) => {
    let table: p5Types.Table = load_colors();

    sketch = assign_sketch(
      p5,
      canvasWidth,
      canvasHeight,
      table,
      selectedSeed,
      selectedStyle
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
    if (uniqueKey != selectedSeed + selectedStyle) {
      setUniqueKey(selectedSeed + selectedStyle);
      // p5Instance.redraw();
      console.log("random seed changed...");
    }
  };

  const save = (e: React.SyntheticEvent) => {
    console.log("sent to backend...");
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

  const colorPalette = (
    <div>
      {colors.map((c, i) => (
        <div className="panel" key={i}>
          <span className="panelIndex">{i}</span>
          <div
            className="box"
            style={{ backgroundColor: `rgb(${c["R1"]},${c["G1"]},${c["B1"]})` }}
          ></div>
          <div
            className="box"
            style={{ backgroundColor: `rgb(${c["R2"]},${c["G2"]},${c["B2"]})` }}
          ></div>
          <div
            className="box"
            style={{ backgroundColor: `rgb(${c["R3"]},${c["G3"]},${c["B3"]})` }}
          ></div>
          <div
            className="box"
            style={{ backgroundColor: `rgb(${c["R4"]},${c["G4"]},${c["B4"]})` }}
          ></div>
          <div
            className="box"
            style={{ backgroundColor: `rgb(${c["R5"]},${c["G5"]},${c["B5"]})` }}
          ></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="App">
      {showStyle ? styleSelector : null}
      <div>
        <input
          type="number"
          value={selectedSeed.toString()}
          onChange={seedHandler}
        />
        <button onClick={regenerate}>Regenerate</button>
        <button onClick={save}>Save</button>
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
