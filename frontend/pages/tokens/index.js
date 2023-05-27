import React, { useState, useEffect } from "react";
import { Button } from "@mantine/core";
import { GiTakeMyMoney } from "react-icons/gi";
import { MdCreate } from "react-icons/md";
import { IoIosCreate } from "react-icons/io";
import { BiPieChartAlt2 } from "react-icons/bi";
import { BiTrophy } from "react-icons/bi";
import Head from "next/head";

import PUMPKIN_ABI from "../../constants/PUMPKIN_ABI";
import ERC_ABI from "../../constants/ERC20_ABI.json";
import { useMoralis, useWeb3Contract } from "react-moralis";
import contractAddresses from "../../constants/networkMappings.json";
import { useNotification } from "web3uikit";

import { motion } from "framer-motion";
import { fadeInUp, routeAnimation, stagger } from "../../utils/animations";
import Link from "next/link";
const ViewTokens = () => {
  const dispatch = useNotification();

  const [tokens, setTokens] = useState([]);
  const [tokenNames, setTokenNames] = useState([]);
  const [tokenSymbols, setTokenSymbols] = useState([]);

  const successNotification = msg => {
    dispatch({
      type: "success",
      message: `${msg} Successfully.
          \n
          (Come Back in a while for newly created tokens)`,
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
  const { runContractFunction } = useWeb3Contract();
  const { enableWeb3, authenticate, account, isWeb3Enabled, Moralis } =
    useMoralis();

  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);

  const PumpkinAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["PumpkinAddress"][
          contractAddresses[chainId]["PumpkinAddress"].length - 1
        ]
      : null;
  const getNames = async () => {
    if (!isWeb3Enabled) await enableWeb3();
    if (account) {
      runContractFunction({
        params: {
          abi: PUMPKIN_ABI,
          contractAddress: PumpkinAddress,
          functionName: "getAllNames",
          params: {
            _creator: account,
          },
        },
        onError: error => console.log(error),
        onSuccess: data => {
          setTokenNames(data);
        },
      });
    }
  };

  const getSymbols = async () => {
    if (!isWeb3Enabled) await enableWeb3();
    if (account) {
      runContractFunction({
        params: {
          abi: PUMPKIN_ABI,
          contractAddress: PumpkinAddress,
          functionName: "getAllSymbols",
          params: {
            _creator: account,
          },
        },
        onError: error => console.log(error),
        onSuccess: data => {
          setTokenSymbols(data);
        },
      });
    }
  };
  const getIndexTokens = async () => {
    if (PumpkinAddress == null) return;
    if (!isWeb3Enabled) enableWeb3();
    if (account) {
      await runContractFunction({
        params: {
          abi: PUMPKIN_ABI,
          contractAddress: PumpkinAddress,
          functionName: "getAllTokenAddresses",
          params: {
            _creator: account,
          },
        },
        onError: error => {
          console.error(error);
          failureNotification(error.message);
        },
        onSuccess: data => {
          console.log(data);
          setTokens(data);
          getNames();
          getSymbols();
          successNotification(`Tokens Fetched`);
        },
      });
    }
  };
  useEffect(() => {
    getIndexTokens();
  }, [account]);
  return (
    <>
      <Head>
        <title>
          View Tokens |{" "}
          {account != null && account.substr(0, 4) + "..." + account.substr(-4)}
        </title>
      </Head>
      {PumpkinAddress != null ? (
        <>
          {/* <Modal setModal={setModal} modal={modal}></Modal>
          <TokenCountModal
            setTokenCountModal={setTokenCountModal}
            tokenCountModal={tokenCountModal}
          ></TokenCountModal>
          <RedeemTokenModal
            redeemTokenModal={redeemTokenModal}
            setRedeemTokenModal={setRedeemTokenModal}
          ></RedeemTokenModal>
          <FeeClaimModal
            feeClaimModal={feeClaimModal}
            setFeeClaimModal={setFeeClaimModal}
          ></FeeClaimModal> */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="view-token--container"
          >
            {/* {account} */}

            {tokens.length > 0 &&
              tokens.map((item, index) => (
                <motion.div
                  variants={fadeInUp}
                  key={index}
                  className="new__content"
                >
                  <img
                    src={"/images/xdc-icon_white.png"}
                    alt=""
                    className="new__img"
                  />
                  <br />

                  <h3
                    className="new__title"
                    style={{
                      color: "#ffc700",
                    }}
                  >{`${tokenNames[index]} - ${tokenSymbols[index]}`}</h3>
                  {/* <span className="new__subtitle">Accessory</span> */}

                  <div className="new__prices">
                    <span
                      className="new__subtitle index-token--address"
                      title={`Copy To Clipboard : ${item}`}
                      onClick={e => {
                        navigator.clipboard.writeText(e.target.innerHTML);
                        successNotification(`Copied To Clipboard`);
                      }}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      {item.substr(0, 4) + "..." + item.substr(-4)}
                    </span>
                  </div>
                  <br />
                  <div className="view-token--buttons">
                    <Link
                      href={{
                        pathname: `/tokens/${item}/redeem`,
                      }}
                    >
                      <Button
                        variant="light"
                        color="indigo"
                        className="redeem-token--btn"
                      >
                        <span
                          className="edit-btn--container"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-evenly",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "20px",
                            }}
                          >
                            <GiTakeMyMoney></GiTakeMyMoney>
                          </span>
                          Redeem Tokens
                        </span>
                      </Button>
                    </Link>

                    <Link
                      href={{
                        pathname: `/tokens/${item}/issue-token`,
                      }}
                    >
                      <Button color="green" className="issue-token--btn">
                        <span
                          className="edit-btn--container"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-evenly",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "20px",
                            }}
                          >
                            <IoIosCreate></IoIosCreate>
                          </span>
                          Issue Tokens
                        </span>
                      </Button>
                    </Link>
                    <Link
                      href={{
                        pathname: `/tokens/${item}/rebalance`,
                      }}
                    >
                      <Button color="indigo" className="rebalance-token--btn">
                        <span
                          className="edit-btn--container"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-evenly",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "20px",
                              width: "90%",
                            }}
                          >
                            <BiPieChartAlt2></BiPieChartAlt2>
                          </span>
                          Rebalance Tokens
                        </span>
                      </Button>
                    </Link>
                    <Link
                      href={{
                        pathname: `/tokens/${item}/claim-fee`,
                      }}
                    >
                      <Button color="indigo" className="fee-claim--btn">
                        <br />
                        <br />
                        <span
                          className="edit-btn--container"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-evenly",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "20px",
                              width: "90%",
                            }}
                          >
                            <BiTrophy></BiTrophy>
                          </span>
                          Claim Fee
                        </span>
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </>
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

export default ViewTokens;
