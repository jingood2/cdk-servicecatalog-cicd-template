import * as s3 from '@aws-cdk/aws-s3';
import * as servicecatalog from '@aws-cdk/aws-servicecatalog';
import * as cdk from '@aws-cdk/core';

export interface ProductConstructProps {

}

export class ProductConstruct extends servicecatalog.ProductStack {
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    const bucketName = new cdk.CfnParameter(this, 'BucketName', {
      type: 'String',
      description: 'Test Bucket',
      default: 'jingood2SCDemoBucket',
    });

    new s3.Bucket(this, 'BucketProduct', {
      bucketName: bucketName.valueAsString,
    });

  }
}