// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB();
const uuid = require('uuid');
const tableName = process.env.TABLE_NAME;
exports.lambdaHandler = async (event, context) => {
  try {
    const put_params = {
      TableName: tableName,
      Item: {
        id: { S: uuid.v1() },
        description: { S: 'added' },
        timestamp: { S: 'now' },
      },
    };

    await ddb.putItem(put_params).promise();
    const get_params = {
      TableName: tableName,
      Select: 'ALL_ATTRIBUTES',
    };

    const list_response = await ddb.scan(get_params).promise();
    // const ret = await axios(url);
    response = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'hello serverless friends',
        count: list_response.Items.length,

        // location: ret.data.trim()
      }),
    };
  } catch (err) {
    console.log(err);
    return err;
  }

  return response;
};
