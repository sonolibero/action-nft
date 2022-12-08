import React, { useEffect, useState } from 'react';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import { ethers } from "ethers";
import myEpicNft from './utils/MyEpicNFT.json';

// Constants
const TWITTER_HANDLE = 'verci_eth';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const COLLECTION_LINK = "https://testnets.opensea.io/collection/actionnft-v3";
const TOTAL_MINT_COUNT = 50;
const CONTRACT_ADDRESS = "0x8b6EdAD9FE856ea29592AaD5780F4Cb465Aa1398";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [minting, setMinting] = useState(false);

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if(!ethereum) {
      console.log("install metamask");
      return;
    }
    else {
      console.log("we have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts'});

    if(accounts.length !== 0){
      const account = accounts[0];
      console.log("authorized account", account);
      setCurrentAccount(account);

      setupEventListener()
    }
    else {
      console.log("no authorized account");
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if(!ethereum) {
        alert("install metamask");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log(accounts[0], "connected");
      setCurrentAccount(accounts[0]);

      setupEventListener()
    } catch (error) {
      console.log(error);
    }
  }

  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          setMinting(false);
          alert(`sup bro! your NFT is on its way to your wallet. here's the link to opensea (may take some minutes to display): https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")

      } else {
        console.log("ethereum object does not exists");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {
    try {
      if(minting) {
        return;
      }
      const { ethereum } = window;

      if(ethereum) {
        let chainId = await ethereum.request({ method: 'eth_chainId' });
        console.log("Connected to chain " + chainId);

        // String, hex code of the chainId of the Goerli test network
        const goerliChainId = "0x5"; 
        if (chainId !== goerliChainId) {
          alert("please connect to Goerli Test Network!");
          return;
        }

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.makeAnEpicNFT();

        setMinting(true);
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`);
      }
      else {
        console.log("ethereum object does not exists")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const renderConnectWallet = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  const renderMint = () => (
    <button onClick={askContractToMintNft} className="cta-button mint-button">
      {minting ? "minting... ⏳" : "mint your ACTION"}
    </button>
  )

  useEffect(() => {
    checkIfWalletIsConnected();
  })

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <a className="header gradient-text" href={COLLECTION_LINK} target="_blank">ACTION collection</a>
          <p className="sub-text">
            act today, do not wait tmrw!
          </p>
          {currentAccount === "" ? ( renderConnectWallet() ) : ( renderMint() )}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;