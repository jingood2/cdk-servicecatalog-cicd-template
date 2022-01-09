import * as cdk from '@aws-cdk/core';
import { envVars, SCProductType } from '../env-vars';
import { SCProductStack } from './sc-portfolio-stack';

export interface DevStageProps extends cdk.StageProps{

}

export class DevStage extends cdk.Stage {
  constructor(scope: cdk.Construct, id: string, props: DevStageProps) {
    super(scope, id, props);

    new SCProductStack(this, `${envVars.SC_PRODUCT_NAME}-stack`, {
      portfolioname: 'NewPortfolio',
      codeType: SCProductType.CDK,
    });

  }
}