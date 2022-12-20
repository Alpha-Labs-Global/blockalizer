import React, { useState, useEffect } from "react";
import Sketch from "react-p5";
import p5Types from "p5";

import "./Generator.css";

import {
  assign_sketch,
  load_colors,
  all_sketch_styles,
} from "../art-styles/helper";

import GenericSketch from "../art-styles/generic_sketch";

interface ComponentProps {}

const Sandbox: React.FC<ComponentProps> = (props: ComponentProps) => {
  const styles = all_sketch_styles();
  const [selectedStyle, setStyle] = useState("triangles");

  const [selectedSeed, setSeed] = useState("8");
  const seedHandler = (e: any) => {
    setSeed(e.currentTarget.value);
  };

  // In order of how the palette is generated. Ideally it would be
  // best if the names would come from the data. But I will get to
  // that later
  const colorNames = ["Alpine", "Lavendar", "Tidal", "Crimson"];
  const [chroma, setChroma] = useState("Alpine");

  /* CONTROL */
  const [numOfBoxes, setNumOfBoxes] = useState(9);
  const [smearing, setSmearing] = useState(2);

  const keyGenerator = () => {
    return (
      selectedSeed +
      selectedStyle +
      numOfBoxes.toString() +
      smearing.toString() +
      chroma
    );
  };

  const [uniqueKey, setUniqueKey] = useState(keyGenerator());

  useEffect(() => {
    regenerate();
  });

  const canvasWidth: number = 400;
  const canvasHeight: number = 400;
  let sketch: GenericSketch;

  const preload = (p5: p5Types) => {
    let paletteIndex = colorNames.indexOf(chroma);
    let table: p5Types.Table = load_colors();
    let opts = {
      numOfBoxes: numOfBoxes,
      smearing: smearing,
      opacity: 255, // using fixed opacity
      strokeWidth: 2, // using fixed stroke width
      paletteIndex: paletteIndex,
      opacitySwitch: true,
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

  const regenerate = () => {
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

  const numOfBoxesHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumOfBoxes(parseInt(e.currentTarget.value));
  };

  const smearingHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSmearing(parseInt(e.currentTarget.value));
  };

  const chromaHandler = (e: any) => {
    setChroma(e.target.value);
  };

  const chromeSelector = colorNames.map((c, i) => (
    <div>
      <label>
        <input
          type="radio"
          value={c}
          checked={chroma === c}
          onChange={chromaHandler}
        />
        {c}
      </label>
    </div>
  ));

  return (
    <div className="Generator">
      <div className="actualApp">
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
            Grid Size
            <input
              type="range"
              min="3"
              max="12"
              defaultValue="9"
              step="3"
              onChange={numOfBoxesHandler}
            />
            {numOfBoxes}
          </div>
          <div>
            Tetri
            <input
              type="range"
              min="2"
              max="5"
              defaultValue="2"
              step="1"
              onChange={smearingHandler}
            />
            {smearing}
          </div>
          <div>Chroma</div>
          {chromeSelector}
        </div>
        <div>
          <button disabled={true} onClick={save}>
            Mint
          </button>
        </div>
      </div>
      <hr />
      <Sketch key={uniqueKey} setup={setup} draw={draw} preload={preload} />
    </div>
  );
};

export default Sandbox;
