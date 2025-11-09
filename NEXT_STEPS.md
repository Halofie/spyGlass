# 🎯 Next Steps - Complete Deployment Guide

## ✅ **What's Done**

### Backend (100% Complete)
- ✅ 8 Lambda functions deployed to ap-south-1
- ✅ API Gateway configured with CORS
- ✅ DynamoDB tables (Applets + Executions)
- ✅ Cognito User Pool created
- ✅ CloudWatch Logs retention set to 1 day
- ✅ All within AWS Free Tier

### Frontend (80% Complete)
- ✅ React UI fully built (5 pages)
- ✅ TailwindCSS v4 styling
- ✅ Mock authentication working
- ✅ Environment variables configured
- ⏳ Need to integrate real Cognito auth
- ⏳ Need to deploy to Amplify

---

## 🚀 **Immediate Next Steps**

### **Step 1: Update Node.js** 
Your current version is 20.15.0, but Vite requires 20.19+.

**Options:**
1. **Download from nodejs.org:**
   - Visit https://nodejs.org/
   - Download Node.js 22.x LTS
   - Install and restart VS Code

2. **Or use nvm-windows:**
   ```powershell
   nvm install 22
   nvm use 22
   ```

---

### **Step 2: Integrate AWS Cognito in Frontend** ⏰ ~30 mins

#### **2.1 Install Cognito SDK**
```powershell
cd c:\Users\varun\Documents\MyCode\spyGlass
npm install amazon-cognito-identity-js
```

#### **2.2 Update AuthContext.jsx**
Replace the mock auth with real Cognito. Here's the template:

```javascript
import { createContext, useState, useContext, useEffect } from 'react';
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
import { config } from '../config';

const userPool = new CognitoUserPool({
  UserPoolId: config.cognito.userPoolId,
  ClientId: config.cognito.clientId,
});

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = userPool.getCurrentUser();
    if (currentUser) {
      currentUser.getSession((err, session) => {
        if (err) {
          setLoading(false);
          return;
        }
        setUser({
          email: currentUser.getUsername(),
          token: session.getIdToken().getJwtToken(),
        });
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const signup = (email, password) => {
    return new Promise((resolve, reject) => {
      const attributeList = [
        new CognitoUserAttribute({ Name: 'email', Value: email }),
      ];

      userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result.user);
      });
    });
  };

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      const user = new CognitoUser({
        Username: email,
        Pool: userPool,
      });

      const authDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });

      user.authenticateUser(authDetails, {
        onSuccess: (session) => {
          setUser({
            email,
            token: session.getIdToken().getJwtToken(),
          });
          resolve(session);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  };

  const logout = () => {
    const currentUser = userPool.getCurrentUser();
    if (currentUser) {
      currentUser.signOut();
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

#### **2.3 Update config/index.js**
Add Cognito config:

```javascript
export const config = {
  apiUrl: import.meta.env.VITE_API_BASE_URL,
  useMockApi: import.meta.env.VITE_USE_MOCK_API === 'true',
  cognito: {
    userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID,
    clientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID,
    region: import.meta.env.VITE_AWS_REGION,
  },
  // ... rest of config
};
```

---

### **Step 3: Test Locally** ⏰ ~15 mins

```powershell
npm run dev
```

1. Open http://localhost:5173
2. Try signing up with a real email
3. Check email for verification code (if required)
4. Login with your credentials
5. Create a test applet
6. Verify it appears in DynamoDB:
   ```bash
   aws dynamodb scan --table-name spyglass-applets-dev --region ap-south-1
   ```

---

### **Step 4: Build for Production** ⏰ ~2 mins

```powershell
npm run build
```

Expected output: `dist/` folder with optimized files (~281 KB)

---

### **Step 5: Deploy Frontend to AWS Amplify** ⏰ ~20 mins

#### **5.1 Create GitHub Repository**
```powershell
git init
git add .
git commit -m "Initial commit - SpyGlass IFTTT clone"
git branch -M main
```

Then create a repo on GitHub and push:
```powershell
git remote add origin https://github.com/YOUR_USERNAME/spyglass.git
git push -u origin main
```

#### **5.2 Connect to AWS Amplify**

1. **Open AWS Amplify Console:**
   - https://ap-south-1.console.aws.amazon.com/amplify/home?region=ap-south-1

2. **New App → Host Web App**

3. **Connect GitHub:**
   - Select your `spyglass` repository
   - Select `main` branch

4. **Configure Build Settings:**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

5. **Environment Variables (CRITICAL!):**
   Add these in Amplify Console:
   ```
   VITE_API_BASE_URL=https://vpza0e2s7d.execute-api.ap-south-1.amazonaws.com/dev
   VITE_USE_MOCK_API=false
   VITE_AWS_REGION=ap-south-1
   VITE_AWS_USER_POOL_ID=ap-south-1_c0MiFDyX3
   VITE_AWS_USER_POOL_CLIENT_ID=7nap5fau84bu915532pnve974l
   VITE_ENABLE_WEBHOOK_TRIGGERS=true
   VITE_ENABLE_SCHEDULED_TRIGGERS=true
   VITE_ENABLE_EMAIL_ACTIONS=true
   VITE_APP_NAME=SpyGlass
   VITE_APP_VERSION=1.0.0
   ```

6. **Deploy:**
   - Click "Save and Deploy"
   - Wait ~5 minutes
   - You'll get a URL like: `https://main.d1234567890.amplifyapp.com`

7. **IMPORTANT: Disable Auto-Deploy**
   - App Settings → Build Settings
   - Toggle OFF "Auto build"
   - This prevents burning through your 1000 build minutes

---

### **Step 6: Configure SES (Optional - for Email Actions)** ⏰ ~10 mins

Only needed if you want email notifications to work:

```bash
# Verify your email address
aws ses verify-email-identity --email-address your-email@example.com --region ap-south-1

# Check verification status
aws ses get-identity-verification-attributes --identities your-email@example.com --region ap-south-1
```

Click the verification link in your email.

**Note:** SES starts in sandbox mode (can only send to verified emails). To send to anyone, request production access (requires AWS Support ticket).

---

## 🎯 **Final Checklist**

### Before Going Live
- [ ] Node.js updated to 22.x
- [ ] Cognito integrated in frontend
- [ ] Tested signup/login locally
- [ ] Created at least one test applet
- [ ] Verified data in DynamoDB
- [ ] Production build successful
- [ ] GitHub repo created
- [ ] Amplify deployed
- [ ] Auto-deploy disabled
- [ ] Environment variables set in Amplify
- [ ] Tested on live Amplify URL
- [ ] SES email verified (if using email actions)

### Cost Monitoring
- [ ] CloudWatch Logs retention = 1 day ✅
- [ ] EventBridge rules disabled (if not in use)
- [ ] Set up AWS Budget Alert ($1 threshold)
- [ ] Bookmark AWS Cost Explorer

---

## 💡 **Cost Optimization Tips**

### **1. Set Up Budget Alerts**
```bash
aws budgets create-budget \
  --account-id 888990920216 \
  --budget '{
    "BudgetName": "SpyGlass-Monthly-Limit",
    "BudgetLimit": { "Amount": "1", "Unit": "USD" },
    "TimeUnit": "MONTHLY",
    "BudgetType": "COST"
  }' \
  --region ap-south-1
```

### **2. Monitor Usage Weekly**
```bash
# Check Lambda invocations
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Invocations \
  --start-time 2025-11-01T00:00:00Z \
  --end-time 2025-11-30T23:59:59Z \
  --period 86400 \
  --statistics Sum \
  --region ap-south-1

# Check API Gateway calls
aws cloudwatch get-metric-statistics \
  --namespace AWS/ApiGateway \
  --metric-name Count \
  --dimensions Name=ApiName,Value=spyglass-backend-dev \
  --start-time 2025-11-01T00:00:00Z \
  --end-time 2025-11-30T23:59:59Z \
  --period 86400 \
  --statistics Sum \
  --region ap-south-1
```

### **3. Cleanup Test Data Regularly**
```bash
# Scan and delete test applets
aws dynamodb scan --table-name spyglass-applets-dev --region ap-south-1

# Delete specific item
aws dynamodb delete-item \
  --table-name spyglass-applets-dev \
  --key '{"userId":{"S":"test-user"},"appletId":{"S":"test-applet-id"}}' \
  --region ap-south-1
```

---

## 🆘 **Troubleshooting**

### **Frontend won't start (Node.js version)**
```powershell
# Check current version
node --version

# Update to 22.x
# Download from https://nodejs.org/
```

### **Cognito signup fails**
- Check email format (must be valid)
- Password requirements: 8+ chars, uppercase, lowercase, number, special char

### **API returns 401 Unauthorized**
- Ensure you're logged in
- Check that token is being sent in Authorization header
- Verify token hasn't expired (default: 1 hour)

### **Amplify build fails**
- Check build logs in Amplify Console
- Verify all environment variables are set
- Ensure Node.js version in Amplify matches your local (set in build settings)

### **Can't delete CloudFormation stack**
```bash
# Force delete (if stuck)
aws cloudformation delete-stack --stack-name spyglass-backend-dev --region ap-south-1
```

---

## 📚 **Useful Commands Reference**

### **Backend**
```powershell
# Deploy changes
cd backend; npx serverless deploy --stage dev --region ap-south-1

# View logs
npx serverless logs -f createApplet --stage dev --region ap-south-1

# Remove everything
npx serverless remove --stage dev --region ap-south-1
```

### **Frontend**
```powershell
# Dev server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### **AWS CLI**
```powershell
# Check auth
aws sts get-caller-identity

# List all stacks
aws cloudformation list-stacks --region ap-south-1

# DynamoDB scan
aws dynamodb scan --table-name spyglass-applets-dev --region ap-south-1
```

---

## 🎊 **You're Almost There!**

You've successfully:
1. ✅ Built a full-stack React application
2. ✅ Deployed serverless backend to AWS
3. ✅ Configured DynamoDB, Lambda, API Gateway, Cognito
4. ✅ Set up cost protection (log retention, free tier)

**Just 3 more steps:**
1. Integrate Cognito auth (~30 mins)
2. Test locally (~15 mins)
3. Deploy to Amplify (~20 mins)

**Total time to go live: ~1 hour** 🚀

Good luck! 🎉
