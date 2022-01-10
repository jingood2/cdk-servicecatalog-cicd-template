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

    // define resources here...
    // define resources here...
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

    /* const pdFactory = new servicecatalog.CloudFormationProduct(this, 'SCProductFactory', {
      productName: 'SC Product Factory',
      owner: 'AWS TF Team',
      productVersions: [
        {
          productVersionName: 'v1',
          cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromUrl(
            'https://jingood0604-sc-template.s3.ap-northeast-2.amazonaws.com/SCProductFactory.yaml',
          ),
        },
      ],
    }); */

    const product = new servicecatalog.CloudFormationProduct(this, 'MyFirstProduct', {
      productName: envVars.SC_PRODUCT_NAME,
      owner: envVars.SC_PRODUCT_OWNER,
      productVersions: [
        {
          productVersionName: 'v1',
          cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromUrl(
            'https://raw.githubusercontent.com/awslabs/aws-cloudformation-templates/master/aws/services/ServiceCatalog/Product.yaml'),
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