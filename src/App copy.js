import "./App.css";
import nftabi from "./nftabi";
import Web3 from "web3";
import { Biconomy } from "@biconomy/mexa";
import { useState, useEffect } from "react";

function App() {
  const [appState, setAppState] = useState({
    storageValue: 0,
    web3: null,
    account: null,
    contract: null,
    transactionSuccess: "",
  });

  const biconomy = new Biconomy(window.ethereum, {
    apiKey: "6Fk2o57Xc.c80ab72b-7b71-4de5-9c4b-32a0ceef9f4f",
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
        "0x7E3C5406d852C45b63Ab70E1E5f3aeAC1bE34147"
      );
      console.log("Bicon Ready");
      let accounts = await web3.eth.getAccounts();
      account = accounts[0];
    })
    .onEvent(biconomy.ERROR, (error, message) => {
      // Handle error while initializing mexa
      console.log(error);
    });

  // useEffect(() => {
  //   try {
  //     let web3 = new Web3(window.ethereum);
  //     biconomy
  //       .onEvent(biconomy.READY, async () => {
  //         const bicoweb3 = new Web3(biconomy);
  //         const contract = new bicoweb3.eth.Contract(
  //           JSON.parse(nftabi),
  //           "0x53854205072224425B02E82d6C396CAc2Ac14484"
  //         );
  //         const accounts = await web3.eth.getAccounts();
  //         setAppState((prevState) => {
  //           return {
  //             ...prevState,
  //             web3: web3,
  //             bicoweb3: bicoweb3,
  //             account: accounts[0],
  //             accounts: accounts,
  //             contract: contract,
  //             bicoweb3: bicoweb3,
  //           };
  //         });
  //       })
  //       .onEvent(biconomy.ERROR, (error, message) => {
  //         console.log("Biconomy Initialization Error");
  //       });

  //     console.log("State is", appState);
  //   } catch (error) {
  //     alert(
  //       "Failed to load web3, accounts, or contract. Check console for details."
  //     );
  //     console.error(error);
  //   }
  // }, []);

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
      <div className="text-5xl text-white">Hello</div>
      <button className="btn" onClick={() => mintnft()}>
        Mint
      </button>
    </>
  );
}

export default App;
