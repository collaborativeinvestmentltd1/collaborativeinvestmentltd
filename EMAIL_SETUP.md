# Email Setup Guide for Collaborative Investment Ltd

## Gmail Configuration

### Step 1: Enable 2-Factor Authentication
1. Go to https://myaccount.google.com/
2. Click "Security" in the left sidebar
3. Under "Signing in to Google," click "2-Step Verification"
4. Follow the steps to enable it

### Step 2: Generate App Password
1. Go back to Security page
2. Under "Signing in to Google," click "App passwords"
3. Select "Mail" as the app
4. Select "Windows Computer" as device
5. Click "Generate"
6. Copy the 16-character password

### Step 3: Update Environment File
Edit the `.env` file in your project root:

```env
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASS=your-16-character-app-password
ADMIN_EMAIL=admin@collaborativeinvestmentltd.com
ADMIN_PASSWORD=admin123
PORT=3000