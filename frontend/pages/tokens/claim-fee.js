import React, { useState, useEffect } from "react";
import axios from "axios";
import { Alert, Button } from "@mantine/core";
import { IoIosCreate } from "react-icons/io";
import { ImCancelCircle } from "react-icons/im";
import { useMoralis, useWeb3Contract } from "react-moralis";
import PUMPKIN_ABI from "../../constants/PUMPKIN_ABI";
import contractAddresses from "../../constants/networkMappings.json";
import ERC_ABI from "../../constants/ERC20_ABI.json";
import { ethers } from "ethers";
import { fadeInUp, routeAnimation, stagger } from "../../utils/animations";
import { motion } from "framer-motion";
import { useNotification } from "web3uikit";
import { useRouter } from "next/router";
import Head from "next/head";
const ClaimFee = () => {
  const router = useRouter();
  const [_tokenAddress, set_TokenAddress] = useState("0x");

  const { runContractFunction } = useWeb3Contract();
  const [tokenAddress, setTokenAddress] = useState("");
  const dispatch = useNotification();

  const { enableWeb3, authenticate, account, isWeb3Enabled, Moralis } =
    useMoralis();
  const { chainId: chainIdHex } = useMoralis();
  //   console.log(contractAddresses);
  const chainId = parseInt(chainIdHex);

  /* Contract Addresses */
  const XSwapIndexAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["XSwapIndexAddress"][
          contractAddresses[chainId]["XSwapIndexAddress"].length - 1
        ]
      : null;
  const successNotification = msg => {
    dispatch({
      type: "success",
      message: `${msg} Successfully (View on XDC Apothem Explorer)`,
      title: `${msg}`,
      position: "bottomR",
    });
  };
  const failureNotification = msg => {
    dispatch({
      type: "error",
      message: `${msg} ( View console for more info )`,
      title: `${msg}`,
      position: "bottomR",
    });
  };

  const claimFee = async () => {
    if (!isWeb3Enabled) await enableWeb3();
    if (account) {
      runContractFunction({
        params: {
          abi: PUMPKIN_ABI,
          contractAddress: XSwapIndexAddress, // specify the networkId
          functionName: "collectFee",
          params: {
            _indexAddress: _tokenAddress,
          },
        },
        onError: error => {
          failureNotification(error.message);
          console.log(error);
        },
        onSuccess: async data => {
          successNotification(`TX : ${data.hash} submitted `);
          await data.wait(1);
          successNotification("Token Fee Claimed");
          router.push("/tokens");
        },
      });
    }
  };
  return (
    <>
      <Head>
        <title>
          {_tokenAddress?.substr(0, 4) +
            "..." +
            _tokenAddress?.substr(-4) +
            " | Claim Fee "}
        </title>
      </Head>

      <motion.div
        variants={routeAnimation}
        initial="initial"
        animate="animate"
        exit="exit"
        className="index-token--container"
      >
        <fieldset>
          <legend>Claim Streaming Fee</legend>

          <h3
            style={{
              color: "#b8add2",
            }}
          >
            🚿 Creators of index tokens can claim 1% a year streaming fee from
            all its holders
          </h3>
          <br />
        </fieldset>
        {/* ------------------Get Token Address ------------------*/}
        <fieldset>
          <legend>Token Info</legend>
          <div className="index-token">
            <div className="token-label--container">
              <label className="token-name--label">Token Address - </label>
            </div>
            <div className="token-slider">
              <input
                required
                type="text"
                className="token-count--address"
                id="token-name"
                placeholder="0x..."
                value={_tokenAddress}
                onChange={e => {
                  set_TokenAddress(e.target.value);
                }}
              />
            </div>
          </div>

          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <Button variant="light" color="indigo" onClick={claimFee}>
              <span
                className="create-token--btn"
                style={{
                  fontSize: "1.5rem",
                  textDecoration: "none !important",
                  display: "flex",
                  alignItems: "center",
                  color: "white",
                }}
              >
                <IoIosCreate></IoIosCreate>
                <span
                  style={{
                    marginRight: "10px",
                  }}
                ></span>
                Claim Fee
              </span>
            </Button>
          </span>
          <br />
          <br />
        </fieldset>

        {/* {ethers.utils.parseUnits(tokenAmount.toString(), "ether").toString()} */}
      </motion.div>
    </>
  );
};

export default ClaimFee;
ClaimFee;
