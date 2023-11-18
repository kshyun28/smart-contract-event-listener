import 'dotenv/config';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';

export class SmartContractEventListenerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'SmartContractEventListenerVPC', {
      vpcName: 'SmartContractEventListenerVPC',
      // EIP soft limit is 5, need to increase limit to increase AZ
      maxAzs: 1,
    });

    const cluster = new ecs.Cluster(this, 'SmartContractEventListenerCluster', {
      clusterName: 'SmartContractEventListenerCluster',
      vpc: vpc,
    });

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'SmartContractEventListenerTaskDef', {
      family: 'TaskDef',
    });

    taskDefinition.addContainer('SmartContractEventListener', {
      containerName: 'Container',
      environment: {
        ETH_WSS_ENDPOINT: process.env.ETH_WSS_ENDPOINT!,
        ETH_SMART_CONTRACT_ADDRESS: process.env.ETH_SMART_CONTRACT_ADDRESS!,
      },
      // can be .fromContainerRegistry() if available to ECR
      image: ecs.ContainerImage.fromAsset(''),
      logging: new ecs.AwsLogDriver({
        streamPrefix: 'SmartContractEventListener',
        mode: ecs.AwsLogDriverMode.NON_BLOCKING,
      }),
    });

    new ecs.FargateService(this, 'SmartContractEventListenerFargateService', {
      serviceName: 'FargateService',
      cluster,
      taskDefinition,
    });
  }
}
