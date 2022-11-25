// import React, { useState } from "react";
// import Sketch from "react-p5";
// import p5Types from "p5";

// import "./App.css";

// interface ComponentProps {}

// const App: React.FC<ComponentProps> = (props: ComponentProps) => {
//   const [positionX, setPositionX] = useState(50);
//   const [shape, setShape] = useState("rect");

//   const positionY = 50;

//   const canvasWidth: number = 400;
//   const canvasHeight: number = 400;

//   const crystalSize = 500;
//   const sides = 6;
//   let palette;

//   const setup = (p5: p5Types, canvasParentRef: Element) => {
//     p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
//     p5.rectMode(p5.CENTER);

//     palette = [
//       p5.color(255, 52, 154), // pink
//       p5.color(4, 0, 152), // blue
//     ];

//     p5.noLoop();
//   };

//   const drawMiddleStuff = (p5: p5Types) => {
//     p5.push();
//     p5.translate(canvasWidth / 2, canvasHeight / 2);
//     p5.rotate(p5.PI / 4);
//     switch (shape) {
//       case "rect":
//         p5.rect(0, 0, 50, 50);
//         break;
//       case "circle":
//         p5.ellipse(0, 0, 50, 50);
//         break;
//     }
//     p5.fill("red");
//     p5.ellipse(0, 0, 10, 10);
//     p5.pop();
//   };

//   const draw = (p5: p5Types) => {
//     p5.background(230);
//     p5.ellipse(positionX, positionY, 70, 70);
//     drawMiddleStuff(p5);
//     setPositionX(positionX + 1);
//   };

//   const resetPosition = (e: React.SyntheticEvent) => {
//     setPositionX(50);
//   };

//   const handleChange = (e: any) => {
//     setShape(e.currentTarget.value);
//   };

//   const radioButtons = (
//     <div>
//       <input
//         type="radio"
//         onChange={handleChange}
//         value="circle"
//         name="shape"
//         checked={shape === "circle"}
//       />{" "}
//       Circle
//       <input
//         type="radio"
//         onChange={handleChange}
//         value="rect"
//         checked={shape === "rect"}
//         name="shape"
//       />{" "}
//       Rect
//       <input
//         type="radio"
//         onChange={handleChange}
//         value="none"
//         name="shape"
//       />{" "}
//       None
//     </div>
//   );

//   return (
//     <div className="App">
//       {radioButtons}
//       <button onClick={resetPosition}>Reset</button>
//       <hr />
//       <Sketch setup={setup} draw={draw} />
//     </div>
//   );
// };

// export default App;

export {}