const { AwsCdkTypeScriptApp } = require('projen');
const project = new AwsCdkTypeScriptApp({
  cdkVersion: '1.142.0',
  defaultReleaseBranch: 'main',
  name: 'cdk-pipelines-template',

  cdkDependencies: [
    '@aws-cdk/core',
    '@aws-cdk/pipelines',
    '@aws-cdk/aws-codecommit',
    '@aws-cdk/aws-servicecatalog',
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-s3',
    '@aws-cdk/cloudformation-include',
    '@aws-cdk/aws-ec2',
    '@aws-cdk/aws-elasticloadbalancingv2',
    '@aws-cdk/aws-elasticloadbalancingv2-targets',
    '@aws-cdk/aws-autoscaling',
    '@aws-cdk/aws-certificatemanager',
    '@aws-cdk/aws-route53',
    '@aws-cdk/aws-route53-targets',
    '@aws-cdk/aws-cloudfront',
    '@aws-cdk/aws-cloudwatch',
    '@aws-cdk/aws-s3-deployment',
  ], /* Which AWS CDK modules (those that start with "@aws-cdk/") this app uses. */
  deps: [
    'chalk',
    'fs',
    'path',
    'cdk-nag',
  ], /* Runtime dependencies of this module. */
  // description: undefined,      /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],                 /* Build dependencies for this module. */
  // packageName: undefined,      /* The "name" in package.json. */
  // release: undefined,          /* Add release management to this project. */
  context: {
    '@aws-cdk/core:newStyleStackSynthesis': true,
    'gitType': 'github',
    'repoString': 'owner/org',
    'branch': 'master',
    'githubToken': 'atcl/jingood2/github-token',

  },
});
project.synth();