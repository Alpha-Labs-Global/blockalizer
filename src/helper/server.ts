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
  image: string,
  address: string
) => {
  const endpoint = "/api/mint";
  const body = JSON.stringify({ blockNumber, image, address });
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
