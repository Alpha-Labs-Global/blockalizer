import { createClient } from "wagmi";
import { getDefaultClient } from "connectkit";
import { mainnet, goerli } from "wagmi/chains";
import { SiweMessage } from "siwe";
import { BigNumber, ethers } from "ethers";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

import controllerContract from "./contracts/BlockalizerControllerV5.sol/BlockalizerControllerV5.json";
import generationV2Contract from "./contracts/BlockalizerGenerationV2.sol/BlockalizerGenerationV2.json";
import nftV3Contract from "./contracts/BlockalizerV3.sol/BlockalizerV3.json";
import whitelist from "./contracts/whitelist.json";

import {
  BlockalizerControllerV5,
  BlockalizerV3,
  BlockalizerGenerationV2,
} from "./contracts/types";

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
  [BlockalizerControllerV5, BlockalizerGenerationV2, BlockalizerV3]
> => {
  // @ts-ignore
  const controller: BlockalizerControllerV5 = new ethers.Contract(
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

  const address = (await signer.getAddress()).toLowerCase();
  const leaves = whitelist.map((leaf) =>
    ethers.utils.solidityKeccak256(["address"], [leaf])
  );
  const tree = new MerkleTree(leaves, keccak256, { sort: true });
  const index = whitelist.indexOf(address);
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

  // starts from zero
  return generationCount.toNumber() + 1;
};

export const isAllowed = async (signer: ethers.Signer): Promise<boolean> => {
  const userAddress = (await signer.getAddress()).toLowerCase();

  return whitelist.includes(userAddress);
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

export const decodeErrorName = (signer: ethers.Signer, e: any) => {
  console.log(e);
  const data = e.error.data.originalError.data;

  // @ts-ignore
  const controller: BlockalizerControllerV5 = new ethers.Contract(
    controllerContractAddress,
    controllerContract.abi,
    signer
  );

  if (e.code == "UNPREDICTABLE_GAS_LIMIT") {
    const errorId = data.slice(0, 10);
    for (const [signature, errorFragment] of Object.entries(
      controller.interface.errors
    )) {
      const customErrorId = ethers.utils.id(signature).slice(0, 10);
      if (errorId == customErrorId) return errorFragment.name;
    }
  }
  return e.code;
};
