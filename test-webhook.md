# Testing Webhook Trigger

## ✅ **Correct Way to Test:**

### **Option 1: PowerShell (Windows)**
```powershell
# Replace {applet-id} with your actual applet ID
$body = @{
    message = "Test webhook trigger"
    timestamp = (Get-Date).ToString()
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://vpza0e2s7d.execute-api.ap-south-1.amazonaws.com/dev/webhooks/{applet-id}" -Method POST -Body $body -ContentType "application/json"
```

### **Option 2: cURL**
```bash
curl -X POST https://vpza0e2s7d.execute-api.ap-south-1.amazonaws.com/dev/webhooks/{applet-id} \
  -H "Content-Type: application/json" \
  -d '{"message": "Test webhook", "data": "example"}'
```

### **Option 3: Postman**
1. Method: **POST** (not GET!)
2. URL: `https://vpza0e2s7d.execute-api.ap-south-1.amazonaws.com/dev/webhooks/{applet-id}`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "message": "Test webhook trigger",
  "timestamp": "2025-11-09T10:30:00Z"
}
```

---

## ❌ **Why You Got the Error:**

**"Missing Authentication Token"** means:
1. ❌ You used **GET** instead of **POST**
2. ❌ The URL path is incorrect
3. ❌ You're accessing it in a browser (browsers use GET by default)

---

## 🧪 **Test Steps:**

1. **First, create an applet** in your dashboard with a webhook trigger
2. **Copy the applet ID** from the webhook URL shown
3. **Use POST request** (not GET) to trigger it
4. **Send JSON payload** in the body

---

## 📝 **Example:**

If your applet ID is `abc123`, the correct request is:

```powershell
Invoke-RestMethod -Uri "https://vpza0e2s7d.execute-api.ap-south-1.amazonaws.com/dev/webhooks/abc123" -Method POST -Body '{"test": "data"}' -ContentType "application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Webhook triggered"
}
```

---

## 🔍 **Verify in DynamoDB:**

After triggering, check executions:
```powershell
aws dynamodb scan --table-name spyglass-executions-dev --region ap-south-1
```

You should see an execution record!
