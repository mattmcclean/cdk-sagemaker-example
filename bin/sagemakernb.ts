#!/usr/bin/env node
import cdk = require('@aws-cdk/cdk');
import iam = require('@aws-cdk/aws-iam');
import sagemaker = require('@aws-cdk/aws-sagemaker');
import fs = require('fs');

export interface SageMakerNotebookProps {
  /** the path to the script that is run when sagemaker notebook created **/
  onCreateScriptPath: string;
  /** the path to the script that is run when sagemaker notebook started **/
  onStartScriptPath: string;
}

export class SageMakerNotebook extends cdk.Construct {
  constructor(parent: cdk.Construct, id: string, props: SageMakerNotebookProps) {
    super(parent, id);

    let onStartScript = fs.readFileSync(props.onStartScriptPath, 'utf8');
    console.log("onStartScript is \n", onStartScript);
    let onCreateScript = fs.readFileSync(props.onCreateScriptPath, 'utf8');
    console.log("onCreateScript is \n", onCreateScript);

    /** Create the IAM Role to be used by SageMaker */
    const role = new iam.Role(this, 'NotebookRole', {
      assumedBy: new iam.ServicePrincipal('sagemaker.amazonaws.com')
    });
    role.attachManagedPolicy('arn:aws:iam::aws:policy/AmazonSageMakerFullAccess');

    /** Create the SageMaker Notebook Lifecycle Config */
    const lifecycleConfig = new sagemaker.cloudformation.NotebookInstanceLifecycleConfigResource(
        this, 'MyLifecycleConfig', {
      notebookInstanceLifecycleConfigName: 'fastaiLifecycleConfig',
      onCreate: [
        {
          content: new cdk.FnBase64(onCreateScript!)
        }
      ],
      onStart: [
        {
          content: new cdk.FnBase64(onStartScript!)
        }
      ]
    });

    /** Create the SageMaker notebook instance */
    new sagemaker.cloudformation.NotebookInstanceResource(this, 'MyNotebook', {
      notebookInstanceName: "MyNotebook",
      lifecycleConfigName: lifecycleConfig.notebookInstanceLifecycleConfigName,
      roleArn: role.roleArn,
      instanceType: 'ml.p2.xlarge'
    });

  }
}