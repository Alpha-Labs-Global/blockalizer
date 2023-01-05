import React, { useState, useEffect, useRef } from "react";
import "../App.css";

import Art from "../components/Art";
import Controls from "../components/Controls";
import BlockSelector from "../components/BlockSelector";

import { ConnectKitButton } from "connectkit";
import { useSigner } from "wagmi";

import { fetchBlocks } from "../helper/server";

import "./Playground.css";
import Header from "../components/Header";

interface ComponentProps {
  pageState: string;
  onChange: any;
}

const Playground: React.FC<ComponentProps> = (props: ComponentProps) => {
  const [blockNumber, setBlockNumber] = useState<number>(-1);
  const [blockInfo, setBlockInfo] = useState({});
  const [ready, setReady] = useState(false);
  const [blocks, setBlocks] = useState<string[]>([]);
  const [blocksInformation, setBlocksInformation] = useState(new Map());
  const [address, setAddress] = useState(""); // cache address so it is not refreshed everytime
  const [sort, setSort] = useState("Oldest");

  const [numOfBoxes, setNumOfBoxes] = useState(9);
  const [tetri, setTetri] = useState(0);
  const [noFill, setNoFill] = useState(false);
  const [chroma, setChroma] = useState("Alpine");

  const lazySetBlocks = async () => {
    if (signer) {
      const newAddress = await signer.getAddress();
      if (newAddress == address) return;

      setAddress(newAddress);
      console.log("Fetching blocks...");
      try {
        const result = await fetchBlocks(newAddress);
        setBlocksInformation(result);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // blockInformation --> blocks
  // blockNumber --> blockInfo --> signedInApp

  useEffect(() => {
    if (signer === null) {
      setAddress("");
      setBlocks([]);
    } else {
      lazySetBlocks();
    }
  });

  useEffect(() => {
    if (blocksInformation.size > 0) {
      const keys: string[] = Array.from(blocksInformation.keys());
      setBlocks(keys);
    }
  }, [blocksInformation]);

  useEffect(() => {
    if (blockNumber > 0) {
      const info = blocksInformation.get(blockNumber.toString());
      setBlockInfo(info);
    }
  }, [blockNumber]);

  useEffect(() => {
    if (Object.keys(blockInfo).length !== 0) {
      setReady(true);
    }
  }, [blockInfo]);

  const { data: signer, isError, isLoading } = useSigner();

  return (
    <div
      className="innerContainer"
      onKeyDown={(e) => {
        if (e.key == "ArrowRight") {
          if (blocks.indexOf(blockNumber.toString()) + 1 === blocks.length) {
            setBlockNumber(Number(blocks[0]));
          } else {
            setBlockNumber(
              Number(blocks[blocks.indexOf(blockNumber.toString()) + 1])
            );
          }
        } else if (e.key == "ArrowLeft") {
          if (blocks.indexOf(blockNumber.toString()) - 1 === -1) {
            setBlockNumber(Number(blocks[blocks.length - 1]));
          } else {
            setBlockNumber(
              Number(blocks[blocks.indexOf(blockNumber.toString()) - 1])
            );
          }
        }
      }}
      tabIndex={0}
    >
      <div className="blockalizerDivLeft">
        <Header onChange={props.onChange}></Header>
      </div>

      {address !== "" && blocks.length == 0 ? "Loading..." : null}
      {address !== "" && blocks.length > 0 && blockNumber == -1
        ? "Click Block to get started"
        : null}

      <div className="lg:w-6/12 pt-4 lg:block md:block sm:block md:w-[100%] sm:w-[100%]">
        <div className="lg:w-[70%] lg:ml-[30%] md:w-[90%] md:m-auto sm:w-[90%] sm:m-auto">
          <h1
            className="lg:text-lg md:text-lg sm:text-md text-neutral-500 ml-[10%]"
            id="specialIndicator"
          >
            #{blockNumber}
          </h1>
          <span className="block mt-4"></span>

          <div className="m-auto w-[100%] flex flex-row flex-wrap">
            <button
              className="w-[10%] flex"
              onClick={(e) => {
                if (blocks.indexOf(blockNumber.toString()) - 1 === -1) {
                  setBlockNumber(Number(blocks[blocks.length - 1]));
                } else {
                  setBlockNumber(
                    Number(blocks[blocks.indexOf(blockNumber.toString()) - 1])
                  );
                }
              }}
            >
              <svg
                className="align-middle w-full m-auto w-[60%] mr-[40%]"
                viewBox="0 0 26 68"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23 66L3 34L23 2"
                  stroke="#EBEBEB"
                  strokeOpacity="0.24"
                  strokeWidth="5"
                />
              </svg>
            </button>

            <div className="w-[80%]" id="widthIndicator">
              <Art
                blockNumber={blockNumber}
                ready={ready}
                numOfBoxes={numOfBoxes}
                tetri={tetri}
                chroma={chroma}
                noFill={noFill}
                blockInfo={blockInfo}
              />
            </div>

            <button
              className="w-[10%] flex"
              onClick={(e) => {
                if (
                  blocks.indexOf(blockNumber.toString()) + 1 ===
                  blocks.length
                ) {
                  setBlockNumber(Number(blocks[0]));
                } else {
                  setBlockNumber(
                    Number(blocks[blocks.indexOf(blockNumber.toString()) + 1])
                  );
                }
              }}
            >
              <svg
                className="align-middle w-full m-auto w-[60%] ml-[40%]"
                viewBox="0 0 26 68"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 2L23 34L3 66"
                  stroke="#EBEBEB"
                  strokeOpacity="0.24"
                  strokeWidth="5"
                />
              </svg>
            </button>

            <div className="w-[10%] flex"></div>

            <Controls
              numOfBoxes={numOfBoxes}
              tetri={tetri}
              noFill={noFill}
              chroma={chroma}
              setNumOfBoxes={setNumOfBoxes}
              setTetri={setTetri}
              setNoFill={setNoFill}
              setChroma={setChroma}
            ></Controls>

            <button
              className="w-[10%] flex"
              onClick={(e) => {
                if (
                  blocks.indexOf(blockNumber.toString()) + 1 ===
                  blocks.length
                ) {
                  setBlockNumber(Number(blocks[0]));
                } else {
                  setBlockNumber(
                    Number(blocks[blocks.indexOf(blockNumber.toString()) + 1])
                  );
                }
              }}
            ></button>
          </div>

          <span className="block mt-8"></span>

          <div className="w-[100%]">
            <span className="block mt-8"></span>
          </div>
        </div>
      </div>

      <BlockSelector
        sort={sort}
        setSort={setSort}
        blocks={blocks}
        blockNumber={blockNumber}
        setBlockNumber={setBlockNumber}
      ></BlockSelector>
    </div>
  );
};

export default Playground;
