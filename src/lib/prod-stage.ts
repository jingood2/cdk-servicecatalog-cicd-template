import * as cdk from '@aws-cdk/core';
import { envVars } from '../env-vars';
import { SCProductFactoryStack } from './sc-product-factory-stack';

export interface DevStageProps extends cdk.StageProps{

}

export class ProdStage extends cdk.Stage {
  constructor(scope: cdk.Construct, id: string, props: DevStageProps) {
    super(scope, id, props);

    new SCProductFactoryStack(this, `${envVars.SC_PRODUCT_NAME}-stack`);

  }
}