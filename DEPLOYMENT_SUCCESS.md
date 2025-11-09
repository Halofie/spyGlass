# 🎉 SpyGlass Backend - Successfully Deployed!

**Deployment Date:** November 4, 2025  
**Region:** ap-south-1 (Mumbai, India)  
**Stack:** spyglass-backend-dev  
**Status:** ✅ LIVE

---

## 🌐 **Live Endpoints**

### **API Gateway Base URL**
```
https://vpza0e2s7d.execute-api.ap-south-1.amazonaws.com/dev
```

### **Available Endpoints**
1. **POST** `/applets` - Create new applet
2. **GET** `/applets` - List all user's applets
3. **GET** `/applets/{id}` - Get single applet
4. **PUT** `/applets/{id}` - Update applet
5. **DELETE** `/applets/{id}` - Delete applet
6. **PATCH** `/applets/{id}/toggle` - Toggle applet enabled/disabled
7. **POST** `/webhooks/{id}` - Trigger webhook

---

## 🔐 **Authentication Details**

### **Cognito User Pool**
- **Pool ID:** `ap-south-1_c0MiFDyX3`
- **Client ID:** `7nap5fau84bu915532pnve974l`
- **Region:** `ap-south-1`

### **How to Authenticate**
1. Sign up: Use AWS Cognito SDK or Amplify
2. Get ID token from Cognito
3. Add to API requests:
   ```
   Authorization: Bearer <ID_TOKEN>
   ```

---

## 📦 **Deployed Resources**

### **Lambda Functions (8)**
| Function Name | Purpose |
|---------------|---------|
| `spyglass-backend-dev-createApplet` | Create new applet |
| `spyglass-backend-dev-getApplets` | List user's applets |
| `spyglass-backend-dev-getApplet` | Get single applet |
| `spyglass-backend-dev-updateApplet` | Update applet |
| `spyglass-backend-dev-deleteApplet` | Delete applet |
| `spyglass-backend-dev-toggleApplet` | Enable/disable applet |
| `spyglass-backend-dev-webhookTrigger` | Handle webhook calls |
| `spyglass-backend-dev-scheduledTrigger` | Handle scheduled triggers |

### **DynamoDB Tables (2)**
| Table Name | Partition Key | Sort Key | TTL |
|------------|---------------|----------|-----|
| `spyglass-applets-dev` | userId | appletId | - |
| `spyglass-executions-dev` | appletId | executionId | 30 days |

### **CloudWatch Logs**
- ✅ **Retention:** 1 day (to prevent charges)
- 8 log groups created automatically

### **S3 Bucket**
- **Deployment Bucket:** `spyglass-backend-dev-serverlessdeploymentbucket-ekbssmfwtxeo`
- Contains Lambda deployment packages

---

## ⚙️ **Frontend Configuration**

Update your `.env.local` file:

```bash
VITE_API_BASE_URL=https://vpza0e2s7d.execute-api.ap-south-1.amazonaws.com/dev
VITE_USE_MOCK_API=false
VITE_AWS_REGION=ap-south-1
VITE_AWS_USER_POOL_ID=ap-south-1_c0MiFDyX3
VITE_AWS_USER_POOL_CLIENT_ID=7nap5fau84bu915532pnve974l
```

---

## 🧪 **Testing the Backend**

### **1. Test with cURL (No Auth - Will Fail)**
```bash
curl -X GET https://vpza0e2s7d.execute-api.ap-south-1.amazonaws.com/dev/applets
# Expected: 401 Unauthorized (Cognito auth required)
```

### **2. Create a Test User (via Cognito)**
You need to integrate AWS Cognito in your frontend first. For now, the backend is ready but requires authentication.

### **3. Next Steps**
1. ✅ Backend deployed
2. ⏳ Integrate AWS Cognito in frontend (install `amazon-cognito-identity-js`)
3. ⏳ Update AuthContext to use real Cognito
4. ⏳ Test signup/login flow
5. ⏳ Deploy frontend to AWS Amplify

---

## 💰 **Cost Monitoring**

### **Current Status: FREE TIER ✅**

All services are within free tier limits:
- Lambda: 1M requests/month (currently 0)
- API Gateway: 1M calls/month (currently 0)
- DynamoDB: 25 GB storage (currently <1 MB)
- Cognito: 50K MAUs (currently 0)
- CloudWatch: Logs expire after 1 day ✅

### **How to Stay Free**
1. Don't exceed 1M API calls/month
2. Don't store >25 GB in DynamoDB
3. Don't create more than 50K users/month
4. Logs auto-delete after 1 day ✅

---

## 🗑️ **Cleanup Commands**

### **Delete Everything (When Done)**
```powershell
cd c:\Users\varun\Documents\MyCode\spyGlass\backend
npx serverless remove --stage dev --region ap-south-1
```

This will delete:
- All Lambda functions
- API Gateway
- DynamoDB tables
- Cognito User Pool
- CloudWatch Logs
- S3 deployment bucket
- IAM roles

**Cost after deletion: ₹0** 🎯

---

## 🚀 **Next Steps**

1. **Integrate Cognito in Frontend**
   ```bash
   npm install amazon-cognito-identity-js
   ```

2. **Update AuthContext.jsx**
   - Replace mock auth with Cognito SDK
   - Use `CognitoUserPool` and `CognitoUser`

3. **Test Backend**
   - Sign up a test user
   - Create an applet via API
   - Verify in DynamoDB table

4. **Deploy Frontend**
   - Push to GitHub
   - Connect to AWS Amplify
   - Set environment variables
   - Deploy!

---

## 📊 **CloudFormation Stack Info**

```bash
# View stack details
aws cloudformation describe-stacks --stack-name spyglass-backend-dev --region ap-south-1

# View all resources
aws cloudformation describe-stack-resources --stack-name spyglass-backend-dev --region ap-south-1

# View outputs
aws cloudformation describe-stacks --stack-name spyglass-backend-dev --region ap-south-1 --query 'Stacks[0].Outputs'
```

---

**🎊 Congratulations! Your backend is now live on AWS!** 🎊

You're running a fully serverless IFTTT clone on AWS free tier. No servers to manage, pay only for what you use (currently ₹0).

