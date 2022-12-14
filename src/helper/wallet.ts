import { createClient } from "wagmi";
import { getDefaultClient } from "connectkit";
import { mainnet } from "wagmi/chains";
import { SiweMessage } from "siwe";
import { BigNumber, ethers } from "ethers";

import controllerContract from "./contracts/V3/BlockalizerController.json";
import generationV2Contract from "./contracts/V3/BlockalizerGenerationV2.json";
import nftV3Contract from "./contracts/V3/BlockalizerV3.json";
import {
  BlockalizerController,
  BlockalizerGenerationV2Contract,
  BlockalizerV3Contract,
} from "./contracts/V3/interface";

const { REACT_APP_ALCHEMY_API_KEY, REACT_APP_BLOCKALIZER_CONTRACT_ADDRESS } =
  process.env;
const ALCHEMY_API_KEY = REACT_APP_ALCHEMY_API_KEY || "alchemy_api_key";

const COLLECTION_ID = BigNumber.from(0);

const controllerContractAddress =
  REACT_APP_BLOCKALIZER_CONTRACT_ADDRESS ||
  "0x0000000000000000000000000000000000000000";

const chains = [mainnet];

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
    chainId: mainnet.id,
  });
  console.log(siweMessage);
  return siweMessage.prepareMessage();
};

export const mintToken = async (
  signer: ethers.Signer,
  tokenUri: string
): Promise<void> => {
  // @ts-ignore
  const blockalizerControllerContract: BlockalizerController =
    new ethers.Contract(
      controllerContractAddress,
      controllerContract.abi,
      signer
    );

  const generationContractAddress =
    await blockalizerControllerContract.getGeneration();
  // @ts-ignore
  const blockalizerGenerationContract: BlockalizerGenerationV2Contract =
    new ethers.Contract(
      generationContractAddress,
      generationV2Contract.abi,
      signer
    );

  const mintPrice = await blockalizerGenerationContract.mintPrice();
  const options = { value: mintPrice };

  return await blockalizerControllerContract.publicMint(
    COLLECTION_ID,
    tokenUri,
    options
  );
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
  // @ts-ignore
  const blockalizerControllerContract: BlockalizerController =
    new ethers.Contract(
      controllerContractAddress,
      controllerContract.abi,
      signer
    );

  const collectionAddress = await blockalizerControllerContract.getCollection(
    COLLECTION_ID
  );
  const blockalizerCollectionContract = new ethers.Contract(
    collectionAddress,
    nftV3Contract.abi,
    signer
  );

  const userAddress = await signer.getAddress();
  const filterTo = blockalizerCollectionContract.filters.Transfer(
    null,
    userAddress
  );

  blockalizerCollectionContract.on(filterTo, callback);
};

export const getOwnedPieces = async (
  signer: ethers.Signer
): Promise<Array<any>[]> => {
  // @ts-ignore
  const blockalizerControllerContract: BlockalizerController =
    new ethers.Contract(
      controllerContractAddress,
      controllerContract.abi,
      signer
    );

  const collectionAddress = await blockalizerControllerContract.getCollection(
    COLLECTION_ID
  );

  // @ts-ignore
  const blockalizerCollectionContract: BlockalizerV3Contract =
    new ethers.Contract(collectionAddress, nftV3Contract.abi, signer);

  const result = [];
  const userAddress = await signer.getAddress();
  const balance = await blockalizerCollectionContract.balanceOf(userAddress);
  for (let i = 0; i < balance.toNumber(); i++) {
    const tokenId = await blockalizerCollectionContract.tokenOfOwnerByIndex(
      userAddress,
      BigNumber.from(i)
    );
    const uri = await blockalizerCollectionContract.tokenURI(tokenId);
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
  // @ts-ignore
  const blockalizerControllerContract: BlockalizerController =
    new ethers.Contract(
      controllerContractAddress,
      controllerContract.abi,
      signer
    );

  const generationContractAddress =
    await blockalizerControllerContract.getGeneration();
  // @ts-ignore
  const blockalizerGenerationContract: BlockalizerGenerationV2Contract =
    new ethers.Contract(
      generationContractAddress,
      generationV2Contract.abi,
      signer
    );

  const totalMinted = await blockalizerGenerationContract.getTokenCount();

  return totalMinted;
};

export const getGeneration = async (signer: ethers.Signer): Promise<number> => {
  // @ts-ignore
  const blockalizerControllerContract: BlockalizerController =
    new ethers.Contract(
      controllerContractAddress,
      controllerContract.abi,
      signer
    );

  const generationCount =
    await blockalizerControllerContract.getGenerationCount();

  return generationCount.toNumber();
};

export const isAllowed = async (signer: ethers.Signer): Promise<boolean> => {
  // @ts-ignore
  const blockalizerControllerContract: BlockalizerController =
    new ethers.Contract(
      controllerContractAddress,
      controllerContract.abi,
      signer
    );

  const userAddress = await signer.getAddress();
  console.log(userAddress);
  const bool = await blockalizerControllerContract.isInWhitelist(userAddress);
  console.log(bool);
  return bool;
};

export const getStartDate = async (signer: ethers.Signer): Promise<number> => {
  // @ts-ignore
  const blockalizerControllerContract: BlockalizerController =
    new ethers.Contract(
      controllerContractAddress,
      controllerContract.abi,
      signer
    );

  const generationContractAddress =
    await blockalizerControllerContract.getGeneration();
  // @ts-ignore
  const blockalizerGenerationContract: BlockalizerGenerationV2Contract =
    new ethers.Contract(
      generationContractAddress,
      generationV2Contract.abi,
      signer
    );

  const startTime = await blockalizerGenerationContract.startTime();

  return startTime.toNumber() * 1000;
};
