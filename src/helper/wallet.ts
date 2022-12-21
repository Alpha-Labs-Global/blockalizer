import { createClient } from "wagmi";
import { getDefaultClient } from "connectkit";
import { goerli } from "wagmi/chains";
import { SIWEConfig } from "connectkit/build/components/Standard/SIWE/SIWEContext";
import { SiweMessage } from "siwe";

const { REACT_APP_ALCHEMY_API_KEY } = process.env;
const ALCHEMY_API_KEY = REACT_APP_ALCHEMY_API_KEY || "alchemy_api_key";

const chains = [goerli];

export const wagmiClient = createClient(
  getDefaultClient({
    appName: "Blockalizer",
    alchemyId: ALCHEMY_API_KEY,
    chains,
  })
);

export const createSiweMessage = (address: string, statement: string) => {
  const siweMessage = new SiweMessage({
    domain: window.location.host,
    address,
    statement,
    uri: window.location.origin,
    version: "1",
    chainId: goerli.id,
  });
  console.log(siweMessage);
  return siweMessage.prepareMessage();
};

// Deprecated. The UI for SIWE from ConnectKit is non-intuitive
export const siweConfig: SIWEConfig = {
  getNonce: async () => fetch("/api/siwe/nonce").then((res) => res.text()),
  createMessage: ({ nonce, address, chainId }) =>
    new SiweMessage({
      version: "1",
      domain: window.location.host,
      uri: window.location.origin,
      address,
      chainId,
      nonce,
      statement: "Sign in With Ethereum.",
    }).prepareMessage(),
  verifyMessage: async ({ message, signature }) =>
    fetch("/api/siwe/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, signature }),
    }).then((res) => res.ok),
  getSession: async () =>
    fetch("/api/siwe/session").then((res) => (res.ok ? res.json() : null)),
  signOut: async () => fetch("/api/siwe/logout").then((res) => res.ok),
};
