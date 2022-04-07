import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { MaxInt256 } from "@ethersproject/constants";
import { parseUnits, formatUnits } from "@ethersproject/units";

import { injected } from "../common/connectors";
import {
  CHAIN_INFO_LIST,
  TOKEN_INFO_LIST,
  SUPPORTED_TOKENS,
} from "../common/constants";
import { SupportedChainId, SupportedToken } from "../common/enums";
import Row from "../components/Row";
import Column from "../components/Column";
import Button from "../components/Button";
import { useERC20Contract } from "../common/hooks";

const oneInchApiBase = "https://api.1inch.exchange/v3.0/137";

export default function Demo() {
  const { active, account, chainId, activate, deactivate, library } =
    useWeb3React();

  const [jwt, setJwt] = useState<string | undefined>(); // TEMP
  const [fromToken, setFromToken] = useState<SupportedToken>(
    SupportedToken.DAI
  );
  const [toToken, setToToken] = useState<SupportedToken>(SupportedToken.USDC);
  const [fromTokenAmount, setFromTokenAmount] = useState<string>("0.0");
  const [fromTokenApproved, setFromTokenApproved] = useState<boolean>(false);
  const [spenderAddress, setSpenderAddress] = useState<string | undefined>();
  const [quotedToTokenAmount, setQuotedToTokenAmount] = useState<string>("0.0");

  const signedIn = active && !!jwt;
  const fromTokenInfo = TOKEN_INFO_LIST[fromToken];

  const fromTokenContract = useERC20Contract(fromTokenInfo.address);

  async function connect() {
    try {
      await activate(injected);
    } catch (e) {
      console.log(e);
    }
  }

  async function disconnect() {
    try {
      deactivate();
      setJwt(undefined);
    } catch (e) {
      console.log(e);
    }
  }

  async function login() {
    if (!(active && library && library.provider)) {
      return;
    }

    const signer = library.getSigner(account);

    const nonceReponse = await fetch("/api/auth/getNonce");
    const { nonce } = await nonceReponse.json();
    console.log("Got nonce", { nonce });

    // Sign message
    const signature = await signer.signMessage(nonce);
    console.log(signature);

    const publicAddress = account; // Just here to satisfy api
    const validateSignatureReponse = await fetch(
      "/api/auth/validateSignature",
      {
        body: JSON.stringify({ publicAddress, signature }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    );

    const newJwt = await validateSignatureReponse.json();
    setJwt(newJwt.token);
    console.log("JWT: ", { newJwt });
  }

  // Login once we have connected if we don't have a jwt yet
  useEffect(() => {
    if (active && !jwt) {
      login();
    }
  }, [active]);

  // Get the spender address on intial load
  useEffect(() => {
    async function getSpenderAddress() {
      const response = await fetch(oneInchApiBase + "/approve/spender", {
        method: "GET",
      });
      const data = await response.json();
      setSpenderAddress(data.address);
    }

    getSpenderAddress();
  }, []);

  // Get if the from token is approved when selected token changes
  useEffect(() => {
    if (!signedIn || !spenderAddress || !fromTokenContract) {
      return;
    }

    async function getIsTokenApproved() {
      if (!fromTokenContract) return;
      const response = await fromTokenContract.allowance(
        account,
        spenderAddress
      );

      setFromTokenApproved(response != 0);
    }

    getIsTokenApproved();
  }, [fromToken, signedIn, spenderAddress, fromTokenContract]);

  // Update quoted to token amount
  useEffect(() => {
    if (fromTokenAmount === "") {
      return;
    }

    async function getQuote() {
      const toTokenInfo = TOKEN_INFO_LIST[toToken];
      const amount = parseUnits(
        fromTokenAmount,
        fromTokenInfo.decimals
      ).toBigInt();
      const response = await fetch(
        oneInchApiBase +
          `/quote?fromTokenAddress=${fromTokenInfo.address}&toTokenAddress=${toTokenInfo.address}&amount=${amount}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      try {
        console.log(data);
        const toAmount = formatUnits(data.toTokenAmount, toTokenInfo.decimals);
        setQuotedToTokenAmount(toAmount);
      } catch (e) {
        console.log(`Error: ${e}`);
      }
    }

    getQuote();
  }, [fromToken, toToken, fromTokenAmount]);

  async function approve() {
    if (!signedIn || fromTokenApproved || !fromTokenContract) {
      return;
    }

    const response = await fromTokenContract.approve(spenderAddress, MaxInt256);
    const txHash = response.hash;
    console.log(`Approved, txn hash: ${txHash}`);
    setFromTokenApproved(true);
  }

  async function swap() {
    console.log("TODO");
  }

  const supportedTokenOptions = SUPPORTED_TOKENS.map((token, i) => {
    const tokenInfo = TOKEN_INFO_LIST[token];
    return (
      <option value={token} key={i}>
        {tokenInfo.symbol}
      </option>
    );
  });

  return (
    <Column>
      <Row>
        <Button
          active={signedIn}
          onClick={() => (signedIn ? disconnect() : connect())}
        >
          {signedIn ? "Logout" : "Login"}
        </Button>
        <Column>
          <div>Address: {account ?? "Not connected"}</div>
          <div>
            Chain:{" "}
            {chainId
              ? CHAIN_INFO_LIST[chainId as SupportedChainId].network
              : "Not connected"}
          </div>
        </Column>
      </Row>
      <Row>
        From:
        <select
          value={fromToken}
          onChange={(event) =>
            setFromToken(event.target.value as SupportedToken)
          }
        >
          {supportedTokenOptions}
        </select>
        <input
          type="number"
          value={fromTokenAmount}
          onChange={(event) => setFromTokenAmount(event.target.value)}
        />
      </Row>
      <Row>
        To:
        <select
          value={toToken}
          onChange={(event) => setToToken(event.target.value as SupportedToken)}
        >
          {supportedTokenOptions}
        </select>
        <div>Quoted output: {quotedToTokenAmount}</div>
      </Row>
      <Row>
        <Button
          active={false}
          disabled={!signedIn || fromTokenApproved}
          onClick={approve}
        >
          {signedIn
            ? fromTokenApproved
              ? `${fromTokenInfo.symbol} already approved`
              : `Approve ${fromTokenInfo.symbol}`
            : "log in first"}
        </Button>
        <div>Spender address: {spenderAddress}</div>
      </Row>
      <Row>
        <Button
          active={false}
          disabled={!signedIn || !fromTokenApproved}
          onClick={swap}
        >
          {signedIn
            ? fromTokenApproved
              ? `Swap`
              : `Must approve ${fromTokenInfo.symbol} before swapping`
            : "log in first"}
        </Button>
      </Row>
    </Column>
  );
}
