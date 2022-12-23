import React from "react";
import { ConnectKitProvider } from "connectkit";
import { WagmiConfig } from "wagmi";

import { wagmiClient } from "../helper/wallet";

import Playground from "./Playground";

interface ComponentProps {}

const Sandbox: React.FC<ComponentProps> = (_: ComponentProps) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <ConnectKitProvider theme="midnight">
        <Playground></Playground>
      </ConnectKitProvider>
    </WagmiConfig>
  );
};

export default Sandbox;
