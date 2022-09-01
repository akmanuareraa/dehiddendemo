import React from "react";

import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
  useAccount,
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
} from "wagmi";

function Connect(props) {
  const { address, isConnecting, isDisconnected, connnected } = useAccount();
  return (
    <div className="flex flex-col items-center space-y-4">
      {/* <p>{address}</p> */}
    </div>
  );
}

export default Connect;
