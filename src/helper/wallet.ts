import { createClient } from "wagmi";
import { getDefaultClient } from "connectkit";
import { goerli } from "wagmi/chains";

const { REACT_APP_ALCHEMY_API_KEY } = process.env;
const ALCHEMY_API_KEY = REACT_APP_ALCHEMY_API_KEY || "alchemy_api_key";

export function client() {
  const chains = [goerli];

  return createClient(
    getDefaultClient({
      appName: "Blockalizer",
      alchemyId: ALCHEMY_API_KEY,
      chains,
    })
  );
}
