import React, { useEffect, useState, SyntheticEvent } from "react";
import placeHolder from "./media/square.png";

import "./App.css";
import Generator from "./components/Generator";

import visual from "./media/block-floater.png";

import {
  assign_sketch,
  load_colors,
  all_sketch_styles,
} from "./art-styles/helper";

interface ComponentProps {}

const App: React.FC<ComponentProps> = (props: ComponentProps) => {
  //Home, Search, Mint pages
  const [page, setPage] = useState("Home");

  useEffect(() => {
    //alert("here")
  });

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

      {page === "Sandbox" && <Generator></Generator>}
    </div>
  );
};

export default App;
