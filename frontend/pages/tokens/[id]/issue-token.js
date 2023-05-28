import React, { useEffect, useState } from "react";
import { Button } from "@mantine/core";
import { MdCreate } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";
import { IoIosCreate } from "react-icons/io";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { ethers } from "ethers";
import Head from "next/head";
import ERC20_ABI from "../../../constants/ERC20_ABI";
import PUMPKIN_ABI from "../../../constants/PUMPKIN_ABI.json";
import contractAddresses from "../../../constants/networkMappings.json";
import { fadeInUp, routeAnimation, stagger } from "../../../utils/animations";
import { motion } from "framer-motion";
import { useNotification } from "web3uikit";
import { useRouter } from "next/router";
const IssueTokens = () => {
  const router = useRouter();
  const _tokenAddress = router.query.id;

  const { runContractFunction } = useWeb3Contract();

  console.log(_tokenAddress);
  const dispatch = useNotification();

  const [tokenAmount, setTokenAmount] = useState(1);
  const [underlyingTokens, setUnderlyingTokens] = useState([]);
  const [tokenRatios, setTokenRatios] = useState([]);

  const { enableWeb3, authenticate, account, isWeb3Enabled, Moralis } =
    useMoralis();
  const { chainId: chainIdHex } = useMoralis();
  //   console.log(contractAddresses);
  const chainId = parseInt(chainIdHex);

  /* Contract Addresses */
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
  const contractFunctionIssueToken = async () => {
    if (XSwapIndexAddress == null || _tokenAddress == null) return;
    if (!isWeb3Enabled) await enableWeb3();
    runContractFunction({
      params: {
        abi: PUMPKIN_ABI,
        contractAddress: XSwapIndexAddress, // specify the networkId
        functionName: "issueToken",
        params: {
          _tokenAddress: _tokenAddress,
          amount: ethers.utils.parseEther(tokenAmount.toString()).toString(),
        },
      },
      onError: error => {
        failureNotification(error.message);
        console.log(error);
      },
      onSuccess: async data => {
        console.log(data);
        setTokenAmount(0);
        successNotification(
          `TX : ${data.hash} submitted (View on XDC Apothem Explorer)`
        );
        await data.wait(1);
        successNotification("Token Issued!");
      },
    });
  };
  const getUnderlyingTokens = () => {
    runContractFunction({
      params: {
        abi: PUMPKIN_ABI,
        contractAddress: XSwapIndexAddress, // specify the networkId
        functionName: "getAllUnderlying",
        params: {
          _indexAddress: _tokenAddress,
        },
      },
      onError: error => console.log(error),
      onSuccess: data => {
        console.log(data); //heRe
        setUnderlyingTokens(data);
      },
    });
  };
  const getUnderlyingTokenRatios = () => {
    runContractFunction({
      params: {
        abi: PUMPKIN_ABI,
        contractAddress: XSwapIndexAddress, // specify the networkId
        functionName: "getAllPercentages",
        params: {
          _indexAddress: _tokenAddress,
        },
      },
      onError: error => console.log(error),
      onSuccess: data => {
        setTokenRatios(data);
        console.log(data);
      },
    });
  };
  const approveTokens = async () => {
    try {
      await enableWeb3();
      await window.ethereum.enable();
      await getUnderlyingTokenRatios();
      await getUnderlyingTokens();

      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const WETH = new ethers.Contract(WETHAddress, ERC20_ABI, provider);
      const USDC = new ethers.Contract(USDCAddress, ERC20_ABI, provider);
      const WBTC = new ethers.Contract(WBTCAddress, ERC20_ABI, provider);
      const WFTM = new ethers.Contract(WFTMAddress, ERC20_ABI, provider);
      const AAVE = new ethers.Contract(AAVEAddress, ERC20_ABI, provider);
      const tokenArrayLength = tokenRatios.length;
      console.log(tokenArrayLength);
      if (tokenArrayLength >= 1 && underlyingTokens[0] == USDCAddress) {
        const USDCWithSigner = USDC.connect(signer);
        await USDCWithSigner.approve(
          _tokenAddress,
          ethers.utils
            .parseUnits(
              parseFloat(
                ethers.utils.formatEther(
                  parseInt(tokenRatios[0]._hex).toString()
                ) * tokenAmount
              ).toString(),
              "ether"
            )
            .toString()
        );
      }
      if (tokenArrayLength >= 2 && underlyingTokens[1] == USDCAddress) {
        const USDCWithSigner = USDC.connect(signer);
        await USDCWithSigner.approve(
          _tokenAddress,
          ethers.utils
            .parseUnits(
              parseFloat(
                ethers.utils.formatEther(
                  parseInt(tokenRatios[1]._hex).toString()
                ) * tokenAmount
              ).toString(),
              "ether"
            )
            .toString()
        );
      }
      if (tokenArrayLength >= 3 && underlyingTokens[2] == USDCAddress) {
        const USDCWithSigner = USDC.connect(signer);
        await USDCWithSigner.approve(
          _tokenAddress,
          ethers.utils
            .parseUnits(
              parseFloat(
                ethers.utils.formatEther(
                  parseInt(tokenRatios[2]._hex).toString()
                ) * tokenAmount
              ).toString(),
              "ether"
            )
            .toString()
        );
      }
      if (tokenArrayLength >= 4 && underlyingTokens[3] == USDCAddress) {
        const USDCWithSigner = USDC.connect(signer);
        await USDCWithSigner.approve(
          _tokenAddress,
          ethers.utils
            .parseUnits(
              parseFloat(
                ethers.utils.formatEther(
                  parseInt(tokenRatios[3]._hex).toString()
                ) * tokenAmount
              ).toString(),
              "ether"
            )
            .toString()
        );
      }
      if (tokenArrayLength >= 5 && underlyingTokens[4] == USDCAddress) {
        const USDCWithSigner = USDC.connect(signer);
        await USDCWithSigner.approve(
          _tokenAddress,
          ethers.utils
            .parseUnits(
              parseFloat(
                ethers.utils.formatEther(
                  parseInt(tokenRatios[4]._hex).toString()
                ) * tokenAmount
              ).toString(),
              "ether"
            )
            .toString()
        );
      }

      if (tokenArrayLength >= 1 && underlyingTokens[0] == WETHAddress) {
        const WETHWithSigner = WETH.connect(signer);
        await WETHWithSigner.approve(
          _tokenAddress,
          ethers.utils
            .parseUnits(
              parseFloat(
                ethers.utils.formatEther(
                  parseInt(tokenRatios[0]._hex).toString()
                ) * tokenAmount
              ).toString(),
              "ether"
            )
            .toString()
        );
      }
      if (tokenArrayLength >= 2 && underlyingTokens[1] == WETHAddress) {
        const WETHWithSigner = WETH.connect(signer);
        await WETHWithSigner.approve(
          _tokenAddress,
          ethers.utils
            .parseUnits(
              parseFloat(
                ethers.utils.formatEther(
                  parseInt(tokenRatios[1]._hex).toString()
                ) * tokenAmount
              ).toString(),
              "ether"
            )
            .toString()
        );
      }
      if (tokenArrayLength >= 3 && underlyingTokens[2] == WETHAddress) {
        const WETHWithSigner = WETH.connect(signer);
        await WETHWithSigner.approve(
          _tokenAddress,
          ethers.utils
            .parseUnits(
              parseFloat(
                ethers.utils.formatEther(
                  parseInt(tokenRatios[2]._hex).toString()
                ) * tokenAmount
              ).toString(),
              "ether"
            )
            .toString()
        );
      }
      if (tokenArrayLength >= 4 && underlyingTokens[3] == WETHAddress) {
        const WETHWithSigner = WETH.connect(signer);
        await WETHWithSigner.approve(
          _tokenAddress,
          ethers.utils
            .parseUnits(
              parseFloat(
                ethers.utils.formatEther(
                  parseInt(tokenRatios[3]._hex).toString()
                ) * tokenAmount
              ).toString(),
              "ether"
            )
            .toString()
        );
      }
      if (tokenArrayLength >= 5 && underlyingTokens[4] == WETHAddress) {
        const WETHWithSigner = WETH.connect(signer);
        await WETHWithSigner.approve(
          _tokenAddress,
          ethers.utils
            .parseUnits(
              parseFloat(
                ethers.utils.formatEther(
                  parseInt(tokenRatios[4]._hex).toString()
                ) * tokenAmount
              ).toString(),
              "ether"
            )
            .toString()
        );
      }

      if (tokenArrayLength >= 1 && underlyingTokens[0] == WBTCAddress) {
        const WBTCWithSigner = WBTC.connect(signer);
        await WBTCWithSigner.approve(
          _tokenAddress,
          ethers.utils
            .parseUnits(
              parseFloat(
                ethers.utils.formatEther(
                  parseInt(tokenRatios[0]._hex).toString()
                ) * tokenAmount
              ).toString(),
              "ether"
            )
            .toString()
        );
      }
      if (tokenArrayLength >= 2 && underlyingTokens[1] == WBTCAddress) {
        const WBTCWithSigner = WBTC.connect(signer);
        await WBTCWithSigner.approve(
          _tokenAddress,
          ethers.utils
            .parseUnits(
              parseFloat(
                ethers.utils.formatEther(
                  parseInt(tokenRatios[1]._hex).toString()
                ) * tokenAmount
              ).toString(),
              "ether"
            )
            .toString()
        );
      }
      if (tokenArrayLength >= 3 && underlyingTokens[2] == WBTCAddress) {
        const WBTCWithSigner = WBTC.connect(signer);
        await WBTCWithSigner.approve(
          _tokenAddress,
          ethers.utils
            .parseUnits(
              parseFloat(
                ethers.utils.formatEther(
                  parseInt(tokenRatios[2]._hex).toString()
                ) * tokenAmount
              ).toString(),
              "ether"
            )
            .toString()
        );
      }
      if (tokenArrayLength >= 4 && underlyingTokens[3] == WBTCAddress) {
        const WBTCWithSigner = WBTC.connect(signer);
        await WBTCWithSigner.approve(
          _tokenAddress,
          ethers.utils
            .parseUnits(
              parseFloat(
                ethers.utils.formatEther(
                  parseInt(tokenRatios[3]._hex).toString()
                ) * tokenAmount
              ).toString(),
              "ether"
            )
            .toString()
        );
      }
      if (tokenArrayLength >= 5 && underlyingTokens[4] == WBTCAddress) {
        const WBTCWithSigner = WBTC.connect(signer);
        await WBTCWithSigner.approve(
          _tokenAddress,
          ethers.utils
            .parseUnits(
              parseFloat(
                ethers.utils.formatEther(
                  parseInt(tokenRatios[4]._hex).toString()
                ) * tokenAmount
              ).toString(),
              "ether"
            )
            .toString()
        );
      }

      if (tokenArrayLength >= 1 && underlyingTokens[0] == WFTMAddress) {
        const WFTMWithSigner = WFTM.connect(signer);
        await WFTMWithSigner.approve(
          _tokenAddress,
          ethers.utils
            .parseUnits(
              parseFloat(
                ethers.utils.formatEther(
                  parseInt(tokenRatios[0]._hex).toString()
                ) * tokenAmount
              ).toString(),
              "ether"
            )
            .toString()
        );
      }
      if (tokenArrayLength >= 2 && underlyingTokens[1] == WFTMAddress) {
        const WFTMWithSigner = WFTM.connect(signer);
        await WFTMWithSigner.approve(
          _tokenAddress,
          ethers.utils
            .parseUnits(
              parseFloat(
                ethers.utils.formatEther(
                  parseInt(tokenRatios[1]._hex).toString()
                ) * tokenAmount
              ).toString(),
              "ether"
            )
            .toString()
        );
      }
      if (tokenArrayLength >= 3 && underlyingTokens[2] == WFTMAddress) {
        const WFTMWithSigner = WFTM.connect(signer);
        await WFTMWithSigner.approve(
          _tokenAddress,
          ethers.utils
            .parseUnits(
              parseFloat(
                ethers.utils.formatEther(
                  parseInt(tokenRatios[2]._hex).toString()
                ) * tokenAmount
              ).toString(),
              "ether"
            )
            .toString()
        );
      }
      if (tokenArrayLength >= 4 && underlyingTokens[3] == WFTMAddress) {
        const WFTMWithSigner = WFTM.connect(signer);
        await WFTMWithSigner.approve(
          _tokenAddress,
          ethers.utils
            .parseUnits(
              parseFloat(
                ethers.utils.formatEther(
                  parseInt(tokenRatios[3]._hex).toString()
                ) * tokenAmount
              ).toString(),
              "ether"
            )
            .toString()
        );
      }
      if (tokenArrayLength >= 5 && underlyingTokens[4] == WFTMAddress) {
        const WFTMWithSigner = WFTM.connect(signer);
        await WFTMWithSigner.approve(
          _tokenAddress,
          ethers.utils
            .parseUnits(
              parseFloat(
                ethers.utils.formatEther(
                  parseInt(tokenRatios[4]._hex).toString()
                ) * tokenAmount
              ).toString(),
              "ether"
            )
            .toString()
        );
      }

      if (tokenArrayLength >= 1 && underlyingTokens[0] == AAVEAddress) {
        const AAVEWithSigner = AAVE.connect(signer);
        await AAVEWithSigner.approve(
          _tokenAddress,
          ethers.utils
            .parseUnits(
              parseFloat(
                ethers.utils.formatEther(
                  parseInt(tokenRatios[0]._hex).toString()
                ) * tokenAmount
              ).toString(),
              "ether"
            )
            .toString()
        );
      }
      if (tokenArrayLength >= 2 && underlyingTokens[1] == AAVEAddress) {
        const AAVEWithSigner = AAVE.connect(signer);
        await AAVEWithSigner.approve(
          _tokenAddress,
          ethers.utils
            .parseUnits(
              parseFloat(
                ethers.utils.formatEther(
                  parseInt(tokenRatios[1]._hex).toString()
                ) * tokenAmount
              ).toString(),
              "ether"
            )
            .toString()
        );
      }
      if (tokenArrayLength >= 3 && underlyingTokens[2] == AAVEAddress) {
        const AAVEWithSigner = AAVE.connect(signer);
        await AAVEWithSigner.approve(
          _tokenAddress,
          ethers.utils
            .parseUnits(
              parseFloat(
                ethers.utils.formatEther(
                  parseInt(tokenRatios[2]._hex).toString()
                ) * tokenAmount
              ).toString(),
              "ether"
            )
            .toString()
        );
      }
      if (tokenArrayLength >= 4 && underlyingTokens[3] == AAVEAddress) {
        const AAVEWithSigner = AAVE.connect(signer);
        await AAVEWithSigner.approve(
          _tokenAddress,
          ethers.utils
            .parseUnits(
              parseFloat(
                ethers.utils.formatEther(
                  parseInt(tokenRatios[3]._hex).toString()
                ) * tokenAmount
              ).toString(),
              "ether"
            )
            .toString()
        );
      }
      if (tokenArrayLength >= 5 && underlyingTokens[4] == AAVEAddress) {
        const AAVEWithSigner = AAVE.connect(signer);
        await AAVEWithSigner.approve(
          _tokenAddress,
          ethers.utils
            .parseUnits(
              parseFloat(
                ethers.utils.formatEther(
                  parseInt(tokenRatios[4]._hex).toString()
                ) * tokenAmount
              ).toString(),
              "ether"
            )
            .toString()
        );
      }
    } catch (err) {
      //   window.alert(err);
      failureNotification(err.message);
    }
  };

  return (
    <>
      <Head>
        <title>
          {_tokenAddress?.substr(0, 4) +
            "..." +
            _tokenAddress?.substr(-4) +
            " | Issue Tokens"}
        </title>
      </Head>
      {XSwapIndexAddress != null ? (
        <motion.div
          variants={routeAnimation}
          initial="initial"
          animate="animate"
          exit="exit"
          className="index-token--container"
        >
          <fieldset>
            <legend>Issue</legend>

            <h3
              style={{
                color: "#b8add2",
              }}
            >
              📒 Mint new index tokens
            </h3>
            <br />
            <h4
              style={{
                color: "#b8add2",
              }}
            >
              <u>
                {" "}
                NOTE : Mint the utility tokens at /mint-underlying for the issue
                token to work
              </u>
            </h4>
            <br />
            <h4
              style={{
                color: "#b8add2",
              }}
            >
              1. Approve all tokens for transfer
            </h4>
            <h4
              style={{
                color: "#b8add2",
              }}
            >
              2. Mint index tokens!
            </h4>
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
                  value={_tokenAddress ? _tokenAddress : ""}
                  disabled={true}
                />
              </div>
            </div>
            <div className="index-token">
              <div className="token-label--container">
                <label className="token-name--label">Token Amount - </label>
              </div>
              <div className="token-slider">
                <input
                  required
                  type="number"
                  className="token-name"
                  id="token-name"
                  placeholder="Enter amount in ether"
                  onChange={e => {
                    setTokenAmount(e.target.value);
                  }}
                />
              </div>
            </div>
            <br />
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-evenly",
                flexWrap: "wrap",
              }}
            >
              <Button variant="light" color="indigo" onClick={approveTokens}>
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
                  Approve Tokens
                </span>
              </Button>
              <br />
              <Button color="indigo" onClick={contractFunctionIssueToken}>
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
                  Mint Tokens
                </span>
              </Button>
              <br />
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

export default IssueTokens;
