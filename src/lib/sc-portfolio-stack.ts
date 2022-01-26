import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import * as servicecatalog from '@aws-cdk/aws-servicecatalog';
import * as cdk from '@aws-cdk/core';
import { envVars } from '../env-vars';

export enum SCProductType {
  CDK='cdk-sc-product',
  CFN='cfn-sc-product'
}

export class SCProductStack extends cdk.Stack {
  readonly portfolio: servicecatalog.IPortfolio;
  constructor(scope: cdk.Construct, id: string ) {
    super(scope, id );

    if (envVars.SC_PORTFOLIO_ARN != '') {
      this.portfolio = servicecatalog.Portfolio.fromPortfolioArn(this, 'MyImportedPortfolio', envVars.SC_PORTFOLIO_ARN);
    } else {
      this.portfolio = new servicecatalog.Portfolio(this, envVars.SC_PORTFOLIO_NAME, {
        displayName: envVars.SC_PORTFOLIO_NAME ?? 'DemoPortfolio',
        providerName: 'Cloud Infra Team',
        description: 'Portfolio for a project',
        messageLanguage: servicecatalog.MessageLanguage.EN,
      });

      if ( envVars.SC_ACCESS_GROUP_NAME != '') {
        const group = iam.Group.fromGroupName(this, 'SCGroup', envVars.SC_ACCESS_GROUP_NAME);
        this.portfolio.giveAccessToGroup(group);
      }
      if ( envVars.SC_ACCESS_ROLE_ARN != '') {
        const role = iam.Role.fromRoleArn(this, 'SCRole', envVars.SC_ACCESS_ROLE_ARN);
        this.portfolio.giveAccessToRole(role);
      }
    }

    const tagOptionsForPortfolio = new servicecatalog.TagOptions({
      czStage: ['dev', 'qa', 'staging', 'production'],
      czOwner: ['skmagic', 'skens', 'sknetworks', 'skb', 'skbio', 'skcamical'],
    });
    this.portfolio.associateTagOptions(tagOptionsForPortfolio);

    const product = new servicecatalog.CloudFormationProduct(this, 'sc-ec2-linux-ra', {
      productName: 'sc-ec2-linux-ra',
      owner: envVars.SC_PRODUCT_OWNER,
      productVersions: [
        {
          productVersionName: 'v1',
          cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromAsset(path.join(__dirname, '.', 'cfn-template/ec2/sc-ec2-linux-ra.json')),
        },
      ],
    });

    /* const product = new servicecatalog.CloudFormationProduct(this, 'Product', {
      productName: envVars.SC_PRODUCT_NAME,
      owner: 'Product Owner',
      description: 'test2',
      productVersions: [
        {
          productVersionName: 'v1',
          cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromProductStack(new ProductConstruct(this, envVars.SC_PRODUCT_NAME)),
        },
      ],
    }); */

    this.portfolio.addProduct(product);
  }
}