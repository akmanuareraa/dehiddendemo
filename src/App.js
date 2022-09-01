import "./App.css";
import nftabi from "./nftabi";
import Web3 from "web3";
import { Biconomy } from "@biconomy/mexa";
import { useState, useEffect } from "react";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
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
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import Connect from "./Connect";

function App() {
  const [appState, setAppState] = useState({
    storageValue: 0,
    web3: null,
    account: null,
    contract: null,
    transactionSuccess: "",
  });

  // ===========================================
  // Rainbowkit Integration

  const { chains, provider, webSocketProvider } = configureChains(
    [chain.polygonMumbai],
    [
      alchemyProvider({ apiKey: "s6gbstz7HGLANDFZbLHg1f8DlKrNxR6u" }),
      publicProvider(),
    ]
  );

  const { connectors } = getDefaultWallets({
    appName: "GasLess Mint App",
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
    webSocketProvider,
  });

  // const { config } = usePrepareContractWrite({
  //   addressOrName: "0x28Cc06715C0Bb14D4F270c22fCEDc8131eA49FBe",
  //   contractInterface: JSON.parse(nftabi),
  //   functionName: "mint",
  // });

  // const { write: mint, isSuccess } = useContractWrite(config);

  // ===========================================

  const biconomy = new Biconomy(window.ethereum, {
    apiKey: "wCszT0tiR.2b9773ed-c909-4d70-bb48-15cf305ac6e5",
    debug: true,
  });

  let web3 = new Web3(biconomy);
  let contract, account;

  biconomy
    .onEvent(biconomy.READY, async () => {
      // Initialize your dapp here like getting user accounts etc
      await window.ethereum.enable();
      contract = new web3.eth.Contract(
        JSON.parse(nftabi),
        "0x28Cc06715C0Bb14D4F270c22fCEDc8131eA49FBe"
      );
      console.log("Bicon Ready");
      let accounts = await web3.eth.getAccounts();
      account = accounts[0];
    })
    .onEvent(biconomy.ERROR, (error, message) => {
      // Handle error while initializing mexa
      console.log(error);
    });

  const mintnft = () => {
    console.log("Mint called with", appState, contract, account);
    contract.methods
      .mint(
        account,
        1,
        1,
        0x0000000000000000000000000000000000000000000000000000000000000000
      )
      .send({ from: account })
      .on("transactionHash", function (hash) {
        console.log("hash", hash);
      })
      .on("receipt", function (receipt) {
        console.log("receipt", receipt);
      })
      .on("confirmation", function (confirmationNumber, receipt) {
        console.log("confirmation", confirmationNumber);
      })
      .on("error", console.error);
  };

  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <div className="flex flex-col items-center space-y-6 p-8">
            <div className="text-5xl text-white font-bold">GasLess NFT Mint</div>
            <button className="btn bg-orange-500 text-black hover:bg-orange-500/50" onClick={() => mintnft()}>
              Mint NFT
            </button>
            {/* <button className="btn" onClick={() => mintnft()}>
              Mint with Rainbowkit
            </button> */}
            <ConnectButton chainStatus="name" />

            <Connect />
          </div>
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}

export default App;
