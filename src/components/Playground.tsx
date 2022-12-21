import React, { useState, useEffect } from "react";
import Sketch from "react-p5";
import p5Types from "p5";

import { ConnectKitProvider, ConnectKitButton } from "connectkit";
import { WagmiConfig } from "wagmi";

import { client } from "../helper/wallet";

import "./Playground.css";

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
  const [noFill, setNoFill] = useState(false);

  // In order of how the palette is generated. Ideally it would be
  // best if the names would come from the data. But I will get to
  // that later
  const colorNames = ["Alpine", "Lavendar", "Tidal", "Crimson"];
  const [chroma, setChroma] = useState("Alpine");

  /* CONTROL */
  const [numOfBoxes, setNumOfBoxes] = useState(9);
  const [tetri, setTetri] = useState(0);

  const keyGenerator = () => {
    return (
      selectedSeed +
      selectedStyle +
      numOfBoxes.toString() +
      tetri.toString() +
      chroma +
      noFill.toString()
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
      smearing: 2, // using default value to have no smearing
      opacity: 255, // using fixed opacity
      strokeWidth: 1.5, // using fixed stroke width
      paletteIndex: paletteIndex,
      opacitySwitch: true,
      noFill: noFill,
      removeBlocks: tetri,
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

  const authorize = () => {
    console.log("unique key changed...");
  };

  const save = (e: React.SyntheticEvent) => {
    console.log("sent to backend...");
    // TODO
  };

  const numOfBoxesHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumOfBoxes(parseInt(e.currentTarget.value));
  };

  const tetriHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTetri(parseInt(e.currentTarget.value));
  };

  const chromaHandler = (e: any) => {
    setChroma(e.target.value);
  };

  const fillHandler = (e: any) => {
    const noFill = e.currentTarget.value === "No" ? true : false;
    console.log(noFill);
    setNoFill(noFill);
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

  const gridControl = (
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
  );

  const fillSelector = (
    <div>
      <div>
        <label>
          <input
            type="radio"
            value={"Yes"}
            checked={!noFill}
            onChange={fillHandler}
          />
          Yes
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            value={"No"}
            checked={noFill}
            onChange={fillHandler}
          />
          No
        </label>
      </div>
    </div>
  );

  const tetriControl = (
    <div>
      Tetri
      <input
        type="range"
        min="0"
        max="3"
        defaultValue="0"
        step="1"
        onChange={tetriHandler}
      />
      {tetri}
    </div>
  );

  return (
    <WagmiConfig client={client()}>
      <ConnectKitProvider theme="midnight">
        <div className="Generator">
          <ConnectKitButton />
          <button onClick={authorize}>Authorize</button>
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
              {gridControl}
              <div>
                Chroma
                {chromeSelector}
              </div>
              <div>
                Fill
                {fillSelector}
              </div>
              {tetriControl}
            </div>
            <div>
              <button disabled={true} onClick={save}>
                Mint
              </button>
            </div>
          </div>
          <Sketch key={uniqueKey} setup={setup} draw={draw} preload={preload} />
        </div>
      </ConnectKitProvider>
    </WagmiConfig>
  );
};

export default Sandbox;
