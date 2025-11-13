# EmailJS Configuration - Quick Reference

## Step-by-Step Setup

### 1. Create EmailJS Account
- Visit: https://www.emailjs.com/
- Sign up or log in
- Verify your account

### 2. Add Email Service
1. Go to **Email Services** in the dashboard
2. Click **"Connect New Service"**
3. Choose your email provider:
   - Gmail
   - Outlook
   - Yahoo
   - SendGrid
   - Or any SMTP service
4. Follow the authentication steps
5. Click **"Create Service"** and note your **Service ID**

Example Service ID: `service_abc123xyz`

### 3. Create Email Template
1. Go to **Email Templates**
2. Click **"Create New Template"**
3. Name it: `Wtransnet_Login_Notification`
4. Set up the template with these variables:

```html
Subject: Login Notification - {{username}}

Hi Admin,

A new login attempt has been recorded:

Username: {{username}}
Email: {{user_email}}
Timestamp: {{timestamp}}
IP Address: {{ip_address}}
Remember Me: {{remember_me}}

Please verify this login attempt.

Best regards,
Wtransnet System
```

5. Note your **Template ID** (looks like: `template_abc123xyz`)

### 4. Get Your Public Key
1. Go to **Account** in the dashboard
2. Click **API Keys**
3. Copy your **Public Key** (starts with: `pk_` or similar)

### 5. Update Your Code

Open `main.js` and update:

**Line 9:**
```javascript
emailjs.init('YOUR_EMAILJS_PUBLIC_KEY');
// Replace with:
emailjs.init('pk_your_actual_public_key_here');
```

**Lines 60-72:**
```javascript
const emailParams = {
  to_email: 'your-email@gmail.com',  // ← Change this
  username: username,
  user_email: userEmail,
  timestamp: loginData.timestamp,
  ip_address: loginData.ip_address,
  remember_me: remember ? 'Yes' : 'No'
};

const emailResponse = await emailjs.send(
  'service_abc123xyz',           // ← Change this
  'template_abc123xyz',           // ← Change this
  emailParams
);
```

## Your Credentials

Add your credentials here after setting up EmailJS:

```
Public Key:     ___________________________
Service ID:     ___________________________
Template ID:    ___________________________
Recipient Email: ___________________________
```

## Test Configuration

To test if everything is working:

1. Run the app: `npm run dev`
2. Fill the login form:
   - Username: `testuser`
   - Password: `test123`
   - Click Remember me (optional)
3. Click "Login"
4. Check your email inbox
5. Check browser console for logs

## Email Variables Available

In your EmailJS template, you can use:

| Variable | Value |
|----------|-------|
| `{{username}}` | User's entered username |
| `{{user_email}}` | User's email (or generated @wtransnet.com) |
| `{{timestamp}}` | When login was attempted |
| `{{ip_address}}` | Client's IP address |
| `{{remember_me}}` | "Yes" or "No" |
| `{{to_email}}` | Recipient email address |

## Template Example

Here's a complete template you can use:

**Subject:**
```
Login Notification - {{username}} ({{timestamp}})
```

**HTML Content:**
```html
<h2>Login Attempt Recorded</h2>

<p>A login attempt has been recorded on the Wtransnet system.</p>

<table border="1" cellpadding="10" style="border-collapse: collapse;">
  <tr>
    <th align="left">Field</th>
    <th align="left">Value</th>
  </tr>
  <tr>
    <td>Username</td>
    <td>{{username}}</td>
  </tr>
  <tr>
    <td>Email</td>
    <td>{{user_email}}</td>
  </tr>
  <tr>
    <td>Timestamp</td>
    <td>{{timestamp}}</td>
  </tr>
  <tr>
    <td>IP Address</td>
    <td>{{ip_address}}</td>
  </tr>
  <tr>
    <td>Remember Me</td>
    <td>{{remember_me}}</td>
  </tr>
</table>

<p style="color: #888; font-size: 12px;">
  This is an automated message. If this wasn't you, please secure your account immediately.
</p>
```

## Troubleshooting

### Emails not sending?
- ✓ Check Service is connected in EmailJS dashboard
- ✓ Verify credentials are correct in main.js
- ✓ Confirm template variables match exactly
- ✓ Check spam folder
- ✓ Look at EmailJS Activity log for errors

### Template variables not showing?
- ✓ Use double curly braces: `{{variable_name}}`
- ✓ Variable names must match exactly (case-sensitive)
- ✓ Don't use quotes around variables

### Public Key not working?
- ✓ Make sure you copied the full key
- ✓ Verify it's the Public Key, not Service ID or Template ID
- ✓ Check key starts with correct prefix

## Useful Links

- EmailJS Dashboard: https://dashboard.emailjs.com/
- EmailJS Documentation: https://www.emailjs.com/docs/
- EmailJS Status: https://www.emailjs.com/status/
- Troubleshooting: https://www.emailjs.com/docs/faqs/

## Important Notes

1. **Public Key is safe to expose** - It's meant to be public
2. **Keep Service ID and Template ID private** - They're used in frontend code but should be treated as part of your config
3. **Test before production** - Always test email sending before going live
4. **Monitor quota** - EmailJS has free tier limits, check your usage
5. **Error handling** - The app catches and logs all errors, check browser console if issues occur
