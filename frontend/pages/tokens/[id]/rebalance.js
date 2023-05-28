import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Alert, Button } from "@mantine/core";
import { IoIosCreate } from "react-icons/io";
import { ImCancelCircle } from "react-icons/im";
import { AiOutlineUpload } from "react-icons/ai";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { BigNumber, ethers } from "ethers";
import Head from "next/head";
import ERC20_ABI from "../../../constants/ERC20_ABI";
import { useNotification } from "web3uikit";

import PUMPKIN_ABI from "../../../constants/PUMPKIN_ABI.json";
import { fadeInUp, routeAnimation, stagger } from "../../../utils/animations";
import { motion } from "framer-motion";
import contractAddresses from "../../../constants/networkMappings.json";
const COINGECKO_PRICE_FEED_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=aave,wrapped-fantom,dai,usd-coin,tether,binance-usd,wrapped-bitcoin,chainlink,true-usd,frax&vs_currencies=usd";

const Rebalance = () => {
  const router = useRouter();
  const _tokenAddress = router.query.id;
  const { enableWeb3, authenticate, account, isWeb3Enabled, Moralis } =
    useMoralis();
  const { chainId: chainIdHex } = useMoralis();
  //   console.log(contractAddresses);
  const chainId = parseInt(chainIdHex);
  const dispatch = useNotification();
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

  const PumpkinAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["PumpkinAddress"][
          contractAddresses[chainId]["PumpkinAddress"].length - 1
        ]
      : null;

  /* Contract Addresses */
  const [coinPriceData, setCoinPriceData] = useState({});
  const [timestamp, setTimestamp] = useState(Date.now());
  const [approxTokenPrice, setApproxTokenPrice] = useState(0);
  const [dai, setDai] = useState(0);
  const [usdc, setUsdc] = useState(0);
  const [usdt, setUsdt] = useState(0);
  const [busd, setBusd] = useState(0);
  const [wbtc, setWbtc] = useState(0);
  const [link, setLink] = useState(0);
  const [wftm, setWftm] = useState(0);
  const [aave, setAave] = useState(0);
  const [tusd, setTusd] = useState(0);
  const [frax, setFrax] = useState(0);

  const [tokenAmount, setTokenAmount] = useState(1);
  const [underlyingTokens, setUnderlyingTokens] = useState([]);
  const [tokenRatios, setTokenRatios] = useState([]);
  const { runContractFunction } = useWeb3Contract();

  const [sellTokenAddress, setSellTokenAddress] = useState("");
  const [buyTokenAddress, setBuyTokenAddress] = useState("");
  const [sellAmount, setSellAmount] = useState(0);

  const calculateIndexTokenPrice = () => {
    const price =
      (dai / 100) * parseFloat(coinPriceData[tokenSymbolAddress.dai.id].usd) +
      (usdc / 100) * parseFloat(coinPriceData[tokenSymbolAddress.usdc.id].usd) +
      (usdt / 100) * parseFloat(coinPriceData[tokenSymbolAddress.usdt.id].usd) +
      (busd / 100) * parseFloat(coinPriceData[tokenSymbolAddress.busd.id].usd) +
      (wbtc / 100) * parseFloat(coinPriceData[tokenSymbolAddress.wbtc.id].usd) +
      (link / 100) * parseFloat(coinPriceData[tokenSymbolAddress.link.id].usd) +
      (wftm / 100) * parseFloat(coinPriceData[tokenSymbolAddress.wftm.id].usd) +
      (aave / 100) * parseFloat(coinPriceData[tokenSymbolAddress.aave.id].usd) +
      (tusd / 100) * parseFloat(coinPriceData[tokenSymbolAddress.tusd.id].usd) +
      (frax / 100) * parseFloat(coinPriceData[tokenSymbolAddress.frax.id].usd);

    setApproxTokenPrice(price);
  };
  const tokenSymbolAddress = {
    dai: {
      symbol: "dai",
      id: "dai",
    },
    usdc: {
      symbol: "usdc",
      id: "usd-coin",
    },
    usdt: {
      symbol: "usdt",
      id: "tether",
    },
    busd: {
      symbol: "busd",
      id: "binance-usd",
    },
    wbtc: {
      symbol: "wbtc",
      id: "wrapped-bitcoin",
    },
    link: {
      symbol: "link",
      id: "chainlink",
    },
    wftm: {
      symbol: "wftm",
      id: "wrapped-fantom",
    },
    aave: {
      symbol: "aave",
      id: "aave",
    },
    tusd: {
      symbol: "tusd",
      id: "true-usd",
    },
    frax: {
      symbol: "frax",
      id: "frax",
    },
  };

  function updateTokenState(element) {
    if (element.id == "dai") {
      setDai(element.value);
    }
    if (element.id == "usdc") {
      setUsdc(element.value);
    }
    if (element.id == "usdt") {
      setUsdt(element.value);
    }
    if (element.id == "busd") {
      setBusd(element.value);
    }
    if (element.id == "wbtc") {
      setWbtc(element.value);
    }
    if (element.id == "chain-link") {
      setLink(element.value);
    }
    if (element.id == "wftm") {
      setWftm(element.value);
    }
    if (element.id == "aave") {
      setAave(element.value);
    }
    if (element.id == "tusd") {
      setTusd(element.value);
    }
    if (element.id == "frax") {
      setFrax(element.value);
    }
  }
  async function getPriceFeedData() {
    try {
      const data = await axios.get(COINGECKO_PRICE_FEED_URL);
      setCoinPriceData(data.data);
      return true;
    } catch (err) {
      alert(err.message);
    }
  }
  async function handleChange(e) {
    if (Date.now() - timestamp > 5000 * 60) {
      console.log("Refreshing Price feeds after 5 minutes");
      getPriceFeedData();
      setTimestamp(Date.now());
    }
    let depends = document.querySelectorAll(".depend");
    updateTokenState(e.target);
    function c(current) {
      let input = current.value;
      let max = 100;
      let delta = max - parseInt(input);
      let sum = 0;
      let partial = 0;
      let siblings = [];

      // Sum of all siblings
      [].forEach.call(depends, function (depend) {
        if (current != depend) {
          siblings.push(depend); // Register as sibling
          sum += +depend.value;
        }
      });

      // Update all the siblings
      siblings.forEach(function (sibling, i) {
        let val = +sibling.value;
        let fraction = 0;

        // Calculate fraction
        if (sum <= 0) {
          fraction = 1 / (depends.length - 1);
        } else {
          fraction = val / sum;
        }

        // The last element will correct rounding errors
        if (i >= depends.length - 1) {
          val = max - partial;
        } else {
          val = Math.round(delta * fraction);
          partial += val;
        }

        // Check if total of all range is greater than max value
        let total = partial + parseInt(input);

        if (total > max) {
          let diff = total - max; // Calculate the difference
          val = val - diff; // Update the value
          partial = partial - diff;
        }

        s(sibling, val);
      });
    }

    function s(el, value) {
      let label = document.getElementById(el.id + "_percentage");

      label.innerHTML = value;
      el.value = value;
      updateTokenState(el);
    }

    s(e.target, e.target.value);
    c(e.target);
    calculateIndexTokenPrice();
  }
  useEffect(() => {
    enableWeb3();
    authenticate();
    try {
      axios.get(COINGECKO_PRICE_FEED_URL).then(res => {
        const data = res.data;
        setCoinPriceData(data);
      });
      console.log(coinPriceData);
    } catch (err) {
      alert(err.message);
    }
  }, []);
  useEffect(() => {
    getUnderlyingTokens();
    getUnderlyingTokenRatios();
  }, [account]);
  const getUnderlyingTokens = async () => {
    if (!isWeb3Enabled) await enableWeb3();
    if (account) {
      runContractFunction({
        params: {
          abi: PUMPKIN_ABI,
          contractAddress: PumpkinAddress, // specify the networkId
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
    }
  };
  const getUnderlyingTokenRatios = async () => {
    if (!isWeb3Enabled) await enableWeb3();
    if (account) {
      runContractFunction({
        params: {
          abi: PUMPKIN_ABI,
          contractAddress: PumpkinAddress, // specify the networkId
          functionName: "getAllPercentages",
          params: {
            _indexAddress: _tokenAddress,
          },
        },
        onError: error => console.log(error),
        onSuccess: data => {
          // do something
          // set the array with bignumber value directly, while using the percentage convert it in the if else
          //   data.map(item => {
          //     //     console.log(
          //     //       ethers.utils
          //     //         .parseUnits(
          //     //           parseFloat(
          //     //             ethers.utils.formatEther(parseInt(item._hex).toString()) *
          //     //               tokenAmount
          //     //           ).toString(),
          //     //           "ether"
          //     //         )
          //     //         .toString()
          //     //     );
          //     //     console.log(
          //     //       ethers.BigNumber.from(
          //     //         parseFloat(
          //     //           ethers.utils.formatEther(parseInt(item._hex).toString()) *
          //     //             tokenAmount
          //     //         ).toString()
          //     //       )
          //     //     );
          //     console.log(ethers.utils.formatEther(item.toString()).toString());
          //   });
          setTokenRatios(data);
        },
      });
    }
  };
  /*ethers.utils
            .parseUnits(
              parseFloat(
                ethers.utils.formatEther(
                  parseInt(tokenRatios._hex).toString()
                ) * tokenAmount
              ).toString(),
              "ether"
            )
            .toString()
            */

  const rebalanceIndexToken = async () => {
    if (!sellTokenAddress in underlyingTokens) return;
    if (!isWeb3Enabled) await enableWeb3();
    if (account) {
      runContractFunction({
        params: {
          abi: PUMPKIN_ABI,
          contractAddress: PumpkinAddress, // specify the networkId
          functionName: "rebalance",
          params: {
            _tokenAddress: _tokenAddress,
            _underlyingSell:
              (sellTokenAddress == underlyingTokens[0] && 0) ||
              (sellTokenAddress == underlyingTokens[1] && 1) ||
              (sellTokenAddress == underlyingTokens[2] && 2) ||
              (sellTokenAddress == underlyingTokens[3] && 3) ||
              (sellTokenAddress == underlyingTokens[4] && 4),
            _underlyingBuy:
              (buyTokenAddress == underlyingTokens[0] && 0) ||
              (buyTokenAddress == underlyingTokens[1] && 1) ||
              (buyTokenAddress == underlyingTokens[2] && 2) ||
              (buyTokenAddress == underlyingTokens[3] && 3) ||
              (buyTokenAddress == underlyingTokens[4] && 4),
            // _amtToSell: BigNumber.from(
            //   ethers.utils.parseEther(sellAmount.toString()).toString()
            // ),
            _amtToSell: ethers.utils
              .formatUnits(sellAmount.toString(), "wei")
              .toString(),
          },
        },
        onError: error => console.log(error),
        onSuccess: async data => {
          console.log(data);
          successNotification(
            `TX : ${data.hash} submitted (View on Block Explorer)`
          );
          await data.wait(1);
          successNotification("Token Rebalanced");
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
            " | Re-balance Tokens"}
        </title>
      </Head>

      <motion.div
        variants={routeAnimation}
        initial="initial"
        animate="animate"
        exit="exit"
        className="index-token--container"
      >
        {/* ------------------Get Token Address ------------------*/}
        <fieldset>
          <legend>Re-balance</legend>
          <h3
            style={{
              color: "#b8add2",
            }}
          >
            🍱 Change portions of each asset
          </h3>
          <br />
          <div className="index-token">
            <div className="token-label--container">
              <label className="token-name--label">Token Address - </label>
            </div>
            <div className="token-slider">
              <input
                required
                type="text"
                className="token-name"
                id="token-name"
                placeholder="0x..."
                value={_tokenAddress ? _tokenAddress : ""}
                disabled={true}
              />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>Index Composition</legend>
          <div>
            <h3
              style={{
                color: "#b8add2",
              }}
            >
              {" "}
              Tokens / Tokens Ratios (Click Token Address to Copy)
            </h3>{" "}
            <br />
            {/* {underlyingTokens.join("\r\n")} */}
            {underlyingTokens.length > 0 &&
              tokenRatios.length > 0 &&
              underlyingTokens.map((token, index) => (
                <>
                  <span key={index}>
                    <span
                      style={{
                        color: "#ffc800",
                        cursor: "pointer",
                      }}
                      title={token}
                      onClick={e => {
                        navigator.clipboard.writeText(token);
                        successNotification(`Copied To Clipboard`);
                      }}
                    >
                      {token.substr(0, 4) + "..." + token.substr(-4)} :{" "}
                    </span>

                    <span
                      style={{
                        color: "#f8567f",
                      }}
                    >
                      {parseFloat(
                        ethers.utils.formatEther(
                          tokenRatios[index].toString()
                        ) * 100
                      ).toFixed(2)}
                      %
                    </span>
                  </span>
                  <br />
                </>
              ))}
          </div>
          <br />
          <br />
        </fieldset>
        <fieldset>
          <legend> Amounts </legend>
          <div>
            <div className="index-token">
              <div className="token-label--container">
                <label className="token-name--label">Asset to Sell - ⬆️ </label>
              </div>
              <div className="token-slider">
                <input
                  required
                  type="text"
                  className="token-count--address"
                  id="token-name"
                  placeholder="0x..."
                  onChange={e => {
                    setSellTokenAddress(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <div>
            <div className="index-token">
              <div className="token-label--container">
                <label className="token-name--label">Amount to sell - </label>
              </div>
              <div className="token-slider">
                <input
                  required
                  type="text"
                  className="token-count--address"
                  id="token-name"
                  placeholder="0"
                  onChange={e => {
                    setSellAmount(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <div>
            <div className="index-token">
              <div className="token-label--container">
                <label className="token-name--label">Asset to buy - ⬇️</label>
              </div>
              <div className="token-slider">
                <input
                  required
                  type="text"
                  className="token-count--address"
                  id="token-name"
                  placeholder="0x..."
                  onChange={e => {
                    setBuyTokenAddress(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          Integrated with XSwap{" "}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/xdc-icon_white.png"
            className="spookyswap_icon"
            alt="icecream"
          />
          <br />
          <br />
        </fieldset>

        <fieldset>
          <legend> Actions </legend>
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
          </div>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <Button
              variant="light"
              color="indigo"
              onClick={rebalanceIndexToken}
            >
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
                Update Token
              </span>
            </Button>
          </span>
          <br />
          <br />
        </fieldset>
      </motion.div>
    </>
  );
};

export default Rebalance;
