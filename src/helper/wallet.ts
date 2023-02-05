import { createClient } from "wagmi";
import { getDefaultClient } from "connectkit";
import { mainnet, goerli } from "wagmi/chains";
import { SiweMessage } from "siwe";
import { BigNumber, ethers } from "ethers";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

import controllerContract from "./contracts/V5/BlockalizerControllerV3.json";
import generationV2Contract from "./contracts/V3/BlockalizerGenerationV2.json";
import nftV3Contract from "./contracts/V3/BlockalizerV3.json";

import {
  BlockalizerControllerV3,
  BlockalizerV3,
  BlockalizerGenerationV2,
} from "./contracts/typechain-types";

const {
  REACT_APP_ALCHEMY_API_KEY,
  REACT_APP_BLOCKALIZER_CONTRACT_ADDRESS,
  REACT_APP_ENV,
} = process.env;
const ALCHEMY_API_KEY = REACT_APP_ALCHEMY_API_KEY || "alchemy_api_key";
const PRODUCTION = REACT_APP_ENV == "production";

const COLLECTION_ID = BigNumber.from(0);

const controllerContractAddress =
  REACT_APP_BLOCKALIZER_CONTRACT_ADDRESS ||
  "0x0000000000000000000000000000000000000000";

const supportedChains = () => {
  if (PRODUCTION) {
    return [mainnet];
  } else {
    return [goerli];
  }
};

const getContracts = async (
  signer: ethers.Signer
): Promise<
  [BlockalizerControllerV3, BlockalizerGenerationV2, BlockalizerV3]
> => {
  // @ts-ignore
  const controller: BlockalizerControllerV3 = new ethers.Contract(
    controllerContractAddress,
    controllerContract.abi,
    signer
  );

  const generationContractAddress = await controller.getGeneration();
  // @ts-ignore
  const generation: BlockalizerGenerationV2 = new ethers.Contract(
    generationContractAddress,
    generationV2Contract.abi,
    signer
  );

  const collectionAddress = await controller.getCollection(COLLECTION_ID);

  // @ts-ignore
  const collection: BlockalizerV3 = new ethers.Contract(
    collectionAddress,
    nftV3Contract.abi,
    signer
  );

  return [controller, generation, collection];
};

export const wagmiClient = createClient(
  getDefaultClient({
    appName: "Blockalizer",
    alchemyId: ALCHEMY_API_KEY,
    chains: supportedChains(),
  })
);

export const createSiweMessage = (address: string, statement: string) => {
  const siweMessage = new SiweMessage({
    domain: window.location.host,
    address,
    statement,
    uri: window.location.origin,
    version: "1",
    chainId: mainnet.id,
  });
  return siweMessage.prepareMessage();
};

export const mintToken = async (
  signer: ethers.Signer,
  result: any
): Promise<void> => {
  const [controller, generation, collection] = await getContracts(signer);

  const uri = result.uri;
  const sig = result.sig;

  const uriBytes = ethers.utils.toUtf8Bytes(uri);
  const mintPrice = await generation.mintPrice();
  const options = { value: mintPrice };

  await controller.publicMint(uriBytes, sig, options);
};

export const preMintToken = async (
  signer: ethers.Signer,
  result: any
): Promise<void> => {
  const [controller, generation, collection] = await getContracts(signer);

  const uri = result.uri;
  const sig = result.sig;

  const uriBytes = ethers.utils.toUtf8Bytes(uri);
  const mintPrice = await generation.mintPrice();
  const options = { value: mintPrice };

  // TODO: move to backend
  const address = await signer.getAddress();
  const addresses = [
    "0xB2D17c014D9a5BC9De4aDCc656e1a3B3b608238D",
    "0xe1EBc6DB1cfE34b4cAed238dD5f59956335E2998",
    "0xBb6f397d9d8bf128dDa607005397F539B43CD710",
  ];
  const leaves = addresses.map((address) =>
    ethers.utils.solidityKeccak256(["address"], [address])
  );
  const index = addresses.indexOf(address);
  const tree = new MerkleTree(leaves, keccak256, { sort: true });
  const proof = tree.getHexProof(leaves[index]);

  await controller.preMint(uriBytes, sig, proof, options);
};

const fetchMetadata = async (uri: string) => {
  const response = await fetch(uri);
  if (!response.ok) throw new Error();

  const jsonMetadata = await response.json();
  return jsonMetadata;
};

export const listenToEvents = async (
  signer: ethers.Signer,
  callback: (from: string, to: string, amount: BigNumber, event: any) => void
) => {
  const [controller, generation, collection] = await getContracts(signer);

  const userAddress = await signer.getAddress();
  const filterTo = collection.filters.Transfer(null, userAddress);

  collection.on(filterTo, callback);
};

export const getOwnedPieces = async (
  signer: ethers.Signer
): Promise<Array<any>[]> => {
  const [controller, generation, collection] = await getContracts(signer);

  const result = [];
  const userAddress = await signer.getAddress();
  const balance = await collection.balanceOf(userAddress);
  for (let i = 0; i < balance.toNumber(); i++) {
    const tokenId = await collection.tokenOfOwnerByIndex(
      userAddress,
      BigNumber.from(i)
    );
    const uri = await collection.tokenURI(tokenId);
    try {
      const metadata = await fetchMetadata(uri);
      const response: any = { tokenId: tokenId.toNumber(), metadata };
      result.push(response);
    } catch (e) {
      console.error(e);
      continue;
    }
  }
  return result;
};

export const getTotalMinted = async (
  signer: ethers.Signer
): Promise<BigNumber> => {
  const [controller, generation, collection] = await getContracts(signer);

  const totalMinted = await generation.getTokenCount();

  return totalMinted;
};

export const getGeneration = async (signer: ethers.Signer): Promise<number> => {
  const [controller, generation, collection] = await getContracts(signer);

  const generationCount = await controller.getGenerationCount();

  return generationCount.toNumber();
};

export const isAllowed = async (signer: ethers.Signer): Promise<boolean> => {
  const whitelisted = [
    "0xB2D17c014D9a5BC9De4aDCc656e1a3B3b608238D", // blockalizer
    "0xe1EBc6DB1cfE34b4cAed238dD5f59956335E2998", // uneeb 1
    "0xBb6f397d9d8bf128dDa607005397F539B43CD710", // uneeb 2
  ];

  const userAddress = await signer.getAddress();

  return whitelisted.includes(userAddress);
};

export const getMaxPerWallet = async (
  signer: ethers.Signer
): Promise<number> => {
  const [controller, generation, collection] = await getContracts(signer);
  return await generation.maxMintsPerWallet();
};

export const getStartDate = async (signer: ethers.Signer): Promise<number> => {
  const [controller, generation, collection] = await getContracts(signer);

  const startTime = await generation.startTime();

  return startTime.toNumber() * 1000;
};

export const getGenerationTotal = async (
  signer: ethers.Signer
): Promise<number> => {
  const [controller, generation, collection] = await getContracts(signer);

  return (await generation.maxSupply()).toNumber();
};
