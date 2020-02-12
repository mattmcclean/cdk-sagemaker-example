#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { SageMakerNotebook } from '../lib/sagemakernb';


class CdkSagemakerDemoStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
    super(parent, name, props);

    /** Create the SageMaker notebook instance */
    new SageMakerNotebook(this, 'MySageMakerNotebook', {
      onCreateScriptPath: 'scripts/onCreate.sh',
      onStartScriptPath: 'scripts/onStart.sh'
    });

  }
}

const app = new cdk.App();
new CdkSagemakerDemoStack(app, 'CdkSagemakerDemoStack');