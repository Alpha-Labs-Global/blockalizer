import React, { useState } from "react";
import Sketch from "react-p5";
import p5Types from "p5";

import "./App.css";
import colors from "./data/colors.json";
import visual from "./media/block-floater.png";

import SimpleSquaresSketch from "./art-styles/simple-squares";
import ColoredRectanglesSketch from "./art-styles/colored-rectangles";
import TenPrintSketch from "./art-styles/ten-print";
import DiamondSketch from "./art-styles/diamond";
import SimpleTrianglesSketch from "./art-styles/simple-triangles";
import ColoredTrianglesSketch from "./art-styles/colored-triangles";
import AsciiSketch from "./art-styles/ascii";
import FlowfieldSketch from "./art-styles/flow-field";
import GenericSketch from "./art-styles/generic_sketch";

interface ComponentProps {}

const App: React.FC<ComponentProps> = (props: ComponentProps) => {
  const styles = [
    "colored-triangles",
    // "simple-squares",
    "ascii",
    "colored-rectangles",
    "ten-print",
    "diamond",
    "simple-triangles",
    "flow-field",
  ];
  const [selectedStyle, setStyle] = useState("colored-triangles");
  const styleHandler = (e: any) => {
    setStyle(e.currentTarget.value);
  };

  const [selectedSeed, setSeed] = useState("8");
  const seedHandler = (e: any) => {
    setSeed(e.currentTarget.value);
  };

  const [uniqueKey, setUniqueKey] = useState(selectedSeed + selectedStyle);
  
  //3 page stack
  const [page, setPage] = useState(0);


  const canvasWidth: number = 400;
  const canvasHeight: number = 400;
  let table: p5Types.Table;
  let sketch: GenericSketch;

  const preload = (p5: p5Types) => {
    table = new p5Types.Table();
    let column: keyof typeof colors[0];
    for (column in colors[0]) {
      table.addColumn(column);
    }

    let row: p5Types.TableRow;
    colors.map((color) => {
      row = table.addRow();
      let prop: keyof typeof color;
      for (prop in color) {
        row?.set(prop, color[prop]);
      }
    });

    sketch = new SimpleSquaresSketch(p5, canvasWidth, canvasHeight, table);
    switch (selectedStyle) {
      case "colored-triangles":
        sketch = new ColoredTrianglesSketch(
          p5,
          canvasWidth,
          canvasHeight,
          table
        );
        break;
      case "ascii":
        sketch = new AsciiSketch(p5, canvasWidth, canvasHeight, table);
        break;
      case "colored-rectangles":
        sketch = new ColoredRectanglesSketch(
          p5,
          canvasWidth,
          canvasHeight,
          table
        );
        break;
      case "ten-print":
        sketch = new TenPrintSketch(p5, canvasWidth, canvasHeight, table);
        break;
      case "diamond":
        sketch = new DiamondSketch(p5, canvasWidth, canvasHeight, table);
        break;
      case "simple-triangles":
        sketch = new SimpleTrianglesSketch(
          p5,
          canvasWidth,
          canvasHeight,
          table
        );
        break;
      case "flow-field":
        sketch = new FlowfieldSketch(p5, canvasWidth, canvasHeight, table);
        break;
    }
  };

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    console.log("canvas setup again...");

    p5.randomSeed(parseInt(selectedSeed));

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

  return (
    <div className="pageContainer">
      <div className="contentContainer">
        <div className="view">
          {/*md:w-9/12*/}
          <div className="m-auto lg:w-6/12 md:w-9/12 sm:w-9/12 break-words">
            <h1 className="lg:text-6xl md:text-5xl sm:text-3xl">Blockalizer</h1>
            <p className="lg:text-2xl md:text-xl sm:text-md">
              Blockchain transaction hash art processor
              <br></br>
              <span className="block mb-4"></span>
              Mint blocks that mean something to you
            </p>
            <span className="block mb-5"></span>
            <p className="lg:text-3xl md:text-2xl sm:text-lg">
              Try it out
            </p>

          </div>
        </div>

        <div className="visualizer">
          <img src={visual} className="m-auto w-7/12"></img>
        </div>

       
        
      </div>
      
     
      {/*Style:{" "}
      <select name="select" value={selectedStyle} onChange={styleHandler}>
        {styles.map(function (n, i) {
          return (
            <option value={n} key={i}>
              {n}
            </option>
          );
        })}
      </select>
      <div>
        <input
          type="number"
          value={selectedSeed.toString()}
          onChange={seedHandler}
        />
        <button onClick={regenerate}>Regenerate</button>
      </div>
      <hr />
      <Sketch key={uniqueKey} setup={setup} draw={draw} preload={preload} />*/}
    </div>
  );
};

export default App;
