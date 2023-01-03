const { REACT_APP_SERVER_URL } = process.env;
const SERVER_URL =
  REACT_APP_SERVER_URL || "https://blockalizer-backend.vercel.app";

export const fetchBlocks = async (address: string) => {
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
  console.log(response);
  if (!response.ok) throw new Error();

  const content = await response.json();
  // console.log(content);
  const blockNumbers = content.data.map((d: any) => d.blockNumber);
  return blockNumbers;
};

export const sendImage = async (image: string) => {
  const endpoint = "/api/mint";
  const body = JSON.stringify({ image });
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
