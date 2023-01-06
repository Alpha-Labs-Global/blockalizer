import { BigNumber, Contract } from "ethers";

interface PayableOptions {
  value: BigNumber;
}

export interface BlockalizerV3Contract {
  currentTokenId(): BigNumber;
  incrementTokenId(): void;
  setTokenURI(tokenId: BigNumber, uri: string): void;
  safeMint(to: string, tokenId: BigNumber): void;

  name(): string;
  symbol(): string;
  balanceOf(address: string): BigNumber;
  totalSupply(): BigNumber;
  tokenOfOwnerByIndex(address: string, index: BigNumber): BigNumber;
  tokenURI(tokenId: BigNumber): string;

  owner(): string;
  supportsInterface(interface_id: string): boolean;
}

export interface BlockalizerGenerationV2Contract {
  mintPrice(): BigNumber;
  maxSupply(): BigNumber;
  expiryTime(): BigNumber;
  startTime(): BigNumber;
  owner(): string;
  incrementTokenCount(address: string): void;
}

export interface BlockalizerController {
  getCollection(collectionId: BigNumber): string;
  getGenerationCount(): BigNumber;
  getGeneration(): string;
  startGeneration(
    _mintPrice: BigNumber,
    _maxSupply: BigNumber,
    _expiryTime: BigNumber,
    _startTime: BigNumber,
    _maxMintPerWallet: BigNumber
  ): string;
  publicMint(
    collectionId: BigNumber,
    uri: string,
    options: PayableOptions
  ): void;
  addToWhitelist(address: string): void;
  updateTokenURI(tokenId: BigNumber, uri: string): void;
  withdraw(amount: BigNumber): void;
  withdrawAll(): void;

  hasRole(role: string, address: string): boolean;
  getRoleAdmin(role: string): string;
  grantRole(role: string, address: string): void;
}
