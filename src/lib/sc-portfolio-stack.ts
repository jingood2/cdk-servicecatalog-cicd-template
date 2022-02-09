import fs from 'fs';
import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import * as servicecatalog from '@aws-cdk/aws-servicecatalog';
import * as cdk from '@aws-cdk/core';
import { envVars } from '../env-vars';

export interface ISCPortfolioStackProps extends cdk.StackProps {
}

export class SCPortfolioStack extends cdk.Stack {
  readonly portfolio: servicecatalog.IPortfolio;
  constructor(scope: cdk.Construct, id: string, props: ISCPortfolioStackProps ) {
    super(scope, id, props );

    if (envVars.SC_PORTFOLIO_ARN != '') {
      this.portfolio = servicecatalog.Portfolio.fromPortfolioArn(this, 'ExistedPortfolio', envVars.SC_PORTFOLIO_ARN);
    } else {
      this.portfolio = new servicecatalog.Portfolio(this, 'Portfolio', {
        displayName: envVars.SC_PORTFOLIO_NAME ?? 'DemoPortfolio',
        providerName: 'AWS TF',
        description: 'Service Catalog: SKC&C AWS TF Reference Architecture',
        messageLanguage: servicecatalog.MessageLanguage.EN,
      });
      if ( envVars.SC_ACCESS_GROUP_NAME != '') {
        this.portfolio.giveAccessToGroup(iam.Group.fromGroupName(this, 'SCAdminGroup', envVars.SC_ACCESS_GROUP_NAME));
      }
      if ( envVars.SC_ACCESS_ROLE_ARN != '') {
        this.portfolio.giveAccessToRole(iam.Role.fromRoleArn(this, 'SCAdminRole', envVars.SC_ACCESS_ROLE_ARN));
      }
    }

    const tagOptionsForPortfolio = new servicecatalog.TagOptions(this, 'OrgTagOptions', {
      allowedValuesForTags: {
        czStage: ['dev', 'qa', 'staging', 'production'],
      },
    });
    this.portfolio.associateTagOptions(tagOptionsForPortfolio);

    /* const adminRole: iam.IRole = iam.Role.fromRoleArn(this, 'Role',
      `arn:aws:iam::${cdk.Stack.of(this).account}:role/AWSCloudFormationStackSetAdministrationRole`, { mutable: false });
 */

    this.associateProductToPortfolioInDir(path.join(__dirname, '.', 'cfn-template/ec2') );
    this.associateProductToPortfolioInDir(path.join(__dirname, '.', 'cfn-template/s3') );
    this.associateProductToPortfolioInDir(path.join(__dirname, '.', 'cfn-template/rds') );
    this.associateProductToPortfolioInDir(path.join(__dirname, '.', 'cfn-template/network') );
    this.associateProductToPortfolioInDir(path.join(__dirname, '.', 'cfn-template/alb') );
    this.associateProductToPortfolioInDir(path.join(__dirname, '.', 'cfn-template/sagemaker') );
    this.associateProductToPortfolioInDir(path.join(__dirname, '.', 'cfn-template/ecs') );

  }

  private associateProductToPortfolioInDir(dir: string, adminRole?: iam.IRole) : void {

    let product;

    const role = adminRole ?? '';
    console.log('role', role);

    fs.readdirSync(dir).forEach((file) => {

      // builds full path of file
      const fPath = path.resolve(dir, file);

      /* if (fPath.endsWith('json') === false) {
        console.log('fPath:', fPath);
        return;
      } */

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

      /*  this.portfolio.deployWithStackSets(product, {
        accounts: ['856556794427'],
        regions: ['ap-northeast-2'],
        adminRole: adminRole,
        executionRoleName: 'AWSCloudFormationStackSetExecutionRole', // Name of role deployed in end users accounts.
        allowStackSetInstanceOperations: true,
      }); */

    });

  }
}