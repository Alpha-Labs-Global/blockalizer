import React, { useState, useEffect } from "react";
import Sketch from "react-p5";
import p5Types from "p5";

import { ConnectKitButton } from "connectkit";
import { useSigner } from "wagmi";

import { createSiweMessage } from "../helper/wallet";
import { fetchBlocks } from "../helper/server";

import "./Playground.css";

import {
  assign_sketch,
  load_colors,
  all_sketch_styles,
} from "../helper/sketch";

import GenericSketch from "../art-styles/generic_sketch";

interface ComponentProps {}

const Playground: React.FC<ComponentProps> = (props: ComponentProps) => {
  const styles = all_sketch_styles();
  const [selectedStyle, setStyle] = useState("none");
  const [selectedSeed, setSeed] = useState("8");
  const [noFill, setNoFill] = useState(false);
  const authorizeRequired = false;

  // In order of how the palette is generated. Ideally it would be
  // best if the names would come from the data. But I will get to
  // that later
  const colorNames = ["Alpine", "Lavendar", "Tidal", "Crimson"];
  const [chroma, setChroma] = useState("Alpine");
  const [blocks, setBlocks] = useState([]);
  const [address, setAddress] = useState(""); // cache address so it is not refreshed everytime

  const signedOutApp = () => {
    setStyle("none");
    setAddress("");
    setBlocks([]);
  };

  const signedInApp = () => {
    setStyle("triangles");
  };

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

  const lazySetBlocks = async () => {
    if (signer) {
      const newAddress = await signer.getAddress();
      if (newAddress == address) return;

      setAddress(newAddress);
      try {
        const result = await fetchBlocks(newAddress);
        setBlocks(result);
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    regenerate();

    if (signer === null) {
      signedOutApp();
    } else {
      lazySetBlocks();
    }
  });

  useEffect(() => {
    if (blocks.length > 0) {
      signedInApp();
    }
  }, [blocks]);

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

  const { data: signer, isError, isLoading } = useSigner();

  const authorize = async () => {
    if (!signer) return;

    const address = await signer.getAddress();
    const message = createSiweMessage(address, "This is a test statement.");
    signer.signMessage(message);
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

  const blockHandler = (e: any) => {
    console.log(e.target.value, e.currentTarget.value);
    setSeed(e.target.value);
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

  const blocksControl = blocks.map((b) => (
    <span style={{ marginRight: "10px" }}>
      <button key={b} onClick={blockHandler} value={b}>
        {b}
      </button>
    </span>
  ));

  return (
    <div className="Generator">
      <ConnectKitButton />
      {authorizeRequired ? <button onClick={authorize}>Sign</button> : null}
      <div className="actualApp">
        <div>Blocks {blocksControl}</div>
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
  );
};

export default Playground;
