const { REACT_APP_SERVER_URL } = process.env;
const SERVER_URL =
  REACT_APP_SERVER_URL || "https://blockalizer-backend.vercel.app";

export const fetchBlocks = async (
  address: string
): Promise<Map<string, Object>> => {
  const endpoint = "/api/blocks";
  console.log("calling " + endpoint);
  const body = JSON.stringify({ address });
  const response = await fetch(SERVER_URL + endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body,
  });
  if (!response.ok) throw new Error();

  const content = await response.json();
  const blocknumbersToInfo: Map<string, Object> = content.data.reduce(function (
    acc: Map<string, Object>,
    cur: any
  ) {
    acc.set(cur.blockNumber, cur);
    return acc;
  },
  new Map());
  return blocknumbersToInfo;
};

export const sendImage = async (
  blockNumber: number,
  blockHash: string,
  image: string,
  address: string,
  grid_size: number,
  anti_block: number,
  noFill: boolean,
  color: string,
  generation: number,
  paletteIndex: number,
  paperIndex: number
) => {
  const endpoint = "/api/mint";
  console.log("calling " + endpoint);
  const body = JSON.stringify({
    blockNumber,
    blockHash,
    image,
    address,
    grid_size,
    anti_block,
    fill: !noFill,
    color,
    generation,
    paletteIndex,
    paperIndex,
  });

  const size = new TextEncoder().encode(JSON.stringify(body)).length;
  const kiloBytes = size / 1024;
  const megaBytes = kiloBytes / 1024;
  console.log("size: ", megaBytes, " MB");

  const response = await fetch(SERVER_URL + endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body,
  });
  if (!response.ok) throw new Error();

  const content = await response.json();
  return content.data;
};

export const latestBlock = async () => {
  const endpoint = "/api/latest";
  console.log("calling " + endpoint);
  const response = await fetch(SERVER_URL + endpoint, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error();

  const content = await response.json();
  return content.data;
};

export const mintingSuccess = async (blockNumber: number) => {
  const endpoint = "/api/mint-success";
  console.log("calling " + endpoint);
  const body = JSON.stringify({ blockNumber });
  const response = await fetch(SERVER_URL + endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body,
  });
  if (!response.ok) throw new Error();

  return;
};

export const mintingFailure = async (blockNumber: number) => {
  const endpoint = "/api/mint-failure";
  console.log("calling " + endpoint);
  const body = JSON.stringify({ blockNumber });
  const response = await fetch(SERVER_URL + endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body,
  });
  if (!response.ok) throw new Error();

  return;
};

export const getBlockInfo = async (blockNumber: number) => {
  const endpoint = "/api/block/" + blockNumber;
  console.log("calling " + endpoint);
  const response = await fetch(SERVER_URL + endpoint, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error();

  const content = await response.json();
  const metadataUrl = content.data.url;

  const response2 = await fetch(metadataUrl);
  if (!response2.ok) throw new Error();

  return response2;
};
