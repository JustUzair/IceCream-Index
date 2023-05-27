import React, { useEffect } from "react";
import axios from "axios";
import { Alert, Button } from "@mantine/core";
import { IoIosCreate } from "react-icons/io";
import { ImCancelCircle } from "react-icons/im";
import { useMoralis, useWeb3Contract } from "react-moralis";
import contractAddresses from "../constants/networkMappings.json";
import { ethers } from "ethers";
import { fadeInUp, routeAnimation, stagger } from "../utils/animations";
import { motion } from "framer-motion";
import { useNotification } from "web3uikit";
import Link from "next/link";
import UtilityTokenABI from "../constants/UtitlityTokenMintABI.json";
import ERC20ABI from "../constants/ERC20_ABI.json";
import Head from "next/head";

const MintUnderlying = () => {
  const dispatch = useNotification();
  const { runContractFunction } = useWeb3Contract();

  const { enableWeb3, authenticate, account, isWeb3Enabled, Moralis } =
    useMoralis();
  const { chainId: chainIdHex } = useMoralis();
  //   console.log(contractAddresses);
  const chainId = parseInt(chainIdHex);
  console.log("CHain ", chainId);
  const UnderlyingTokenFaucetAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["UnderlyingFaucet"][
          contractAddresses[chainId]["UnderlyingFaucet"].length - 1
        ]
      : null;

  const USDCAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["USDC"][
          contractAddresses[chainId]["USDC"].length - 1
        ]
      : null;
  const WETHAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["WETH"][
          contractAddresses[chainId]["WETH"].length - 1
        ]
      : null;
  const WBTCAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["WBTC"][
          contractAddresses[chainId]["WBTC"].length - 1
        ]
      : null;
  const WFTMAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["WFTM"][
          contractAddresses[chainId]["WFTM"].length - 1
        ]
      : null;
  const AAVEAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["AAVE"][
          contractAddresses[chainId]["AAVE"].length - 1
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
  const mintUtilityTokens = async () => {
    const Web3 = await enableWeb3();
    runContractFunction({
      params: {
        abi: UtilityTokenABI,
        contractAddress: UnderlyingTokenFaucetAddress, // specify the networkId
        functionName: "mintTester",
        params: {},
      },
      onError: error => {
        failureNotification(error.message);
        console.log(error);
      },
      onSuccess: data => {
        console.log(data);
        successNotification("Utility Tokens Minted");
      },
    });
  };
  useEffect(() => {
    enableWeb3();
    authenticate();
  }, [account]);

  return (
    <>
      <Head>
        <title>Mint Test Utility Tokens</title>
      </Head>
      <div className="index-token--container">
        <fieldset>
          <legend>Mint Utility Tokens</legend>

          <h3
            style={{
              color: "#b8add2 !important",
            }}
          >
            ✨ Mint Utility Tokens and use them to issue the index tokens
          </h3>
          <br />
          <h4
            style={{
              color: "#b8add2 !important",
            }}
          >
            {" "}
            The utility token represents mock tokens for USDC, WETH, WBTC, FTM,
            AAVE
          </h4>
        </fieldset>
        <fieldset>
          <legend>Utility Tokens</legend>
          {UnderlyingTokenFaucetAddress != null ? (
            <div
              className="index-token"
              style={{
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <div className="token-addresses">
                <span
                  style={{
                    fontWeight: "bold",
                    marginBottom: "50px",
                  }}
                >
                  Import the mock tokens from the contracts below
                </span>
                <br />
                <span>
                  {" "}
                  <span
                    style={{
                      color: "#ffc700",
                    }}
                  >
                    USDC
                  </span>{" "}
                  -{" "}
                  <span
                    style={{
                      color: "#f8567f",
                    }}
                  >
                    {USDCAddress}
                  </span>
                </span>{" "}
                <br />
                <span>
                  {" "}
                  <span
                    style={{
                      color: "#ffc700",
                    }}
                  >
                    WETH
                  </span>{" "}
                  -{" "}
                  <span
                    style={{
                      color: "#f8567f",
                    }}
                  >
                    {WETHAddress}
                  </span>
                </span>{" "}
                <br />
                <span>
                  {" "}
                  <span
                    style={{
                      color: "#ffc700",
                    }}
                  >
                    WTBC
                  </span>{" "}
                  -{" "}
                  <span
                    style={{
                      color: "#f8567f",
                    }}
                  >
                    {WBTCAddress}
                  </span>
                </span>{" "}
                <br />
                <span>
                  {" "}
                  <span
                    style={{
                      color: "#ffc700",
                    }}
                  >
                    FTM
                  </span>{" "}
                  -{" "}
                  <span
                    style={{
                      color: "#f8567f",
                    }}
                  >
                    {WFTMAddress}
                  </span>
                </span>{" "}
                <br />
                <span>
                  {" "}
                  <span
                    style={{
                      color: "#ffc700",
                    }}
                  >
                    AAVE
                  </span>{" "}
                  -{" "}
                  <span
                    style={{
                      color: "#f8567f",
                    }}
                  >
                    {AAVEAddress}
                  </span>
                </span>{" "}
                <br />
              </div>
              <Button
                variant="dark"
                color="dark"
                radius="md"
                size="lg"
                onClick={mintUtilityTokens}
              >
                <span
                  className="create-token--btn"
                  style={{
                    fontSize: "1.5rem",
                    textDecoration: "none !important",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <IoIosCreate></IoIosCreate>
                  <span
                    style={{
                      marginRight: "10px",
                    }}
                  ></span>
                  Mint Utility Tokens
                </span>
              </Button>
            </div>
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
        </fieldset>
      </div>
    </>
  );
};

export default MintUnderlying;
