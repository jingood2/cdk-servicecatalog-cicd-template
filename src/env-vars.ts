import * as chalk from 'chalk';

export enum SCProductType {
  CDK='cdk-sc-product',
  CFN='cfn-sc-product'
}

export const envVars = {
  REGION: process.env.REGION || 'ap-northeast-2',
  COMPANY_NAME: 'acme',
  SC_PRODUCT_NAME: 'sc-demo-product',
  SOURCE_PROVIDER: 'GITHUB',
  REPO: 'jingood2/cdk-servicecatalog-cicd-template',
  BRANCH: 'main',
  GITHUB_TOKEN: 'atcl/jingood2/github-token',
  SC_ACCESS_GROUP_NAME: 'AdminMasterAccountGroup',
};

export function validateEnvVariables() {
  for (let variable in envVars) {
    if (!envVars[variable as keyof typeof envVars]) {
      throw Error(
        chalk.red(`[app]: Environment variable ${variable} is not defined!`),
      );
    }
  }
}