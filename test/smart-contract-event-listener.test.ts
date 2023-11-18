import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as SmartContractEventListener from '../lib/smart-contract-event-listener-stack';

test('VPC Created', () => {
  const app = new cdk.App();

  const stack = new SmartContractEventListener.SmartContractEventListenerStack(app, 'MyTestStack');

  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::EC2::VPC', 1);
});

test('ECS Task Definition Created', () => {
  const app = new cdk.App();

  const stack = new SmartContractEventListener.SmartContractEventListenerStack(app, 'MyTestStack');

  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::ECS::TaskDefinition', 1);
});

test('ECS Fargate Service Created', () => {
  const app = new cdk.App();

  const stack = new SmartContractEventListener.SmartContractEventListenerStack(app, 'MyTestStack');

  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::ECS::Service', 1);
});
