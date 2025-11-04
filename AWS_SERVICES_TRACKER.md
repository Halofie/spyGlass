# 🛡️ AWS Services Tracker - SpyGlass Project

> **Purpose:** Track all AWS resources created for easy cleanup and cost prevention.
> **Last Updated:** November 4, 2025

---

## 🎯 **Active Services & Resources**

### **Region Lock**
- ✅ **Primary Region:** `us-east-1` (N. Virginia)
- ⚠️ **NEVER create resources in other regions** (causes duplicate charges)

---

## 📋 **Services Used**

| Service | Status | Free Tier Limit | Cleanup Required | Notes |
|---------|--------|-----------------|------------------|-------|
| **Lambda** | 🔴 Not Created | 1M requests/month | ✅ Yes - Delete functions | - |
| **API Gateway** | 🔴 Not Created | 1M calls/month (12mo) | ✅ Yes - Delete APIs | - |
| **DynamoDB** | 🔴 Not Created | 25 GB, 25 RCU/WCU | ✅ Yes - Delete tables | - |
| **Cognito** | 🔴 Not Created | 50K MAUs (permanent) | ✅ Yes - Delete user pools | - |
| **CloudWatch Logs** | 🔴 Not Created | 5 GB storage | ✅ YES - SET RETENTION! | **HIGH RISK** |
| **EventBridge** | 🔴 Not Created | 14M invocations/month | ✅ YES - Delete all rules | **HIGH RISK** |
| **SES** | 🔴 Not Created | 3K emails/month | ⚠️ Medium - Verify emails only | Must be same region |
| **SNS** | 🔴 Not Created | 1M publishes | ✅ Yes - Delete topics | - |
| **S3** | 🔴 Not Created | 5 GB storage | ✅ Yes - Delete buckets | - |
| **CloudFront** | 🔴 Not Created | 50 GB transfer | ✅ Yes - Delete distributions | Takes 15 mins to delete |
| **Amplify** | 🔴 Not Created | 1000 build mins/month | ✅ YES - Disable auto-deploy | **HIGH RISK** |
| **IAM Roles** | 🔴 Not Created | Free (unlimited) | ✅ Yes - Delete custom roles | - |
| **CloudFormation** | 🔴 Not Created | Free (management only) | ✅ YES - Delete entire stack | Easiest cleanup method |

---

## 🚨 **High-Risk Items to Monitor**

### 1. **CloudWatch Logs** ⚠️ CRITICAL
- **Risk:** Auto-generated for every Lambda/API Gateway invocation
- **Limit:** 5 GB free, then $0.50/GB
- **Prevention:**
  ```bash
  # Set retention policy to 1 day for all log groups
  aws logs put-retention-policy --log-group-name /aws/lambda/function-name --retention-in-days 1
  ```
- **Cleanup Command:**
  ```bash
  # Delete all log groups with "spyglass" prefix
  aws logs describe-log-groups --log-group-name-prefix /aws/lambda/spyglass --query 'logGroups[*].logGroupName' --output text | ForEach-Object { aws logs delete-log-group --log-group-name $_ }
  ```
- **Status:** 🔴 Not configured

---

### 2. **EventBridge Rules** ⚠️ CRITICAL
- **Risk:** Scheduled triggers run forever if not deleted
- **Limit:** Free up to 14M invocations, but can trigger expensive Lambda calls
- **Prevention:**
  - Always disable rules after testing
  - Set expiration dates where possible
- **Cleanup Command:**
  ```bash
  # List all rules
  aws events list-rules --query 'Rules[*].Name'
  
  # Delete specific rule
  aws events delete-rule --name spyglass-rule-name
  ```
- **Status:** 🔴 Not created

---

### 3. **Amplify Auto-Deploy** ⚠️ CRITICAL
- **Risk:** Every Git commit triggers a build (1000 mins/month limit)
- **Limit:** 1000 build minutes/month
- **Prevention:**
  - Disable auto-deploy
  - Manually trigger builds only when needed
- **Status:** 🔴 Not configured

---

### 4. **DynamoDB Over-Writes** ⚠️ MEDIUM
- **Risk:** Loop testing or bulk writes can exceed 25 WCU
- **Limit:** 25 Write Capacity Units (permanent free tier)
- **Prevention:**
  - Add delays in test loops
  - Use batch writes
  - Delete test data regularly
- **Cleanup Command:**
  ```bash
  # Delete table
  aws dynamodb delete-table --table-name SpyGlass-Applets
  ```
- **Status:** 🔴 Not created

---

### 5. **API Gateway Polling** ⚠️ MEDIUM
- **Risk:** Frontend auto-refresh can burn through 1M calls quickly
- **Limit:** 1M API calls/month (12-month free tier)
- **Prevention:**
  - Avoid auto-polling in React components
  - Use WebSockets for real-time updates (or don't implement real-time)
  - Cache responses where possible
- **Status:** 🔴 Not created

---

## 📊 **Resource Inventory**

### **Lambda Functions**
| Function Name | ARN | Created Date | Last Modified | Status |
|--------------|-----|--------------|---------------|--------|
| - | - | - | - | 🔴 None |

### **API Gateway APIs**
| API Name | ID | Endpoint | Created Date | Status |
|----------|-----|----------|--------------|--------|
| - | - | - | - | 🔴 None |

### **DynamoDB Tables**
| Table Name | Items Count | Size (GB) | Created Date | Status |
|------------|-------------|-----------|--------------|--------|
| - | - | - | - | 🔴 None |

### **S3 Buckets**
| Bucket Name | Size (GB) | Objects | Created Date | Status |
|-------------|-----------|---------|--------------|--------|
| - | - | - | - | 🔴 None |

### **CloudWatch Log Groups**
| Log Group | Retention | Size (MB) | Last Event | Status |
|-----------|-----------|-----------|------------|--------|
| - | - | - | - | 🔴 None |

### **EventBridge Rules**
| Rule Name | Schedule | Target | Status | Actions |
|-----------|----------|--------|--------|---------|
| - | - | - | 🔴 None | - |

### **Cognito User Pools**
| Pool Name | Pool ID | Users | Created Date | Status |
|-----------|---------|-------|--------------|--------|
| - | - | - | - | 🔴 None |

### **SES Verified Identities**
| Email/Domain | Verification Status | Region | Created Date | Status |
|--------------|---------------------|--------|--------------|--------|
| - | - | - | - | 🔴 None |

---

## 🧹 **Cleanup Checklist**

### **Quick Cleanup (After Testing)**
- [ ] Disable all EventBridge rules
- [ ] Set CloudWatch log retention to 1 day
- [ ] Delete test data from DynamoDB
- [ ] Clear S3 bucket contents
- [ ] Disable Amplify auto-deploy

### **Full Cleanup (Project Complete)**
- [ ] Delete CloudFormation/Serverless stack (easiest method)
- [ ] Delete all Lambda functions
- [ ] Delete API Gateway APIs
- [ ] Delete DynamoDB tables
- [ ] Delete S3 buckets (empty first)
- [ ] Delete CloudFront distributions (takes 15+ minutes)
- [ ] Delete Cognito user pools
- [ ] Delete CloudWatch log groups
- [ ] Delete EventBridge rules
- [ ] Delete SNS topics
- [ ] Remove SES verified emails
- [ ] Delete custom IAM roles/policies
- [ ] Delete Amplify app

### **Nuclear Option (Delete Everything)**
```powershell
# Use AWS Tag Editor to delete all resources with tag "Project:SpyGlass"
# Or delete the entire CloudFormation stack:
aws cloudformation delete-stack --stack-name spyglass-stack
```

---

## 💰 **Cost Monitoring**

### **AWS Budget Setup**
```bash
# Create $0 budget alert
aws budgets create-budget --account-id YOUR_ACCOUNT_ID --budget file://zero-budget.json
```

**zero-budget.json:**
```json
{
  "BudgetName": "SpyGlass-Zero-Cost-Alert",
  "BudgetLimit": {
    "Amount": "0.01",
    "Unit": "USD"
  },
  "TimeUnit": "MONTHLY",
  "BudgetType": "COST"
}
```

### **Usage Alerts Configured**
- [ ] AWS Budget: $0 threshold
- [ ] Lambda invocation count alarm
- [ ] DynamoDB consumed capacity alarm
- [ ] API Gateway request count alarm
- [ ] CloudWatch Logs size alarm (> 4 GB)

---

## 🔍 **Daily Monitoring Commands**

```powershell
# Check Lambda invocation count (today)
aws cloudwatch get-metric-statistics --namespace AWS/Lambda --metric-name Invocations --dimensions Name=FunctionName,Value=spyglass-function --start-time (Get-Date).AddDays(-1).ToString('yyyy-MM-ddTHH:mm:ss') --end-time (Get-Date).ToString('yyyy-MM-ddTHH:mm:ss') --period 86400 --statistics Sum

# Check DynamoDB consumed capacity
aws cloudwatch get-metric-statistics --namespace AWS/DynamoDB --metric-name ConsumedWriteCapacityUnits --dimensions Name=TableName,Value=SpyGlass-Applets --start-time (Get-Date).AddDays(-1).ToString('yyyy-MM-ddTHH:mm:ss') --end-time (Get-Date).ToString('yyyy-MM-ddTHH:mm:ss') --period 86400 --statistics Sum

# Check CloudWatch Logs storage
aws logs describe-log-groups --query 'sum(logGroups[*].storedBytes)' --output text

# List all active EventBridge rules
aws events list-rules --query 'Rules[?State==`ENABLED`].[Name,ScheduleExpression]' --output table

# Get current month's estimated charges
aws ce get-cost-and-usage --time-period Start=(Get-Date -Day 1 -Hour 0 -Minute 0 -Second 0).ToString('yyyy-MM-dd'),End=(Get-Date).ToString('yyyy-MM-dd') --granularity MONTHLY --metrics BlendedCost
```

---

## 📝 **Deployment History**

| Date | Action | Resources Modified | Notes |
|------|--------|-------------------|-------|
| 2025-11-04 | Tracker Created | - | Initial planning phase |

---

## 🎯 **Best Practices Applied**

1. ✅ **Single Region:** All resources in `us-east-1`
2. ✅ **Tagging:** All resources tagged with `Project:SpyGlass`
3. ✅ **CloudWatch Retention:** Set to 1 day for all log groups
4. ✅ **EventBridge:** Manual trigger only, no auto-schedules
5. ✅ **Amplify:** Auto-deploy disabled
6. ✅ **API Caching:** Implemented where possible
7. ✅ **Compression:** Vite build optimizations enabled
8. ✅ **Budget Alerts:** $0.01 threshold configured

---

## 🚀 **Next Steps**

- [ ] Set up AWS CLI with `us-east-1` as default region
- [ ] Configure AWS Budget alert ($0 threshold)
- [ ] Enable Free Tier usage alerts in AWS Console
- [ ] Create CloudFormation/Serverless template (for easy cleanup)
- [ ] Set up cost allocation tags

---

## 📞 **Emergency Cleanup**

If you see unexpected charges:

1. **Immediately disable all EventBridge rules:**
   ```powershell
   aws events list-rules --query 'Rules[*].Name' --output text | ForEach-Object { aws events disable-rule --name $_ }
   ```

2. **Delete all CloudWatch log groups:**
   ```powershell
   aws logs describe-log-groups --query 'logGroups[*].logGroupName' --output text | ForEach-Object { aws logs delete-log-group --log-group-name $_ }
   ```

3. **Delete CloudFormation stack:**
   ```powershell
   aws cloudformation delete-stack --stack-name spyglass-stack
   ```

4. **Check Cost Explorer:**
   - AWS Console → Billing → Cost Explorer
   - Filter by tag: `Project:SpyGlass`
   - Identify culprit service

---

**Remember:** The easiest cleanup is using CloudFormation/Serverless Framework. Delete the stack = delete everything at once! 🎯
