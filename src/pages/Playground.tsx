import React, { useState, useEffect, useRef } from "react";
import "../App.css";

import Art from "../components/Art";
import Controls from "../components/Controls";
import BlockSelector from "../components/BlockSelector";
import Gallery from "../components/Gallery";

import { Address, useSigner } from "wagmi";

import { fetchBlocks, sendImage } from "../helper/server";
import { mintToken, getOwnedPieces, listenToEvents } from "../helper/wallet";
import { ethers, BigNumber } from "ethers";

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
  const [serverFailure, setServerFailure] = useState(false);
  const [blocks, setBlocks] = useState<string[]>([]);
  const [blocksInformation, setBlocksInformation] = useState(new Map());
  const [address, setAddress] = useState(""); // cache address so it is not refreshed everytime
  const [sort, setSort] = useState("Oldest");
  const [ownedPieces, setOwnedPieces] = useState<Array<any>>([]);
  const [mintSuccess, setMintSuccess] = useState<boolean>(false);

  const [numOfBoxes, setNumOfBoxes] = useState(9);
  const [tetri, setTetri] = useState(0);
  const [noFill, setNoFill] = useState(false);
  const [chroma, setChroma] = useState("Alpine");

  const lazySetBlocks = async () => {
    if (signer) {
      // TODO: replace with useMemo
      const newAddress = await signer.getAddress();
      if (newAddress == address) return;

      setAddress(newAddress);
      console.log("Fetching blocks...");
      try {
        const result = await fetchBlocks(newAddress);
        setBlocksInformation(result);
      } catch (e) {
        console.error(e);
        setServerFailure(true);
      }
    }
  };

  const lazySetGallery = async () => {
    if (signer) {
      // TODO: replace with useMemo
      const newAddress = await signer.getAddress();
      if (newAddress == address) return;

      try {
        const ownedPieces = await getOwnedPieces(signer);
        console.log(ownedPieces);
        setOwnedPieces(ownedPieces);
        listenToEvents(signer, (from: string, to: string, token: BigNumber) => {
          // TODO: validate
          setMintSuccess(true);
        });
      } catch (e) {
        console.log(e);
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
      lazySetGallery();
    }
  });

  useEffect(() => {
    var elem = document.getElementById("widthIndicator");
    if (elem != undefined) {
      elem.style.height = elem.offsetWidth + "px";
    }
  });

  window.addEventListener("resize", (e) => {
    var elem = document.getElementById("widthIndicator");
    if (elem != undefined) {
      elem.style.height = elem.offsetWidth + "px";
    }
  });

  useEffect(() => {
    if (mintSuccess) {
      alert("minting was successful!");
      setMintSuccess(false);
    }
  }, [mintSuccess]);

  useEffect(() => {
    if (blocksInformation.size > 0) {
      const keys: string[] = Array.from(blocksInformation.keys());
      setBlocks(keys);
      setBlockNumber(Array.from(blocksInformation.keys())[0]);
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

  const sketchRef = useRef(null);

  const mindHandler = async () => {
    if (sketchRef && sketchRef.current) {
      // @ts-ignore: Object is possibly 'null'.
      const canvas: any = sketchRef.current.sketch.canvas;
      const dataURL = canvas.toDataURL();
      try {
        const result = await sendImage(blockNumber, dataURL, address);
        await mintToken(signer as ethers.Signer, result);
        alert(result)
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div
      className="innerContainer"
      onKeyDown={(e) => {
        if (sort === "Oldest") {
          if (e.key == "ArrowRight") {
            if (blocks.indexOf(blockNumber.toString()) + 1 === blocks.length) {
              setBlockNumber(Number(blocks[0]));
            } else {
              setBlockNumber(
                Number(blocks[blocks.indexOf(blockNumber.toString()) + 1])
              );
            }
            /*let scroll_length = 40;

            var test = document.getElementById("showScroll")
            
            if((test != undefined) && (blockNumber % 3 === 0))
            {
              test.scrollTop += test.clientHeight / blocks.length;
              console.log(test.scrollTop)
            }*/
          } else if (e.key == "ArrowLeft") {
            if (blocks.indexOf(blockNumber.toString()) - 1 === -1) {
              setBlockNumber(Number(blocks[blocks.length - 1]));
            } else {
              setBlockNumber(
                Number(blocks[blocks.indexOf(blockNumber.toString()) - 1])
              );
            }
          }
        } else if (sort === "Newest") {
          if (e.key == "ArrowRight") {
            if (blocks.indexOf(blockNumber.toString()) - 1 === -1) {
              setBlockNumber(Number(blocks[blocks.length - 1]));
            } else {
              setBlockNumber(
                Number(blocks[blocks.indexOf(blockNumber.toString()) - 1])
              );
            }
          } else if (e.key == "ArrowLeft") {
            if (blocks.indexOf(blockNumber.toString()) + 1 === blocks.length) {
              setBlockNumber(Number(blocks[0]));
            } else {
              setBlockNumber(
                Number(blocks[blocks.indexOf(blockNumber.toString()) + 1])
              );
            }
          }
        }
      }}
      tabIndex={0}
    >
      <div className="blockalizerDivLeft">
        <Header onChange={props.onChange}></Header>
      </div>

      {address !== "" && blocks.length == 0 ? null : null}
      {address !== "" && blocks.length > 0 && blockNumber == -1
        ? "Click Block to get started"
        : null}
      {serverFailure ? "Server failed" : null}

      <div className="lg:w-6/12 pt-4 lg:block md:block sm:block md:w-[100%] sm:w-[100%]">
        <div className="lg:w-[70%] lg:ml-[30%] md:w-[60%] md:m-auto sm:w-[90%] sm:m-auto lg:max-w-[600px] lg:min-w-[350px] md:max-w-[600px] md:min-w-[400px] lg:float-right">
          <h1
            className="lg:text-lg md:text-lg sm:text-md text-neutral-500 ml-[10%]"
            id="specialIndicator"
          >
            {address !== "" && blocks.length == 0 ? (
              <div className="text-neutral-500">Loading...</div>
            ) : (
              <div className="text-neutral-500">#{blockNumber}</div>
            )}
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
              {address !== "" && blocks.length == 0 ? (
                <div className="m-auto w-full">
                  <svg
                    viewBox="0 0 353 351"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="1"
                      y="1"
                      width="351"
                      height="348"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M351 2L3.5 349.5"
                      stroke="#EBEBEB"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              ) : (
                <Art
                  blockNumber={blockNumber}
                  ready={ready}
                  numOfBoxes={numOfBoxes}
                  tetri={tetri}
                  chroma={chroma}
                  noFill={noFill}
                  blockInfo={blockInfo}
                  refPointer={sketchRef}
                />
              )}
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
              mintHandler={mindHandler}
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
        blocksInformation={blocksInformation}
        setBlockNumber={setBlockNumber}
      ></BlockSelector>

      <Gallery ownedPieces={ownedPieces}></Gallery>
    </div>
  );
};

export default Playground;
