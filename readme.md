# Deployed URL : [LIVE WEBSITE](https://xswap-index.vercel.app)

# ✖ XSwap-Index ✖

## What is an index token?

##### ❓ An index token is like a basket that holds many different types of cryptocurrencies at once, allowing investors to invest in several cryptocurrencies through one token.

## Inspiration

##### 👻 XDC network currently does not have any Index Tokens.

##### 🧟 We took inspiration from [TokenSets / Set Protocol](https://www.tokensets.com/) and recreated it without any fees.

## What it does

##### 🎃 Lets users create & manage their own index tokens

##### 🧙 Redeem index tokens for underlying assets

##### 🧛‍♂️ Creators can collect a custom streaming fee from 0 to 1% per year

##### 🍬 Others can buy these tokens on a decentralized exchange

##### 🔪 Adjust/rebalance each portion of underlying tokens in an index token

## How we built it

##### 🕯️ Wrote the solidity smart contract from the ground up

##### ✨ Integrated [XSwap](https://app.xspswap.finance/) for token rebalancing

##### 🧪 Tested by forking XDC Mainnet using Hardhat

## What's next for XSwap Index

##### 🍂Gas optimization

##### 🐺 Security Auditing

# Try the website on XDC apothem testnet

#### 1. Mint Test Tokens

1. Click "Utility Faucet" to mint test erc20's to interact with xswap-index. <br/>
2. Click the 'Mint Utility Tokens' button to start the transaction. 1000 USDC, WETH, WBTC, WFTM, and AAVE will be sent to your wallet.

#### 2. Try Creating a Token

1. Enter the token name, its symbol, and adjust the sliders according to how you want each asset to be portioned. <br/>
2. Click "Create Token" to create the Index Token's contract.

#### 3. Take a look at your contracts

1. If you are not redirected already, you should be on the "view-tokens" page. If not, you can click "My Tokens". You should see your newly created tokens there, if not try giving your browser a refresh.

#### 4. Try Issuing Tokens

1. Click the "Issue Tokens" button to issue new Index Tokens. <br/>
2. Enter the amount to issue
3. Click "Approve Tokens" to approve all the ERC20's that make up your index token. Accept all transactions (will be 1-5 transactions) <br/>
4. If successfully approved, you should be able to click the "Mint Tokens" button to issue new tokens.

## (NOTE - SOMETIMES DUE TO DELAY IN FETCHING USER MIGHT NEED TO RE-CLICK THE APPROVE BUTTON)

#### 5. Try Claiming Streaming Fee

1. Issue an index token on two or more different addresses <br/>
2. Click the "Claim Fee" button to confirm taking the streaming fee. There should be 1% tokens burned from all wallets and 1% minted to the creator's address.

#### 6. Try Redeeming Tokens

1. Click "Redeem Tokens" <br/>
2. Enter the amount of tokens you want to burn <br/>
3. Press submit, you should see index tokens being burned, and underlying tokens being sent to you.

#### 7. Re-balancing

since this design is designed for the XDC mainnet, it will not work on testnet so we have disabled this button.
