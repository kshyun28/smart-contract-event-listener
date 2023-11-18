import 'dotenv/config';
import * as erc20abi from './abi.json';
import Web3, { Contract, WebSocketProvider } from 'web3';

/* 
  Workaround for JSON.stringify() event logs with BigInt values. 
  We need to stringify event logs for more readable logging in Cloudwatch.
  https://github.com/GoogleChromeLabs/jsbi/issues/30
*/
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

/**
 * Starts the smart contract event listener.
 * Websocket Provider config: https://docs.web3js.org/api/web3-providers-ws/class/WebSocketProvider
 * @param chain - Name of the blockchain network for logging purposes.
 * @param wssEndpoint - Websocket endpoint for the blockchain network.
 * @param contractAddress - Smart contract address.
 */
const startEventListener = async (chain: string, wssEndpoint: string, contractAddress: string) => {
  const provider = new WebSocketProvider(
    wssEndpoint,
    {},
    {
      autoReconnect: true,
      delay: 10000, // Default: 5000 ms
      maxAttempts: 10, // Default: 5
    },
  );

  provider.on('connect', () => {
    console.log(`Connected to ${chain} websocket provider`);
  });

  provider.on('disconnect', error => {
    console.error(`Closed ${chain} webSocket connection`, error);
  });

  const web3 = new Web3(provider);

  /*
    Smart contract event listeners

    Listening to events:
      - Transfer
      - Approval
  */
  const contract = new web3.eth.Contract(erc20abi, contractAddress);
  await subscribeToEvent(chain, contract, 'Transfer');
  await subscribeToEvent(chain, contract, 'Approval');
};

/**
 * Subscribes to a smart contract event.
 * @param chain - Name of the blockchain network for logging purposes.
 * @param contract - Smart contract address.
 * @param eventName - Name of the event to subscribe to.
 */
const subscribeToEvent = async (chain: string, contract: Contract<typeof erc20abi>, eventName: string) => {
  const subscription = await contract.events[eventName]();

  subscription.on('connected', subscriptionId => {
    console.log(`${chain} USDT '${eventName}' SubID:`, subscriptionId);
  });

  subscription.on('data', event => {
    console.log(`${chain} USDT '${eventName}'`, JSON.stringify({ event })); // cannot json.stringify BigInt...
  });

  subscription.on('changed', event => {
    // Remove event from local database
  });

  subscription.on('error', error => {
    console.error(`${chain} USDT '${eventName}' error:`, error);
  });
};

/*
  Start smart contract event listeners

  Chains:
    - Ethereum
*/
startEventListener('Ethereum', process.env.ETH_WSS_ENDPOINT!, process.env.ETH_SMART_CONTRACT_ADDRESS!);
