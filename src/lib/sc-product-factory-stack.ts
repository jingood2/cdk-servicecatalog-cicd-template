import * as servicecatalog from '@aws-cdk/aws-servicecatalog';
import * as cdk from '@aws-cdk/core';


export class SCProductFactoryStack extends cdk.Stack {
  readonly portfolio: servicecatalog.IPortfolio;
  constructor(scope: cdk.Construct, id: string ) {
    super(scope, id );

    // define resources here...
    const portfolioArn = new cdk.CfnParameter(this, 'SCPortfolioArn', {
      type: 'String',
      description: 'Service Catalog Portfolio Arn',
      default: '',
    });
    const bucketName = new cdk.CfnParameter(this, 'SCProductTemplateBucketName', {
      type: 'String',
      description: 'Service Catalog Product template Base Bucket',
      default: '',
    });
    const productName = new cdk.CfnParameter(this, 'SCProductTemplateName', {
      type: 'String',
      description: 'Service Catalog Product template Name',
      default: '',
    });
    const version = new cdk.CfnParameter(this, 'SCProductVersion', {
      type: 'String',
      description: 'Service Catalog Product Version',
      default: '',
    });
    const description = new cdk.CfnParameter(this, 'SCProductDescription', {
      type: 'String',
      description: 'Service Catalog Product template Description',
      default: '',
    });
    const productOwner = new cdk.CfnParameter(this, 'SCProductOwner', {
      type: 'String',
      description: 'Service Catalog Product Owner',
      default: '',
    });
    const supportEmail = new cdk.CfnParameter(this, 'SupportEmail', {
      type: 'String',
      description: 'Service Catalog Support Email',
      default: 'support@example.com',
    });

    // define resources here...
    this.portfolio = servicecatalog.Portfolio.fromPortfolioArn(this, 'MyImportedPortfolio', portfolioArn.valueAsString);

    const pdFactory = new servicecatalog.CloudFormationProduct(this, 'SCProductFactory', {
      productName: productName.valueAsString,
      owner: productOwner.valueAsString,
      description: description.valueAsString,
      //replaceProductVersionIds: true,
      supportEmail: supportEmail.valueAsString,
      productVersions: [
        {
          productVersionName: version.valueAsString,
          cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromUrl(
            `https://${bucketName.valueAsString}.s3.ap-northeast-2.amazonaws.com/${productName.valueAsString}/${version.valueAsString}/${productName.valueAsString}.yaml`,
          ),
        },
      ],
    });

    this.portfolio.addProduct(pdFactory);
  }
}