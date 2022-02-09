import * as chalk from 'chalk';

export enum SCProductType {
  CDK='cdk-sc-product',
  CFN='cfn-sc-product'
}

export const envVars = {
  REGION: process.env.REGION || 'ap-northeast-2',
  COMPANY_NAME: 'marketcaster',
  SOURCE_PROVIDER: 'GITHUB',
  REPO: 'jingood2/cdk-servicecatalog-cicd-template',
  BRANCH: 'main',
  GITHUB_TOKEN: 'atcl/jingood2/github-token',
  SC_PORTFOLIO_ARN: '',
  SC_PORTFOLIO_NAME: 'SKCnC-MarketCaster',
  SC_PRODUCT_NAME: 'product-factory',
  SC_PRODUCT_OWNER: 'SK CnC AWS TF Team',
  SC_ACCESS_GROUP_NAME: '',
  SC_ACCESS_ROLE_ARN: 'arn:aws:iam::037729278610:role/AssumableAdminRole',
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