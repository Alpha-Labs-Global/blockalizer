import React, { useState } from "react";
import "./Controls.scss";

interface ComponentProps {
  numOfBoxes: number;
  tetri: number;
  noFill: boolean;
  chroma: string;
  disableMint: boolean;
  premium: boolean;
  animate: boolean;
  setNumOfBoxes(numOfBoxes: number): void;
  setAnimate(animate: boolean): void;
  setTetri(tetri: number): void;
  setNoFill(noFill: boolean): void;
  setChroma(chroma: string): void;
  mintHandler(): void;
}

const Controls: React.FC<ComponentProps> = (props: ComponentProps) => {
  const numOfBoxes = props.numOfBoxes;
  const tetri = props.tetri;
  const noFill = props.noFill;
  const chroma = props.chroma;
  const premium = props.premium;
  const mintHandler = props.mintHandler;

  const setNumOfBoxes = props.setNumOfBoxes;
  const setTetri = props.setTetri;
  const setNoFill = props.setNoFill;
  const setChroma = props.setChroma;
  const disableMint = props.disableMint;
  const animate = props.animate;
  const setAnimate = props.setAnimate;

  return (
    <div className="w-[80%]">
      <span className="block mt-4"></span>
      <div className="controlsbx">
        <div className="flexbx">
          <div className="lftbx">Grid Size</div>
          <div className="rghtbx">
            <div className="controltabs">
              <div
                className={`tbs ${numOfBoxes === 3 ? "active" : ""}`}
                onClick={(e) => {
                  setNumOfBoxes(3);
                }}
              >
                3
              </div>
              <div
                className={`tbs ${numOfBoxes === 6 ? "active" : ""}`}
                onClick={(e) => {
                  setNumOfBoxes(6);
                }}
              >
                6
              </div>
              <div
                className={`tbs ${numOfBoxes === 9 ? "active" : ""}`}
                onClick={(e) => {
                  setNumOfBoxes(9);
                }}
              >
                9
              </div>
              <div
                className={`tbs ${numOfBoxes === 12 ? "active" : ""}`}
                onClick={(e) => {
                  setNumOfBoxes(12);
                }}
              >
                12
              </div>
            </div>
          </div>
        </div>
        <div className="spacerx"></div>
        {/* <div className="flexbx flex2">
       <div className="lftbx">Anti-Block</div>
       <div className="rghtbx">
         <div className="controltabs">
           <div className={`tbs ${tetri === 0 ? "active" : ""}`} onClick={(e) => {setTetri(0);}}>Off</div>
           <div className={`tbs ${tetri === 1 ? "active" : ""}`} onClick={(e) => {setTetri(1);}}>Low</div>
           <div className={`tbs ${tetri === 2 ? "active" : ""}`} onClick={(e) => {setTetri(2);}}>Med</div>
           <div className={`tbs ${tetri === 3 ? "active" : ""}`} onClick={(e) => {setTetri(3);}}>High</div>
         </div>
       </div>
     </div> */}
        {/* <div className="spacerx"></div>
     <div className="flexbx">
       <div className="lftbx">Fill</div>
       <div className="rghtbx">
         <div className="controltabs">
           <div className={`tbs ${noFill? "active" : ""}`} onClick={(e) => {setNoFill(true)}}>Off</div>
           <div className={`tbs ${!noFill ? "active" : ""}`} onClick={(e) => {setNoFill(false)}}>On</div>
         </div>
       </div>
     </div> */}
        {/* <div className="spacerx"></div>
     <div className="flexbx">
       <div className="lftbx">Animation Display</div>
       <div className="rghtbx">
         <div className="animatedisplay"  onClick={() => { setAnimate(!animate)}}>
             {!animate ? <div className="coloured">Run</div> : <div>Off</div>}
         </div>
       </div>
     </div> */}
        <div className="spacerx"></div>
        <div className="flexbx">
          <div className="lftbx">Chroma</div>
          <div className={`rghtbx chromaboxes ${chroma}`}>
            <div className="text">{chroma}</div>
            <div className="circleboxes">
              <div
                className="circleboxOuter hifi"
                onClick={() => {
                  setChroma("hifi");
                }}
              >
                <div className="circleboxinner"></div>
              </div>
              <div
                className="circleboxOuter berry"
                onClick={() => {
                  setChroma("berry");
                }}
              >
                <div className="circleboxinner"></div>
              </div>
              <div
                className="circleboxOuter candy"
                onClick={() => {
                  setChroma("candy");
                }}
              >
                <div className="circleboxinner"></div>
              </div>
              <div
                className="circleboxOuter arctic"
                onClick={() => {
                  setChroma("arctic");
                }}
              >
                <div className="circleboxinner"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="spacerx"></div>
        <button className="mintbutton" onClick={mintHandler}>
          Mint | 0.015E
        </button>
      </div>
      <span className="block mb-10"></span>
    </div>
  );
};

export default Controls;
