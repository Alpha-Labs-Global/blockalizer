import { createClient } from "wagmi";
import { getDefaultClient } from "connectkit";
import { goerli } from "wagmi/chains";
import { SIWEConfig } from "connectkit/build/components/Standard/SIWE/SIWEContext";
import { SiweMessage } from "siwe";
import { ContractInterface, ethers, BigNumber, Contract } from "ethers";

import contract from "./contracts/Blockalizer.json";

const { REACT_APP_ALCHEMY_API_KEY, REACT_APP_BLOCKALIZER_CONTRACT_ADDRESS } =
  process.env;
const ALCHEMY_API_KEY = REACT_APP_ALCHEMY_API_KEY || "alchemy_api_key";

const contractAddress =
  REACT_APP_BLOCKALIZER_CONTRACT_ADDRESS ||
  "0x0000000000000000000000000000000000000000";

const chains = [goerli];

interface PayableOptions {
  value: BigNumber;
}

interface BlockalizerContract extends Contract {
  name(): string;
  symbol(): string;
  balanceOf(address: string): BigNumber;
  totalSupply(): BigNumber;
  publicMint(uri: string, options: PayableOptions): void;
  tokenOfOwnerByIndex(address: string, index: BigNumber): BigNumber;
  tokenURI(tokenId: BigNumber): string;
  mintPrice(): BigNumber;
  maxSupply(): BigNumber;
  setMintPrice(price: BigNumber): void;
  setMaxSupply(supply: BigNumber): void;
  withdraw(amount: BigNumber): void;
  withdrawAll(): void;

  supportsInterface(interface_id: string): boolean;
  hasRole(role: string, address: string): boolean;
  getRoleAdmin(role: string): string;
  grantRole(role: string, address: string): void;
}

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

export const mintToken = async (signer: ethers.Signer, tokenUri: string) => {
  const contractABI: ContractInterface = contract;
  // @ts-ignore
  const blockalizerContract: BlockalizerContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  console.log(blockalizerContract);
  const mintPrice = await blockalizerContract.mintPrice();
  console.log(mintPrice.toString());
  const options = { value: mintPrice };
  await blockalizerContract.publicMint(tokenUri, options);
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
