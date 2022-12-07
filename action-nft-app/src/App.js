import React, { useEffect, useState } from 'react';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = 'verci_eth';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

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
    } catch (error) {
      console.log(error);
    }
  }

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  })

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">ACTION Collection</p>
          <p className="sub-text">
            Act today. Do not wait tmrw!
          </p>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <button onClick={null} className="cta-button mint-button">Mint ACTION</button>
          )}
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