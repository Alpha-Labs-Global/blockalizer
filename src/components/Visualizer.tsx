import React, { useState } from "react";
import placeHolder from "../media/square.png";
import { latestBlock } from "../helper/server";
import dayjs from "dayjs";

const relativeTime = require("dayjs/plugin/relativeTime");

interface ComponentProps {}

const Visualizer: React.FC<ComponentProps> = (props: ComponentProps) => {
  const [blockNumber, setBlockNumber] = useState(12345);
  const [timestamp, setTimestamp] = useState("2023-01-09T00:05:41.661Z");
  const [imgUrl, setImgUrl] = useState(placeHolder);

  dayjs().format();
  dayjs.extend(relativeTime);

  const b = (async () => {
    const result = await latestBlock();
    setBlockNumber(result.blockNumber);
    setTimestamp(result.createdAt);
    setImgUrl(result.url);
  })();

  return (
    <div className="visualizer">
      <div className="m-auto w-6/12">
        <h1 className="lg:text-xl md:text-lg sm:text-md">
          Latest Minted Block
        </h1>
        <span className="block mb-3"></span>
        <h1 className="lg:text-sm md:text-sm sm:text-sm text-neutral-500">
          #{blockNumber} | {(dayjs(timestamp) as any).fromNow()}
        </h1>
        <span className="block mb-2"></span>
        <img src={imgUrl} className="w-full"></img>
      </div>
    </div>
  );
};

export default Visualizer;
