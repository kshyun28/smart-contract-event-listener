# smart-contract-event-listener

Smart contract event listener for Ethereum and other EVM-compatible blockchain networks. This sample repository listens to the `Transfer` and `Approval` events of Ethereum's USDT contract.

The smart contract listener is built with:
- Node.js
- TypeScript
- Web3.js

## Updating Environment Variables

Refer to the `.env.example` file. 
```
ETH_WSS_ENDPOINT=wss://eth-mainnet.g.alchemy.com/v2/<YOUR_API_KEY>
ETH_SMART_CONTRACT_ADDRESS=0xdac17f958d2ee523a2206206994597c13d831ec7
```
For the `ETH_WSS_ENDPOINT`, you can an endpoint from popular providers such as [Alchemy](https://www.alchemy.com/) and [Infura](https://www.infura.io/).

For the `ETH_SMART_CONTRACT_ADDRESS`, it's referencing the Ethereum USDT contract. If you want to update the contract address, make sure that you also update the `src/abi.json` to reflect the updated contract address.

## Local Development

For local development, you can refer to the following set of commands for starting the smart contract event listener.

1. **TypeScript:**
   - `npm run start:dev`
2. **JavaScript:**
   - `npm run build`
   - `npm run start`
3. **Docker:**
   - `npm run build`
   - `docker build -t smart-contract-event-listener:latest .`
   - `docker run -d --env-file .env --name smart-contract-event-listener smart-contract-event-listener:latest`
   - `docker logs smart-contract-event-listener`
   - `docker stop smart-contract-event-listener`

## AWS CDK

This project uses AWS CDK as the IaC (Infrastructure as Code) tool for deploying and managing AWS resources.

AWS CDK deploys the following resources:
- VPC
- ECS Cluster
- ECS Fargate Service
- ECS Fargate Task Definition

### Deploying with AWS CDK

To deploy the AWS resources, first, you need to have the permissions needed to deploy to your AWS account. You can refer to this [guide]([AWS CLI documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html#cli-configure-files-using-profiles)). 

Then to deploy, run the following:
- `npm run build`
- `cdk deploy`

### Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
