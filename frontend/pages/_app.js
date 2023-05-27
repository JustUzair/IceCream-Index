const Navbar = dynamic(() => import("../components/Navbar"), { ssr: false });
import "../styles/globals.css";
import "../styles/Home.module.css";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import Script from "next/script";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { NotificationProvider } from "web3uikit";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { fantom, fantomTestnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { MoralisProvider } from "react-moralis";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
const xdcTestnetChain = {
  // 1) create xinfin wallet - https://wallet.xinfin.network/
  // 2) use address of xinfin wallet for faucet; faucet link - https://faucet.blocksscan.io/
  id: 51,
  name: "XDC Apothem Network",
  network: "XDC Apothem Network",

  rpcUrls: {
    default: {
      http: ["https://erpc.apothem.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "apothem-xinfinscan",
      url: "https://apothem.xinfinscan.com",
    },
  },

  testnet: true,
};
const xdcChain = {
  id: 50,
  name: "XinFin XDC Network",
  network: "XinFin XDC Network",

  rpcUrls: {
    default: {
      http: ["https://rpc.xdcrpc.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "XinFin-xinfinscan",
      url: "https://xdcscan.io",
    },
  },

  testnet: false,
};
const { chains, provider } = configureChains(
  [xdcTestnetChain, xdcChain, fantom, fantomTestnet],
  [
    jsonRpcProvider({
      rpc: chain => ({ http: chain.rpcUrls.default.http[0] }),
    }),
    publicProvider(),
  ]
);
const { connectors } = getDefaultWallets({
  appName: "IceCream-Index",
  chains,
});
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }) {
  useEffect(() => {}, []);
  const router = useRouter();
  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/8.2.6/swiper-bundle.min.js"
        strategy="beforeInteractive"
      />
      <Script type="module" src="/scripts/page-script.js" defer></Script>
      <Script src="/scripts/cursor-script.js" defer></Script>

      <Head>
        <title>Home</title>
        <meta property="og:title" content="Home" key="title" />
        <link
          rel="stylesheet"
          href="https://assets.codepen.io/7773162/swiper-bundle.min.css"
        />
      </Head>
      <div className="cursor"></div>

      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <MoralisProvider initializeOnMount={false}>
            <Navbar></Navbar>
            <NotificationProvider>
              <AnimatePresence mode="wait" />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: {
                    delay: 0.25,
                    duration: 0.5,
                  },
                }}
                exit={{
                  opacity: 0,
                  backgroundColor: "transparent",

                  transition: {
                    delay: 0.25,
                    ease: "easeInOut",
                  },
                }}
                key={router.route}
                className="content"
              >
                <div className="wrapper">
                  <div className="box">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
                <Component {...pageProps} />
              </motion.div>
            </NotificationProvider>
          </MoralisProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}

export default MyApp;
