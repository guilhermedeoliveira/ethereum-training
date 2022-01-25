import React from "react";
import Head from "next/head";
import Image from "next/image";
import { ethers } from "ethers";

import Greeter from "../../../artifacts/contracts/Greeter.sol/Greeter.json";
import styles from "../../../styles/Home.module.css";

const greeterAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

const ethereum = window?.ethereum;

const Home = () => {
  const [greeting, setGreeting] = React.useState("");

  // const provider = React.useMemo(() => {
  //   new ethers.providers.Web3Provider(ethereum);
  // }, []);

  const requestAccount = React.useCallback(async () => {
    await ethereum.request({ method: "eth_requestAccounts" });
  }, []);

  const fetchGreeting = React.useCallback(async () => {
    if (typeof ethereum !== undefined) {
      try {
        const contract = new ethers.Contract(
          greeterAddress,
          Greeter.abi,
          // provider
          new ethers.providers.Web3Provider(ethereum)
        );

        const data = await contract.greet();
        console.log({ data });
      } catch (error) {
        console.error({ error });
      }
    }
  }, []);

  const setGreetingValue = React.useCallback(async () => {
    if (!greeting) return;

    console.log({ ethereum });

    if (typeof ethereum !== undefined) {
      await requestAccount();

      const contractSigner = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        new ethers.providers.Web3Provider(ethereum).getSigner()
      );

      const transaction = await contractSigner.setGreeting(greeting);
      setGreeting("");
      await transaction.wait();

      fetchGreeting();
    }
  }, [greeting, requestAccount, fetchGreeting]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Ethereum training</title>
      </Head>

      <main className={styles.main}>
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreetingValue}>Set Greeting</button>

        <input
          placeholder="Set Greeting"
          value={greeting}
          onChange={(e) => setGreeting(e.target.value)}
        />
      </main>
    </div>
  );
};

export default Home;
