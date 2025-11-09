# 🚀 SpyGlass - IFTTT Clone Deployment Guide

## Pre-Deployment Checklist

### ✅ Completed Items

- [x] **Environment Configuration**
  - `.env.example` created with all required variables
  - `.env.local` configured for local development
  - Config system in `src/config/index.js`

- [x] **API Service Layer**
  - Mock API for local testing (`src/services/mockApi.js`)
  - Real API integration ready (`src/services/api.js`)
  - Toggle between mock/real via environment variable

- [x] **Error Handling**
  - Error boundary component added
  - API interceptors for auth and error handling
  - Loading states in all pages

- [x] **Build Optimization**
  - Vite config optimized for production
  - Code splitting configured
  - Console logs removed in production
  - Bundle size optimized

- [x] **Git Configuration**
  - `.gitignore` updated for AWS and environment files
  - Ready for version control

---

## 🎯 What's Ready for AWS

### Frontend ✅
- Complete React UI with routing
- Authentication flow (ready for Cognito)
- Dashboard and applet management
- IFTTT-style applet builder
- Responsive design
- Mock data for testing

### Backend (Next Steps) 📋
- [ ] Lambda functions
- [ ] API Gateway
- [ ] DynamoDB tables
- [ ] Cognito User Pool
- [ ] SES email service
- [ ] EventBridge schedulers

---

## 📦 Build for Production

### 1. Test Production Build Locally

```powershell
# Build the project
npm run build

# Preview the production build
npm run preview
```

Visit `http://localhost:4173` to test the production build.

### 2. Check Build Output

```powershell
# Check dist folder size
Get-ChildItem -Path dist -Recurse | Measure-Object -Property Length -Sum
```

Expected output: ~200-300 KB (gzipped)

---

## 🚀 Deployment Options

### Option 1: AWS Amplify (Recommended - Easiest)

**Pros:**
- Free hosting + CI/CD
- Automatic HTTPS
- Easy GitHub integration
- 1000 build minutes/month free

**Steps:**
1. Push code to GitHub
2. Go to AWS Amplify Console
3. Connect repository
4. **Important:** Disable auto-deploy in settings
5. Set environment variables:
   ```
   VITE_USE_MOCK_API=false
   VITE_AWS_REGION=ap-south-1
   VITE_AWS_API_GATEWAY_URL=<your-api-url>
   VITE_AWS_COGNITO_USER_POOL_ID=<your-pool-id>
   VITE_AWS_COGNITO_CLIENT_ID=<your-client-id>
   ```
6. Trigger manual build

### Option 2: S3 + CloudFront

**Pros:**
- Full control
- Very cheap (free tier)
- Fast CDN delivery

**Steps:**
1. Create S3 bucket
2. Enable static website hosting
3. Upload `dist/` folder contents
4. Create CloudFront distribution
5. Point to S3 bucket
6. Configure custom domain (optional)

---

## 🔧 Backend Deployment (Next)

### Infrastructure as Code Options

**Option 1: AWS SAM (Recommended)**
```yaml
# template.yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
```

**Option 2: Serverless Framework**
```yaml
# serverless.yml
service: spyglass-backend
provider:
  name: aws
  region: ap-south-1
```

### Services to Create

1. **DynamoDB Tables:**
   - Users (if not using Cognito fully)
   - Applets
   - Executions

2. **Lambda Functions:**
   - `createApplet`
   - `getApplets`
   - `updateApplet`
   - `deleteApplet`
   - `executeApplet` (webhook handler)
   - `scheduledTrigger` (EventBridge target)

3. **API Gateway:**
   - REST API with CORS
   - Cognito authorizer
   - Endpoints for CRUD operations

4. **Cognito:**
   - User Pool
   - App Client
   - Identity Pool (for AWS SDK access)

5. **SES:**
   - Verify sender email
   - Create email templates

6. **EventBridge:**
   - Rules for scheduled triggers

---

## ⚠️ Cost Prevention Checklist

Before deploying, ensure:

- [ ] CloudWatch log retention set to 1-3 days
- [ ] All EventBridge rules disabled by default
- [ ] Amplify auto-deploy disabled
- [ ] AWS Budget alert configured ($0.01 threshold)
- [ ] All resources tagged with `Project:SpyGlass`
- [ ] DynamoDB on-demand billing mode
- [ ] Lambda memory set to minimum (128MB)
- [ ] API Gateway throttling configured

---

## 🧪 Testing Strategy

### Before AWS Deployment

1. **Local Testing (Current)**
   ```powershell
   npm run dev
   # Test with mock data
   ```

2. **Production Build Testing**
   ```powershell
   npm run build
   npm run preview
   # Test optimized bundle
   ```

### After Backend Deployment

3. **Staging Environment**
   - Use separate AWS account or region
   - Test with real AWS services
   - Verify free tier compliance

4. **Production**
   - Deploy backend first
   - Update frontend environment variables
   - Deploy frontend
   - Monitor CloudWatch

---

## 📊 Monitoring Setup

### CloudWatch Alarms (Create These)

```powershell
# Lambda invocations
aws cloudwatch put-metric-alarm --alarm-name spyglass-lambda-invocations --metric-name Invocations --namespace AWS/Lambda --statistic Sum --period 86400 --threshold 900000 --comparison-operator GreaterThanThreshold

# DynamoDB consumed capacity
aws cloudwatch put-metric-alarm --alarm-name spyglass-dynamodb-writes --metric-name ConsumedWriteCapacityUnits --namespace AWS/DynamoDB --statistic Sum --period 86400 --threshold 20 --comparison-operator GreaterThanThreshold
```

---

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions Example

```yaml
name: Deploy to AWS
on:
  workflow_dispatch: # Manual trigger only

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build
        run: npm ci && npm run build
      - name: Deploy to S3
        run: aws s3 sync dist/ s3://your-bucket --delete
```

---

## 📝 Environment Variables Reference

### Local Development (`.env.local`)
```env
VITE_USE_MOCK_API=true
VITE_API_BASE_URL=http://localhost:3000/api
```

### Production (AWS Amplify/Environment)
```env
VITE_USE_MOCK_API=false
VITE_AWS_REGION=ap-south-1
VITE_AWS_API_GATEWAY_URL=https://xxxxx.execute-api.ap-south-1.amazonaws.com/prod
VITE_AWS_COGNITO_USER_POOL_ID=ap-south-1_xxxxxxxxx
VITE_AWS_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🎯 Next Steps

1. **Now:** Frontend is ready, test locally
2. **Next:** Set up AWS backend infrastructure
3. **Then:** Connect frontend to real AWS services
4. **Finally:** Deploy both and monitor

---

## 🆘 Troubleshooting

### Build Fails
```powershell
# Clear cache and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
npm run build
```

### Environment Variables Not Working
- Check variable names start with `VITE_`
- Restart dev server after changing `.env` files
- Verify `import.meta.env.VITE_*` in code

### Large Bundle Size
```powershell
# Analyze bundle
npm run build -- --report
```

---

**Ready to proceed with AWS backend setup?** 🚀
