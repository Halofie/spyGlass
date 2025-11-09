const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.REGION });
const ddb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    const userId = event.requestContext.authorizer.claims.sub;
    const { id } = event.pathParameters;
    const body = JSON.parse(event.body);

    const result = await ddb.send(new UpdateCommand({
      TableName: process.env.APPLETS_TABLE,
      Key: {
        userId,
        appletId: id,
      },
      UpdateExpression: 'SET #name = :name, #trigger = :trigger, #action = :action, #config = :config, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#trigger': 'trigger',
        '#action': 'action',
        '#config': 'config',
      },
      ExpressionAttributeValues: {
        ':name': body.name,
        ':trigger': body.trigger,
        ':action': body.action,
        ':config': body.config,
        ':updatedAt': new Date().toISOString(),
      },
      ReturnValues: 'ALL_NEW',
    }));

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(result.Attributes),
    };
  } catch (error) {
    console.error('Error updating applet:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ error: 'Could not update applet' }),
    };
  }
};
