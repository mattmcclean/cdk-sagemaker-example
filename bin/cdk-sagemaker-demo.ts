#!/usr/bin/env node
import sns = require('@aws-cdk/aws-sns');
import sqs = require('@aws-cdk/aws-sqs');
import cdk = require('@aws-cdk/cdk');

class CdkSagemakerDemoStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
    super(parent, name, props);

    const queue = new sqs.Queue(this, 'CdkSagemakerDemoQueue', {
      visibilityTimeoutSec: 300
    });

    const topic = new sns.Topic(this, 'CdkSagemakerDemoTopic');

    topic.subscribeQueue(queue);
  }
}

const app = new cdk.App();

new CdkSagemakerDemoStack(app, 'CdkSagemakerDemoStack');

app.run();
