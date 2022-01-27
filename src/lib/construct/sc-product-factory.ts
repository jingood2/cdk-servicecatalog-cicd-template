//import * as s3 from '@aws-cdk/aws-s3';
import * as path from 'path';
import * as servicecatalog from '@aws-cdk/aws-servicecatalog';
import * as cfn_inc from '@aws-cdk/cloudformation-include';
import * as cdk from '@aws-cdk/core';

export interface StackNameProps extends cdk.StackProps {
  filename : string;
}

export class SCProductFactory extends servicecatalog.ProductStack {
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    new cfn_inc.CfnInclude(this, 'Template', {
      templateFile: path.join(__dirname, '.', 'cfn-template/devops/sc-product-codecommit.template.yaml'),
    });


  }
}