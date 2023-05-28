import React, { useState, useEffect } from "react";
import axios from "axios";
import { Alert, Button } from "@mantine/core";
import { IoIosCreate } from "react-icons/io";
import { ImCancelCircle } from "react-icons/im";
import { useMoralis, useWeb3Contract } from "react-moralis";
import PUMPKIN_ABI from "../../../constants/PUMPKIN_ABI";
import ERC_ABI from "../../../constants/ERC20_ABI.json";
import contractAddresses from "../../../constants/networkMappings.json";
import { ethers } from "ethers";
import { fadeInUp, routeAnimation, stagger } from "../../../utils/animations";
import { motion } from "framer-motion";
import { useNotification } from "web3uikit";
import { useRouter } from "next/router";
import Head from "next/head";
const RedeemTokens = () => {
  const dispatch = useNotification();
  const [tokenRedeemAmount, setTokenRedeemAmount] = useState(0);
  const [indexTokenAmount, setIndexTokenAmount] = useState(0);
  const router = useRouter();
  const _tokenAddress = router.query.id;

  console.log(_tokenAddress);
  const { runContractFunction } = useWeb3Contract();
  const { enableWeb3, authenticate, account, isWeb3Enabled, Moralis } =
    useMoralis();
  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);

  const XSwapIndexAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["XSwapIndexAddress"][
          contractAddresses[chainId]["XSwapIndexAddress"].length - 1
        ]
      : null;

  const successNotification = msg => {
    dispatch({
      type: "success",
      message: `${msg} Successfully`,
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

  const getIndexTokensAmount = async () => {
    if (!isWeb3Enabled) await enableWeb3();
    if (account) {
      runContractFunction({
        params: {
          abi: PUMPKIN_ABI,
          contractAddress: XSwapIndexAddress, // specify the networkId
          functionName: "getAmountOfIndexTokens",
          params: {
            _creator: account,
          },
        },
        onError: error => {
          failureNotification(error.message);
          console.log(error);
        },
        onSuccess: data => {
          console.log(ethers.utils.formatEther(data.toString()));
          setIndexTokenAmount(ethers.utils.formatEther(data.toString()));
        },
      });
    }
  };
  const redeemToken = async () => {
    if (!isWeb3Enabled) await enableWeb3();
    if (account) {
      runContractFunction({
        params: {
          abi: PUMPKIN_ABI,
          contractAddress: XSwapIndexAddress, // specify the networkId
          functionName: "redeemToken",
          params: {
            _tokenAddress: _tokenAddress,
            amount: ethers.utils.parseUnits(
              tokenRedeemAmount.toString(),
              "ether"
            ),
          },
        },
        onError: error => {
          failureNotification(error.message);
          console.log(error);
        },
        onSuccess: async data => {
          successNotification(
            `TX : ${data.hash} submitted (View on XDC Apothem Explorer)`
          );
          setTokenRedeemAmount(0);
          await data.wait(1);
          successNotification("Token Redeemed successfully!");
        },
      });
    }
  };
  useEffect(() => {
    // getIndexTokensAmount();
  }, [account]);
  return (
    <>
      <Head>
        <title>
          {_tokenAddress?.substr(0, 4) +
            "..." +
            _tokenAddress?.substr(-4) +
            " | Redeem Tokens"}
        </title>
      </Head>

      {XSwapIndexAddress != null ? (
        <motion.div
          className="index-token--container"
          variants={routeAnimation}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <fieldset>
            <legend
              style={{
                color: "#b8add2",
              }}
            >
              Redeem
            </legend>
            <h3
              style={{
                color: "#b8add2",
              }}
            >
              🔥 Burn index tokens and receive the underlying assets
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
                  disabled={true}
                />
              </div>
            </div>
            <div className="index-token">
              <div className="token-label--container">
                <label className="token-name--label">
                  Amount to be redeemed -{" "}
                </label>
              </div>
              <div className="token-slider">
                <input
                  required
                  type="number"
                  className="token-name"
                  id="token-name"
                  placeholder="1"
                  onChange={e => {
                    setTokenRedeemAmount(e.target.value);
                  }}
                  value={tokenRedeemAmount}
                />
                {/* <br />
              <span
                style={{
                  fontSize: "12px",
                  marginLeft: "10px",
                  fontWeight: "600",
                  cursor: "pointer",
                  background: "blueviolet",
                  padding: "3px 5px",
                  borderRadius: "4px",
                  color: "white",
                }}
                title={indexTokenAmount}
                onClick={e => {
                  setTokenRedeemAmount(indexTokenAmount);
                }}
              >
                Redeem All ?
              </span>{" "} */}
              </div>
            </div>

            <br />
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
            >
              <Button variant="light" color="indigo" onClick={redeemToken}>
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
                  Submit
                </span>
              </Button>
            </span>
            <br />
            <br />
          </fieldset>
          {/* {ethers.utils.parseUnits(tokenAmount.toString(), "ether").toString()} */}
        </motion.div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "80%",
              height: "100%",
              zIndex: "99",
              color: "white",
              fontSize: "2rem",
              wordWrap: "break-word",
              margin: "0 auto",
              padding: " 50px 10px",
              marginTop: "236px",
            }}
          >
            <span
              style={{
                background: "#FF494A",
                padding: "10px 25px",
                borderRadius: "20px",
              }}
            >
              No contract found on this network!!!
            </span>
          </div>
        </>
      )}
    </>
  );
};

export default RedeemTokens;
