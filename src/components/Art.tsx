import React, { useState, useEffect, useRef } from "react";
import Sketch from "react-p5";
import p5Types from "p5";

import { assign_sketch, load_colors, BlockInfo } from "../helper/sketch";

import GenericSketch from "../art-styles/generic_sketch";

interface ComponentProps {
  blockNumber: number;
  ready: boolean;
  numOfBoxes: number;
  tetri: number;
  chroma: string;
  noFill: boolean;
  blockInfo: any;
}

export const Art: React.FC<ComponentProps> = (props: ComponentProps) => {
  const sketchRef = useRef(null);
  const [style, setStyle] = useState("none");

  const blockNumber = props.blockNumber;
  const ready = props.ready;
  const numOfBoxes = props.numOfBoxes;
  const tetri = props.tetri;
  const chroma = props.chroma;
  const noFill = props.noFill;
  const blockInfo = props.blockInfo;

  useEffect(() => {
    regenerate();
    if (ready) {
      setStyle("triangles");
    } else {
      setStyle("none");
    }
  }, [ready, blockNumber, numOfBoxes, tetri, chroma, noFill]);

  const keyGenerator = () => {
    return (
      blockNumber +
      ready.toString() +
      numOfBoxes.toString() +
      tetri.toString() +
      chroma +
      noFill.toString() +
      style
    );
  };

  const [uniqueKey, setUniqueKey] = useState(keyGenerator());

  // In order of how the palette is generated. Ideally it would be
  // best if the names would come from the data. But I will get to
  // that later
  const colorNames = ["Alpine", "Lavendar", "Tidal", "Crimson"];

  //   TEMPORARILY REMOVING. Minting functionality
  //   const save = async (e: React.SyntheticEvent) => {
  //     if (sketchRef && sketchRef.current) {
  //       // @ts-ignore: Object is possibly 'null'.
  //       const canvas: any = sketchRef.current.sketch.canvas;
  //       const name: string = blockNumber.toString();
  //       const dataURL = canvas.toDataURL();
  //       try {
  //         const result = await sendImage(name, dataURL);
  //         await mintToken(signer as ethers.Signer, result);
  //       } catch (e) {
  //         console.error(e);
  //       }
  //     }
  //   };

  const canvasWidth: number = 400;
  const canvasHeight: number = 400;
  let sketch: GenericSketch;

  const preload = (p5: p5Types) => {
    let paletteIndex = colorNames.indexOf(chroma);
    let table: p5Types.Table = load_colors();
    let opts = {
      numOfBoxes: numOfBoxes,
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

  const regenerate = () => {
    if (uniqueKey != keyGenerator()) {
      setUniqueKey(keyGenerator());
      // p5Instance.redraw();
      console.log("unique key changed...");
    }
  };

  return (
    <Sketch
      ref={sketchRef}
      key={uniqueKey}
      setup={setup}
      draw={draw}
      preload={preload}
    />
  );
};

export default Art;
