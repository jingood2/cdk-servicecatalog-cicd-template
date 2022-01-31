import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as iam from '@aws-cdk/aws-iam';
import * as servicecatalog from '@aws-cdk/aws-servicecatalog';
import * as cdk from '@aws-cdk/core';

export interface IAlbEC2AsgProps {
  vpcId: string;
  //imageName: string;
  //certificateArn?: string;
  osType: ec2.OperatingSystemType;
  instanceName: string;
  instanceType: string;
  listenerArn?: string;
  listenerPort?: number;

  //instanceIAMRoleArn: string;
  targetPort: number;
  hostHeaders: string[];
  pathPatterns: string[];
  minCapacity?: number;
  maxCapacity?: number;
  targetUtilizationPercent?: number;

  healthCheckPath?: string;
  healthCheckPort?: string;
  healthCheckHttpCodes?: string;

}

export class AlbEC2Asg extends servicecatalog.ProductStack {
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    const vpcId = new cdk.CfnParameter(this, 'vpcId', {
      type: 'AWS::EC2::VPC::Id',
      description: 'Select Vpc Id',
    });

    const instanceName = new cdk.CfnParameter(this, 'instanceName', {
      type: 'String',
      description: 'EC2 Instance Name',
      default: 'default',
    });

    const instanceType = new cdk.CfnParameter(this, 'instanceType', {
      type: 'String',
      description: 'EC2 Instance Type',
      allowedValues: [
        't2.micro',
        't2.small',
        't2.medium',
      ],
      default: 't2.micro',
    });

    const listenerArn = new cdk.CfnParameter(this, 'ALBListenerArn', {
      type: 'String',
      description: 'ALB Listener ARN ',
    });

    const listenerPort = new cdk.CfnParameter(this, 'ALBListenerPort', {
      type: 'Number',
      description: 'ALB Listener Port',
      default: 80,
    });

    const targetPort = new cdk.CfnParameter(this, 'TargetListenerPort', {
      type: 'Number',
      description: 'Target Listener Port',
      default: 8080,
    });

    const hostHeaders = new cdk.CfnParameter(this, 'Host Headers', {
      type: 'CommaDelimitedList',
      description: 'ALB Listener Host Headers',
    });

    const pathPatterns = new cdk.CfnParameter(this, 'Path Patterns', {
      type: 'CommaDelimitedList',
      description: 'ALB Listener Path Condition',
      default: ['/ok'],
    });

    const minCapacity = new cdk.CfnParameter(this, 'MinCapacity', {
      type: 'Number',
      description: 'min capacity',
      default: 1,
    });

    const maxCapacity = new cdk.CfnParameter(this, 'MaxCapacity', {
      type: 'Number',
      description: 'max capacity',
      default: 2,
    });

    const targetUtilizationPercent = new cdk.CfnParameter(this, 'targetUtilizationPercent', {
      type: 'Number',
      description: 'target Utilization Percent',
      default: 70,
    });

    // parameter vpcId
    const vpc = ec2.Vpc.fromLookup(this, 'VPC', {
      vpcId: vpcId.valueAsString,
    });

    // parameter listenerArn, listenerPort
    const listener = elbv2.ApplicationListener.fromLookup(this, 'ALBListener', {
      listenerArn: listenerArn.valueAsString,
      listenerPort: listenerPort.valueAsNumber,
    });

    const role = new iam.Role(this, `${instanceName.valueAsString}-role`, {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });
    role.addToPolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['sts:AssumeRole'],
    }));
    role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2RoleforSSM'));
    role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMFullAccess'));

    // 1. ASG
    const asg = new autoscaling.AutoScalingGroup(this, 'AutoScalingGroup', {
      vpc,
      /* instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO,
      ), */
      instanceType: new ec2.InstanceType (instanceType.valueAsString),
      minCapacity: minCapacity.valueAsNumber,
      maxCapacity: maxCapacity.valueAsNumber,
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),

      //machineImage: (props.osType === ec2.OperatingSystemType.WINDOWS) ?
      //  ec2.MachineImage.latestWindows(ec2.WindowsVersion.WINDOWS_SERVER_2022_ENGLISH_CORE_BASE) : ec2.MachineImage.latestAmazonLinux(),


      allowAllOutbound: true,
      //role: iam.Role.fromRoleArn(this, 'IamRoleEc2Instance', props.instanceIAMRoleArn),
      role: role,
      healthCheck: autoscaling.HealthCheck.ec2(),
    });

    asg.addUserData('sudo yum install -y https://s3.region.amazonaws.com/amazon-ssm-region/latest/linux_amd64/amazon-ssm-agent.rpm');
    asg.addUserData('sudo systemctl enable amazon-ssm-agent');
    asg.addUserData('sudo systemctl start amazon-ssm-agent');
    asg.addUserData('echo "Hello Wolrd" > /var/www/html/index.html');

    asg.scaleOnCpuUtilization('KeepSpareCPU', {
      targetUtilizationPercent: targetUtilizationPercent.valueAsNumber,
    });

    // parameter hostname, commaList<path>, targetListenPort
    listener.addTargets('example.Com Fleet', {
      priority: 10,
      conditions: [
        elbv2.ListenerCondition.hostHeaders(hostHeaders.valueAsList),
        elbv2.ListenerCondition.pathPatterns(pathPatterns.valueAsList ),
      ],
      port: targetPort.valueAsNumber,
      targets: [asg],
      healthCheck: {
        path: '/ok',
        port: '80',
        healthyHttpCodes: '200',
      },
    });

  }
}