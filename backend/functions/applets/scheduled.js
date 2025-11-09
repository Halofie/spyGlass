// This function is triggered by EventBridge on a schedule
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { v4: uuidv4 } = require('uuid');

const ddbClient = new DynamoDBClient({ region: process.env.REGION });
const ddb = DynamoDBDocumentClient.from(ddbClient);
const ses = new SESClient({ region: process.env.REGION });

exports.handler = async (event) => {
  try {
    console.log('Scheduled trigger event:', JSON.stringify(event));

    // Find all enabled applets with schedule triggers
    const result = await ddb.send(new ScanCommand({
      TableName: process.env.APPLETS_TABLE,
      FilterExpression: 'enabled = :enabled AND #trigger.#type = :triggerType',
      ExpressionAttributeNames: {
        '#trigger': 'trigger',
        '#type': 'type',
      },
      ExpressionAttributeValues: {
        ':enabled': true,
        ':triggerType': 'schedule',
      },
    }));

    // Execute each matching applet
    for (const applet of result.Items || []) {
      await executeApplet(applet);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ processed: result.Items?.length || 0 }),
    };
  } catch (error) {
    console.error('Error in scheduled trigger:', error);
    throw error;
  }
};

async function executeApplet(applet) {
  try {
    // Log execution
    const execution = {
      appletId: applet.appletId,
      executionId: uuidv4(),
      status: 'success',
      timestamp: new Date().toISOString(),
      ttl: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60),
    };

    await ddb.send(new PutCommand({
      TableName: process.env.EXECUTIONS_TABLE,
      Item: execution,
    }));

    // Execute action based on type
    if (applet.action.type === 'email') {
      await sendEmail(applet.config.action);
    }

    console.log('Executed applet:', applet.appletId);
  } catch (error) {
    console.error('Error executing applet:', applet.appletId, error);
  }
}

async function sendEmail(config) {
  const params = {
    Source: config.from || 'noreply@spyglass.app',
    Destination: {
      ToAddresses: [config.to],
    },
    Message: {
      Subject: {
        Data: config.subject || 'SpyGlass Automation',
      },
      Body: {
        Text: {
          Data: config.body || 'This is an automated message from SpyGlass.',
        },
      },
    },
  };

  await ses.send(new SendEmailCommand(params));
}
