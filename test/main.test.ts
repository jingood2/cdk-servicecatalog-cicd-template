import '@aws-cdk/assert/jest';
import { App } from '@aws-cdk/core';
import { SCProductStack, SCProductType } from '../src/lib/sc-portfolio-stack';


test('Snapshot', () => {
  const app = new App();
  const stack = new SCProductStack(app, 'test', {
    portfolioname: 'NewPortfolio',
    codeType: SCProductType.CDK,
  });

  expect(stack).not.toHaveResource('AWS::S3::Bucket');
  expect(app.synth().getStackArtifact(stack.artifactId).template).toMatchSnapshot();
});