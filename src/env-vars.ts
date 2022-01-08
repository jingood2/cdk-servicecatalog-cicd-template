import * as chalk from 'chalk';

export const envVars = {
  REGION: process.env.REGION || 'ap-northeast-2',
  COMPANY_NAME: 'demo',
  PROJECT_NAME: 'cdk-demo-app',
  SOURCE_PROVIDER: 'GITHUB',
  REPO: 'jingood2/cdk-infra-pipelines-template',
  BRANCH: 'main',
  GITHUB_TOKEN: 'atcl/jingood2/github-token',
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