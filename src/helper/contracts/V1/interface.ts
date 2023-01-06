import { BigNumber, Contract } from "ethers";

interface PayableOptions {
  value: BigNumber;
}

export interface BlockalizerContract extends Contract {
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
