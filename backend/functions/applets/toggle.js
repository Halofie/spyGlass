const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.REGION });
const ddb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    const userId = event.requestContext.authorizer.claims.sub;
    const { id } = event.pathParameters;

    // Get current applet
    const getResult = await ddb.send(new GetCommand({
      TableName: process.env.APPLETS_TABLE,
      Key: {
        userId,
        appletId: id,
      },
    }));

    if (!getResult.Item) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ error: 'Applet not found' }),
      };
    }

    // Toggle enabled status
    const result = await ddb.send(new UpdateCommand({
      TableName: process.env.APPLETS_TABLE,
      Key: {
        userId,
        appletId: id,
      },
      UpdateExpression: 'SET enabled = :enabled, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':enabled': !getResult.Item.enabled,
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
    console.error('Error toggling applet:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ error: 'Could not toggle applet' }),
    };
  }
};
