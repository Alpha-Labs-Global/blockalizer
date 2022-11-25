import React, { useState } from "react";
import Sketch from "react-p5";
import p5Types from "p5";

import "./App.css";
import colors from "./data/colors.json";

// import DrawWheel from "./art-styles/wheel";
import DrawSimpleSquares from "./art-styles/simple-squares";
import DrawColoredRectangles from "./art-styles/colored-rectangles";
import DrawTenPrint from "./art-styles/ten-print";
import DrawDiamond from "./art-styles/diamond";
import DrawSimpleTriangles from "./art-styles/simple-triangles";
import DrawColoredTriangles from "./art-styles/colored-triangles";
import DrawAscii from "./art-styles/ascii";

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
  ];
  const [selectedStyle, setStyle] = useState("colored-rectangles");
  const styleHandler = (e: any) => {
    setStyle(e.currentTarget.value);
  };

  const [selectedSeed, setSeed] = useState("8");
  const seedHandler = (e: any) => {
    setSeed(e.currentTarget.value);
  };

  const [uniqueKey, setUniqueKey] = useState(selectedSeed + selectedStyle);

  const canvasWidth: number = 400;
  const canvasHeight: number = 400;
  let p5Instance: p5Types;
  let table: p5Types.Table;

  let palette: Array<p5Types.Color>;

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
  };

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    console.log("canvas setup again...");
    p5.randomSeed(parseInt(selectedSeed));
    p5Instance = p5;

    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);

    palette = [
      p5.color(255, 52, 154), // pink
      p5.color(4, 0, 152), // blue
    ];

    p5.noLoop();
  };

  const draw = (p5: p5Types) => {
    console.log("DRAW", selectedStyle);
    p5.background(230);
    let canvasDraw = new DrawSimpleSquares(
      p5,
      canvasWidth,
      canvasHeight,
      table
    );
    switch (selectedStyle) {
      case "colored-triangles":
        canvasDraw = new DrawColoredTriangles(
          p5,
          canvasWidth,
          canvasHeight,
          table
        );
        break;
      case "ascii":
        canvasDraw = new DrawAscii(p5, canvasWidth, canvasHeight, table);
        break;
      case "colored-rectangles":
        canvasDraw = new DrawColoredRectangles(
          p5,
          canvasWidth,
          canvasHeight,
          table
        );
        break;
      case "ten-print":
        canvasDraw = new DrawTenPrint(p5, canvasWidth, canvasHeight, table);
        break;
      case "diamond":
        canvasDraw = new DrawDiamond(p5, canvasWidth, canvasHeight, table);
        break;
      case "simple-triangles":
        canvasDraw = new DrawSimpleTriangles(
          p5,
          canvasWidth,
          canvasHeight,
          table
        );
        break;
    }
    canvasDraw.draw();
  };

  const regenerate = (e: React.SyntheticEvent) => {
    if (uniqueKey != selectedSeed + selectedStyle) {
      setUniqueKey(selectedSeed + selectedStyle);
      // p5Instance.redraw();
      console.log("random seed changed...");
    }
  };

  return (
    <div className="App">
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
  );
};

export default App;
