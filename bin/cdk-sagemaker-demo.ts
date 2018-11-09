#!/usr/bin/env node
import cdk = require('@aws-cdk/cdk');
import { SageMakerNotebook } from './sagemakernb';

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
app.run();