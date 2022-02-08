import * as cdk from '@aws-cdk/core';
import { SCPortfolioStack } from './sc-portfolio-stack';

export interface ISCPortfolioStageProps extends cdk.StageProps{

}

export class SCPortfolioStage extends cdk.Stage {
  constructor(scope: cdk.Construct, id: string, props: ISCPortfolioStageProps) {
    super(scope, id, props);

    new SCPortfolioStack(this, 'sc-product', {
      env: {
        account: process.env.CDK_DEPLOY_ACCOUNT,
        region: process.env.CDK_DEPLOY_REGION, // or whatever region you use
      },
    });
  }
}