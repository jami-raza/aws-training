import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';
import { HitCounter } from './hit-counter';
import {TableViewer} from 'cdk-dynamo-table-viewer';

export class TodoAppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // defines an AWS Lambda resource
    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_10_X,    // execution environment
      code: lambda.Code.fromAsset('lambda-function'),  // code loaded from "lambda" directory
      handler: 'hello.handler'                // file is "hello", function is "handler"
    });
    const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
      downstream: hello
    });

    new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: helloWithCounter.handler
    });
    new TableViewer(this, 'ViewHitCounter', {
      title:'Hello table view',
      table: helloWithCounter.table
    })
  }
}
