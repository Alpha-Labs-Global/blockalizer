import React, { useEffect, useState } from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import placeHolder from "./media/square.png";

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
  const [showStyle, setShowStyle] = useState(false);

  const [selectedSeed, setSeed] = useState("8");
  const seedHandler = (e: any) => {
    setSeed(e.currentTarget.value);
  };

  const [uniqueKey, setUniqueKey] = useState(selectedSeed + selectedStyle);

  //Home, Search, Mint pages
  const [page, setPage] = useState("Home");

  useEffect(() => {
    //alert("here")
  });

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

  return (
    <div className="pageContainer">
      {page === "Home" && (
        <div className="contentContainer">
          <div className="view">
            {/*md:w-9/12*/}

            <div className="m-auto lg:w-4/6 md:w-9/12 sm:w-9/12 break-words">
              <div className="">
                <h1 className="lg:text-5xl md:text-4xl sm:text-3xl">
                  Blockalizer
                </h1>
                <p className="lg:text-2xl md:text-xl sm:text-md">
                  Blockchain transaction hash art processor
                  <br></br>
                  <span className="block mb-4"></span>
                  Mint blocks that mean something to you
                </p>
                {/*<span className="block mb-5"></span>
              <div className="w-9/12">
                <div className="float-left h-2 mt-3 w-8/12 bg-white"></div>
                <div className="point"></div>
  </div>*/}
                <span className="block mb-5"></span>
                <br></br>
                <br></br>
                <p
                  className="lg:text-3xl md:text-2xl sm:text-lg"
                  onClick={(e) => {
                    setPage("Search");
                  }}
                >
                  Try it out
                </p>
                <p
                  className="lg:text-3xl md:text-2xl sm:text-lg"
                  onClick={(e) => {
                    setPage("Sandbox");
                  }}
                >
                  Sandbox
                </p>
              </div>
            </div>
          </div>

          <div className="visualizer">
            <div className="m-auto w-6/12">
              <h1 className="lg:text-xl md:text-lg sm:text-md">
                Latest Minted Block
              </h1>
              <span className="block mb-3"></span>
              <h1 className="lg:text-sm md:text-sm sm:text-sm text-neutral-500">
                #12345 | 3 hours ago
              </h1>
              <span className="block mb-2"></span>
              <img src={placeHolder} className="m-auto w-12/12"></img>
            </div>
          </div>
        </div>
      )}

      {page === "Search" && (
        <div className="contentContainer">
          <div className="searchView">
            {/*md:w-9/12*/}

            <div className="m-auto lg:w-3/12 md:w-6/12 sm:w-9/12 break-words">
              <p
                className="lg:text-lg md:text-md sm:text-sm"
                onClick={() => {
                  setPage("Home");
                }}
              >
                &lt; back
              </p>
              <span className="block mb-5"></span>
              <h1 className="lg:text-5xl md:text-4xl sm:text-2xl">
                Enter Block #
              </h1>
              <p className="lg:text-3xl md:text-2xl sm:text-xl">
                <i>Ex: Block 1234</i>
                <br></br>
                <p className="lg:text-2xl md:text-xl sm:text-lg">Available</p>
                <span className="block mb-5"></span>

                <input
                  type="text"
                  id="first_name"
                  className="lg:w-9/12 bg-transparent border-2 border-emerald-400 text-white lg:text-lg md:text-md sm:text-sm rounded-lg block w-full p-2.5"
                  placeholder=""
                  required
                ></input>
              </p>
              <span className="block mb-5"></span>
              <button
                className="bg-emerald-400 hover:bg-white hover:bg-opacity-70 text-black font-bold py-2 px-4 rounded"
                onClick={() => {
                  setPage("Mint");
                }}
              >
                Blockalize
              </button>
            </div>
          </div>
        </div>
      )}

      {page === "Mint" && (
        <div className="contentContainer">
          <div className="searchView">
            {/*md:w-9/12*/}

            <div className="m-auto lg:w-3/12 md:w-6/12 sm:w-9/12 break-words">
              <p
                className="lg:text-lg md:text-md sm:text-sm"
                onClick={() => {
                  setPage("Search");
                }}
              >
                &lt; back
              </p>
              <span className="block mb-5"></span>
              <p className="lg:text-2xl md:text-xl sm:text-lg">Block #1234</p>
              <span className="block mb-5"></span>

              <div className="bg-white border-emerald-400 block w-full p-2.5 ">
                <img src="https://cdn.shopify.com/s/files/1/0020/9508/7671/products/MTO0295-Classic-Uniform-Squares-Blue-Glass-Mosaic-Tile_a.jpg?v=1532699262"></img>
              </div>
              <span className="block mb-5"></span>

              <div className="flex">
                <button
                  type="submit"
                  className="m-auto bg-emerald-400  text-white p-2 rounded lg:text-lg md:text-md sm:text-sm w-5/12"
                >
                  Mint | 0.01E
                </button>
                <button
                  type="submit"
                  className="m-auto bg-gray-400 text-white p-2 ml-6 rounded lg:text-lg md:text-md sm:text-sm w-5/12"
                >
                  Random Block
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {page === "Sandbox" && (
        <div className="contentContainer">
          {showStyle ? styleSelector : null}
          <div>
            <input
              type="number"
              value={selectedSeed.toString()}
              onChange={seedHandler}
            />
            <button onClick={regenerate}>Regenerate</button>
          </div>
          <hr />
          <Sketch key={uniqueKey} setup={setup} draw={draw} preload={preload} />
        </div>
      )}
    </div>
  );
};

export default App;
