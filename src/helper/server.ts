const { REACT_APP_SERVER_URL } = process.env;
const SERVER_URL =
  REACT_APP_SERVER_URL || "https://blockalizer-backend.vercel.app";

export const fetchBlocks = async (
  address: string
): Promise<Map<string, Object>> => {
  const endpoint = "/api/blocks";
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
  generation: number
) => {
  const endpoint = "/api/mint";
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
  });
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
