const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { v4: uuidv4 } = require('uuid');

const ddbClient = new DynamoDBClient({ region: process.env.REGION });
const ddb = DynamoDBDocumentClient.from(ddbClient);
const ses = new SESClient({ region: process.env.REGION });

exports.handler = async (event) => {
  try {
    const { id } = event.pathParameters;
    const payload = JSON.parse(event.body || '{}');

    // Scan for the applet by appletId (inefficient but works for MVP)
    const result = await ddb.send(new ScanCommand({
      TableName: process.env.APPLETS_TABLE,
      FilterExpression: 'appletId = :appletId',
      ExpressionAttributeValues: {
        ':appletId': id,
      },
    }));

    if (!result.Items || result.Items.length === 0) {
      return {
        statusCode: 404,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Applet not found' }),
      };
    }

    const applet = result.Items[0];

    if (!applet.enabled) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Applet is disabled' }),
      };
    }

    // Execute the applet action
    await executeAppletAction(applet, payload);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Webhook triggered',
        appletName: applet.name 
      }),
    };
  } catch (error) {
    console.error('Error processing webhook:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Could not process webhook', details: error.message }),
    };
  }
};

async function executeAppletAction(applet, payload) {
  const executionId = uuidv4();
  
  try {
    // Execute the action based on type
    if (applet.action.type === 'email') {
      await sendEmail(applet.action.config, payload);
    } else if (applet.action.type === 'webhook') {
      await triggerWebhook(applet.action.config, payload);
    }

    // Log successful execution
    await logExecution(applet.appletId, executionId, 'success', payload);
    
  } catch (error) {
    console.error('Action execution failed:', error);
    // Log failed execution
    await logExecution(applet.appletId, executionId, 'failed', payload, error.message);
    throw error;
  }
}

async function sendEmail(actionConfig, payload) {
  const emailParams = {
    Source: actionConfig.from || 'varunkrishnan220055@gmail.com', // Use verified email
    Destination: {
      ToAddresses: [actionConfig.to || 'varunkrishnan220055@gmail.com'],
    },
    Message: {
      Subject: {
        Data: actionConfig.subject || 'SpyGlass Webhook Triggered',
      },
      Body: {
        Text: {
          Data: actionConfig.body || `Webhook triggered!\n\nPayload:\n${JSON.stringify(payload, null, 2)}`,
        },
        Html: {
          Data: `
            <h2>${actionConfig.subject || 'SpyGlass Webhook Triggered'}</h2>
            <p>${actionConfig.body || 'Your webhook was triggered!'}</p>
            <h3>Payload:</h3>
            <pre>${JSON.stringify(payload, null, 2)}</pre>
            <hr>
            <p style="color: gray; font-size: 12px;">Sent by SpyGlass Automation</p>
          `,
        },
      },
    },
  };

  const result = await ses.send(new SendEmailCommand(emailParams));
  console.log('Email sent:', result.MessageId);
  return result;
}

async function triggerWebhook(actionConfig, payload) {
  // Trigger another webhook
  const response = await fetch(actionConfig.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(actionConfig.headers || {}),
    },
    body: JSON.stringify(payload),
  });
  
  console.log('Webhook triggered:', actionConfig.url, response.status);
  return response;
}

async function logExecution(appletId, executionId, status, payload, errorMessage) {
  const execution = {
    appletId,
    executionId,
    status,
    timestamp: new Date().toISOString(),
    payload,
    ttl: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days TTL
  };

  if (errorMessage) {
    execution.error = errorMessage;
  }

  await ddb.send(new PutCommand({
    TableName: process.env.EXECUTIONS_TABLE,
    Item: execution,
  }));
}
