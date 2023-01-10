import React, { useState, useEffect, useRef } from "react";
import "../App.css";

import Art from "../components/Art";
import Controls from "../components/Controls";
import BlockSelector from "../components/BlockSelector";
import Gallery from "../components/Gallery";

import { Address, useSigner } from "wagmi";

import {
  fetchBlocks,
  sendImage,
  mintingSuccess,
  mintingFailure,
} from "../helper/server";
import { mintToken, getOwnedPieces, listenToEvents, getTotalMinted } from "../helper/wallet";
import { ethers, BigNumber } from "ethers";

import "./Playground.css";
import Header from "../components/Header";

interface ComponentProps {
  pageState: string;
  onChange: any;
}

const Playground: React.FC<ComponentProps> = (props: ComponentProps) => {
  const [blockNumber, setBlockNumber] = useState<number>(-1);
  const [acquiredBlockNumber, setAcquiredBlockNumber] = useState<number>(-1);
  const [blockInfo, setBlockInfo] = useState({});
  const [loadArt, setLoadArt] = useState(false);
  const [blocks, setBlocks] = useState<string[]>([]);
  const [blocksInformation, setBlocksInformation] = useState(new Map());
  const [address, setAddress] = useState(""); // cache address so it is not refreshed everytime
  const [sort, setSort] = useState("Oldest");
  const [ownedPieces, setOwnedPieces] = useState<Array<any>>([]);
  const [listeningMint, setListeningMint] = useState<boolean>(false);
  const [alreadyMinted, setAlreadyMinted] = useState<boolean>(false);
  const [informationText, setInformationText] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");

  const [numOfBoxes, setNumOfBoxes] = useState(9);
  const [tetri, setTetri] = useState(0);
  const [noFill, setNoFill] = useState(false);
  const [chroma, setChroma] = useState("Alpine");
  const [totalMinted, setTotalMinted] = useState(0)

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
        if (result.size > 0) {
          const keys: string[] = Array.from(result.keys());
          setBlocks(keys);
          setBlockNumber(Number(keys[0]));
        }
      } catch (e: any) {
        console.error(e);
      }
    }
  };

  const resetView = async () => {
    if (signer) {
      try {
        const address = await signer.getAddress();
        const result = await fetchBlocks(address);
        const ownedPieces = await getOwnedPieces(signer);
        setOwnedPieces(ownedPieces);
        setBlocksInformation(result);

        const tokenCount = await getTotalMinted(signer);
        setTotalMinted(tokenCount.toNumber())
        //call here
      } catch (e: any) {
        console.error(e);
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
        setOwnedPieces(ownedPieces);
        const tokenCount = await getTotalMinted(signer);
        setTotalMinted(tokenCount.toNumber())



        listenToEvents(signer, (from: string, to: string, token: BigNumber) => {
          // TODO: validate
          setListeningMint(true);
        });
      } catch (e: any) {
        console.log(e);
      }
    }
  };

  // order of state execution
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

  const lazyUpdateMint = async () => {
    await mintingSuccess(acquiredBlockNumber);
    await resetView();
    setListeningMint(false);
  };

  useEffect(() => {
    if (listeningMint) {
      setInformationText("Minting completed. Enjoy your block!");
      lazyUpdateMint();
    }
  }, [listeningMint]);

  useEffect(() => {
    if (blockNumber > 0) {
      const info = blocksInformation.get(blockNumber.toString());
      setBlockInfo(info);
      setLoadArt(true);

      if (
        (info as any).status === "reserved" ||
        (info as any).status === "acquired"
      ) {
        setAlreadyMinted(true);
        setInformationText(
          "Select a different block. This one has already been minted."
        );
      } else {
        setAlreadyMinted(false);
        setInformationText("Looks good! Ready to mint?");
      }
    }
  }, [blockNumber]);

  useEffect(() => {}, [blockInfo]);

  const { data: signer, isError, isLoading } = useSigner();

  const sketchRef = useRef(null);

  const mintHandler = async () => {
    if (sketchRef && sketchRef.current) {
      // @ts-ignore: Object is possibly 'null'.
     
      const canvas: any = sketchRef.current.sketch.canvas;
     // canvas.cloneNode(true)
     
      let canvas2 = canvas.cloneNode(true)

      const dataURL = canvas.toDataURL(); 
      console.log(dataURL)
      console.log("sending new enw")

      
     try {
        const result = await sendImage(blockNumber, dataURL, address);
        await mintToken(signer as ethers.Signer, result);
        setInformationText("Minting has started! Please wait...");
      } catch (e: any) {
        mintingFailure(blockNumber);
        console.error(e);
      } finally {
        setAcquiredBlockNumber(blockNumber);
      }
    }
  };

  const iterateThroughBlocks = (key: string) => {
    if (sort === "Oldest") {
      if (key == "ArrowRight") {
        if (blocks.indexOf(blockNumber.toString()) !== blocks.length - 1) {
          setBlockNumber(
            Number(blocks[blocks.indexOf(blockNumber.toString()) + 1])
          );
        }
      } else if (key == "ArrowLeft") {
        if (blocks.indexOf(blockNumber.toString()) !== 0) {
          setBlockNumber(
            Number(blocks[blocks.indexOf(blockNumber.toString()) - 1])
          );
        }
      }
    } else if (sort === "Newest") {
      if (key == "ArrowRight") {
        if (blocks.indexOf(blockNumber.toString()) !== 0) {
          setBlockNumber(
            Number(blocks[blocks.indexOf(blockNumber.toString()) - 1])
          );
        }
      } else if (key == "ArrowLeft") {
        if (blocks.indexOf(blockNumber.toString()) !== blocks.length - 1) {
          setBlockNumber(
            Number(blocks[blocks.indexOf(blockNumber.toString()) + 1])
          );
        }
      }
    }
  };

  return (
    <div
      className="innerContainer"
      onKeyDown={(e) => iterateThroughBlocks(e.key)}
      tabIndex={0}
    >
      <div className="blockalizerDivLeft">
        <Header onChange={props.onChange}></Header>
      </div>

      {address !== "" && blocks.length == 0 ? null : null}
      {address !== "" && blocks.length > 0 && blockNumber == -1
        ? "Click Block to get started"
        : null}

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
                  ready={loadArt}
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
              mintHandler={mintHandler}
              alreadyMinted={alreadyMinted}
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
        informationText={informationText}
        errorText={errorText}
        totalMinted={totalMinted}
      ></BlockSelector>

      <Gallery ownedPieces={ownedPieces}></Gallery>
    </div>
  );
};

export default Playground;
