import { App } from '@aws-cdk/core';
import { CdkPipelinesStack } from './lib/cdk-pipelines';

// for development, use account/region from cdk cli
const devEnv = {
  account: '037729278610',
  region: 'ap-northeast-2',
};

const app = new App();

new CdkPipelinesStack(app, 'sc-portfolios-pipelines', { env: devEnv } );
app.synth();