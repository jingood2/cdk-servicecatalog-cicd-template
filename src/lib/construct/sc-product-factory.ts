import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as servicecatalog from '@aws-cdk/aws-servicecatalog';
import * as cfn_inc from '@aws-cdk/cloudformation-include';

export interface StackNameProps extends cdk.StackProps {
  filename : string;
}

export class SCProductFactory extends servicecatalog.ProductStack {
  constructor(scope: cdk.Construct, id: string, props: StackNameProps) {
    super(scope, id);

    const cfnTemplate = new cfn_inc.CfnInclude(this, 'Template', {
      templateFile: props.filename,
    });

    
  }
}