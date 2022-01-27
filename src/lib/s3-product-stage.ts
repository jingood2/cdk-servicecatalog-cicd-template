import * as cdk from '@aws-cdk/core';
//import { envVars } from '../env-vars';
import { SCProductStack } from './sc-portfolio-stack';

export interface S3StageProps extends cdk.StageProps{

}

export class S3Stage extends cdk.Stage {
  constructor(scope: cdk.Construct, id: string, props: S3StageProps) {
    super(scope, id, props);

    new SCProductStack(this, 'sc-product', { scope: 's3' } );
  }
}