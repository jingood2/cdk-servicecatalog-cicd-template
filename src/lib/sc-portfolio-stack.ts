import fs from 'fs';
import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import * as servicecatalog from '@aws-cdk/aws-servicecatalog';
import * as cdk from '@aws-cdk/core';
import { envVars } from '../env-vars';

//import { SCProductFactory } from './construct/sc-product-factory';

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
        description: 'Service Catalog: EC2 Reference Architecture',
        messageLanguage: servicecatalog.MessageLanguage.EN,
      });

      if ( envVars.SC_ACCESS_GROUP_NAME != '') {
        const group = iam.Group.fromGroupName(this, 'SCGroup', envVars.SC_ACCESS_GROUP_NAME);
        this.portfolio.giveAccessToGroup(group);
      }
      if ( envVars.SC_ACCESS_ROLE_ARN != '') {
        //const role = iam.Role.fromRoleArn(this, 'SCRole', envVars.SC_ACCESS_ROLE_ARN);
        const role = iam.Role.fromRoleArn(this, 'SCRole', 'arn:aws:iam::*:role/AssumableAdminRole');
        this.portfolio.giveAccessToRole(role);
      }
    }

    const tagOptionsForPortfolio = new servicecatalog.TagOptions({
      czStage: ['dev', 'qa', 'staging', 'production'],
      czOwner: ['skmagic', 'skens', 'sknetworks', 'skb', 'skbio', 'skcamical'],
    });
    this.portfolio.associateTagOptions(tagOptionsForPortfolio);

    /* const product = new servicecatalog.CloudFormationProduct(this, 'ec2-linux-ra', {
      productName: 'ec2-linux-ra',
      owner: envVars.SC_PRODUCT_OWNER,
      productVersions: [
        {
          productVersionName: 'v1',
          cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromAsset(path.join(__dirname, '.', 'cfn-template/ec2/ec2-linux-ra.template.json')),
        },
      ],
    }); */

    this.associateProductToPortfolioInDir(path.join(__dirname, '.', 'cfn-template/ec2'));

    /* const product2 = new servicecatalog.CloudFormationProduct(this, 'sc-product-codecommit', {
      productName: 'sc-product-codecommit',
      owner: 'Product Owner',
      description: 'test2',
      productVersions: [
        {
          productVersionName: 'v1',
          cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromProductStack(new SCProductFactory(this, envVars.SC_PRODUCT_NAME)),
        },
      ],
    }); */

    //this.portfolio.addProduct(product);
    //this.portfolio.addProduct(product2);
  }

  private associateProductToPortfolioInDir(dir: string) : void {

    let product;

    fs.readdirSync(dir).forEach((file) => {

      // builds full path of file
      const fPath = path.resolve(dir, file);
      console.log('fPath:', fPath);

      product = new servicecatalog.CloudFormationProduct(this, file, {
        productName: file,
        owner: envVars.SC_PRODUCT_OWNER,
        productVersions: [
          {
            productVersionName: 'v1',
            cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromAsset(fPath),
          },
        ],
      });

      this.portfolio.addProduct(product);

    });

  }
}