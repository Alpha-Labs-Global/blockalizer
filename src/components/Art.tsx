import React, { useState, useEffect } from "react";
import Sketch from "react-p5";
import p5Types from "p5";

import { assign_sketch, load_colors, BlockInfo } from "../helper/sketch";
import { getBlockInfo } from "../helper/server";
import placeholder from "../media/updatingMint.png";

import GenericSketch from "../art-styles/generic_sketch";

interface ComponentProps {
  blockNumber: number;
  ready: boolean;
  numOfBoxes: number;
  tetri: number;
  chroma: string;
  noFill: boolean;
  blockInfo: any;
  refPointer: React.MutableRefObject<null>;
  alreadyMinted: boolean;
  animate: boolean;
  colorNames: Array<string>;
  paperIndex: number;
  setAnimate(animate: boolean): void;
}

export const Art: React.FC<ComponentProps> = (props: ComponentProps) => {
  const [style, setStyle] = useState("none");
  const [imgUrl, setImgUrl] = useState("");

  const blockNumber = props.blockNumber;
  const ready = props.ready;
  const numOfBoxes = props.numOfBoxes;
  const tetri = props.tetri;
  const chroma = props.chroma;
  const noFill = props.noFill;
  const blockInfo = props.blockInfo;
  const refPointer = props.refPointer;
  const alreadyMinted = props.alreadyMinted;
  const animate = props.animate;
  const colorNames = props.colorNames;
  const paperIndex = props.paperIndex;
  const setAnimate = props.setAnimate;

  const lazyGetInfo = async () => {
    if (alreadyMinted) {
      try {
        const info = await getBlockInfo(blockNumber);
        const url = info.url;
        setImgUrl(url);
      } catch (e) {
        console.log(e);
      }
    }
  };

  useEffect(() => {
    lazyGetInfo();
  }, [alreadyMinted, blockNumber]);

  useEffect(() => {
    regenerate();
    if (ready) {
      setStyle("alive-grid");
    } else {
      setStyle("none");
    }
  }, [ready, blockNumber, numOfBoxes, tetri, chroma, noFill, animate]);

  const keyGenerator = () => {
    return (
      blockNumber +
      ready.toString() +
      numOfBoxes.toString() +
      tetri.toString() +
      chroma +
      noFill.toString() +
      style +
      animate.toString()
    );
  };

  const [uniqueKey, setUniqueKey] = useState(keyGenerator());

  const canvasWidth: any =
    document.getElementById("widthIndicator")?.offsetWidth;
  const canvasHeight: any =
    document.getElementById("widthIndicator")?.offsetWidth;
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
      animate: animate,
      paperIndex: paperIndex,
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
    if (!sketch) {
      console.log("sketch now undefined");
      p5.noLoop();
    }
    sketch?.draw();
  };

  const regenerate = () => {
    if (uniqueKey != keyGenerator()) {
      setUniqueKey(keyGenerator());
      // p5Instance.redraw();
      console.log("Regenerating Art...");
    }
  };

  const resizeCanvas = (p5: p5Types) => {
    //console.log(document.getElementById("defaultCanvas0")?.style.width = 0)

    var can = document.getElementById("defaultCanvas0");
    if (can != null) {
      can.style.width =
        document.getElementById("widthIndicator")?.offsetWidth + "px";
      can.style.height =
        document.getElementById("widthIndicator")?.offsetWidth + "px";
    }

    //p5.resizeCanvas(document.getElementById("widthIndicator")?.offsetWidth as number, document.getElementById("widthIndicator")?.offsetWidth as number, false);
  };

  return (
    <div>
      {alreadyMinted ? (
        <img
          src={imgUrl}
          className="w-[100%]"
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = placeholder;
          }}
        ></img>
      ) : (
        <div>
          <Sketch
            ref={refPointer}
            key={uniqueKey}
            setup={setup}
            draw={draw}
            preload={preload}
            windowResized={resizeCanvas}
          />
        </div>
      )}
    </div>
  );
};

export default React.memo(Art);
