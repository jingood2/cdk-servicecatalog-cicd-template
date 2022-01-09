import * as iam from '@aws-cdk/aws-iam';
import * as servicecatalog from '@aws-cdk/aws-servicecatalog';
import * as cdk from '@aws-cdk/core';
import { envVars } from '../env-vars';
import { ProductConstruct } from './sc-product-construct';

export enum SCProductType {
  CDK='cdk-sc-product',
  CFN='cfn-sc-product'
}

export interface SCPortfolioProductStackProps extends cdk.StackProps {
  portfolioname: string;
  portfolioArn?: string;
  displayName?: string;
  codeType: SCProductType;
  accessUserName?: string;
  accessGroupName?: string;
  accessRoleArn?: string;
}

export class SCProductStack extends cdk.Stack {
  readonly portfolio: servicecatalog.IPortfolio;
  constructor(scope: cdk.Construct, id: string, props: SCPortfolioProductStackProps) {
    super(scope, id, props);

    // define resources here...
    // define resources here...
    if (props.portfolioArn != undefined) {
      this.portfolio = servicecatalog.Portfolio.fromPortfolioArn(this, 'MyImportedPortfolio', props.portfolioArn);
    } else {
      this.portfolio = new servicecatalog.Portfolio(this, 'MyFirstPortfolio', {
        displayName: props.displayName ?? 'DemoPortfolio',
        providerName: 'Cloud Infra Team',
        description: 'Portfolio for a project',
        messageLanguage: servicecatalog.MessageLanguage.EN,
      });

      if ( props.accessGroupName != undefined) {
        const group = iam.Group.fromGroupName(this, 'SCGroup', props.accessGroupName);
        this.portfolio.giveAccessToGroup(group);
      }
      if ( props.accessUserName != undefined) {
        const user = iam.User.fromUserName(this, 'SCUser', props.accessUserName);
        this.portfolio.giveAccessToUser(user);
      }
      if ( props.accessRoleArn != undefined) {
        const role = iam.Role.fromRoleArn(this, 'SCRole', props.accessRoleArn);
        this.portfolio.giveAccessToRole(role);
      }
    }

    const product = new servicecatalog.CloudFormationProduct(this, 'Product', {
      productName: envVars.SC_PRODUCT_NAME,
      owner: 'Product Owner',
      description: 'test2',
      productVersions: [
        {
          productVersionName: 'v1',
          cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromProductStack(new ProductConstruct(this, envVars.SC_PRODUCT_NAME)),
        },
      ],
    });

    this.portfolio.addProduct(product);
  }
}