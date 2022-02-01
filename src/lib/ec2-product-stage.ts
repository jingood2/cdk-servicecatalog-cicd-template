import * as cdk from '@aws-cdk/core';
//import { envVars } from '../env-vars';
import { SCProductStack } from './sc-portfolio-stack';

export interface DevStageProps extends cdk.StageProps{

}

export class EC2ProductStage extends cdk.Stage {
  constructor(scope: cdk.Construct, id: string, props: DevStageProps) {
    super(scope, id, props);

    new SCProductStack(this, 'sc-product', {
      scope: 'ec2',
      env: {
        account: '037729278610',
        region: 'ap-northeast-2', // or whatever region you use
      },
    });
  }
}