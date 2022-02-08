import '@aws-cdk/assert/jest';
import { App } from '@aws-cdk/core';
import { SCPortfolioStack } from '../src/lib/sc-portfolio-stack';


test('Snapshot', () => {
  const app = new App();
  const stack = new SCPortfolioStack(app, 'test', {});

  expect(stack).not.toHaveResource('AWS::S3::Bucket');
  expect(app.synth().getStackArtifact(stack.artifactId).template).toMatchSnapshot();
});