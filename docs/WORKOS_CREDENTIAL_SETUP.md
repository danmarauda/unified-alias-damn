# WorkOS Credential Setup Guide

**Important:** WorkOS does not provide a CLI or programmatic way to retrieve credentials for security reasons.

---

## 🔐 How to Get WorkOS Credentials

### Manual Setup (Required)

WorkOS credentials must be retrieved manually from the WorkOS Dashboard for security reasons:

1. **Sign up for WorkOS:** https://dashboard.workos.com
2. **Navigate to Configuration page**
3. **Find your credentials:**

#### Client ID
- Location: Dashboard → Configuration → Client ID
- Format: `client_...`
- **Public:** Safe to expose in client-side code
- Used for: OAuth flows, API calls

![Client ID location](https://images.workoscdn.com/images/64e889d7-2845-4b83-b913-ec120e0a3841.png)

#### API Key
- Location: Dashboard → API Keys
- Format: `sk_test_...` (staging) or `sk_prod_...` (production)
- **Secret:** NEVER expose in client-side code
- Used for: Server-side API calls

**Security Note:** API keys are sensitive secrets and should only be stored server-side.

---

## 🚀 Quick Setup Script

While you can't retrieve credentials programmatically, you can use this helper script to set them up:

```bash
#!/bin/bash
# setup-workos-env.sh

echo "WorkOS Environment Setup"
echo "========================"
echo ""
echo "Get your credentials from: https://dashboard.workos.com"
echo ""

# Prompt for credentials
read -p "Enter your WORKOS_API_KEY (sk_test_...): " WORKOS_API_KEY
read -p "Enter your WORKOS_CLIENT_ID (client_...): " WORKOS_CLIENT_ID

# Generate cookie password
WORKOS_COOKIE_PASSWORD=$(openssl rand -base64 32)

# Create .env.local
cat > .env.local << EOL
# WorkOS Configuration
WORKOS_API_KEY='${WORKOS_API_KEY}'
WORKOS_CLIENT_ID='${WORKOS_CLIENT_ID}'
WORKOS_COOKIE_PASSWORD='${WORKOS_COOKIE_PASSWORD}'
NEXT_PUBLIC_WORKOS_REDIRECT_URI='http://localhost:3000/callback'
NEXT_PUBLIC_APP_URL='http://localhost:3000'

# Convex (keep existing values)
NEXT_PUBLIC_CONVEX_URL='${NEXT_PUBLIC_CONVEX_URL}'
CONVEX_DEPLOYMENT='${CONVEX_DEPLOYMENT}'
EOL

echo ""
echo "✅ .env.local created successfully!"
echo ""
echo "Next steps:"
echo "1. Configure redirect URIs in WorkOS Dashboard:"
echo "   - http://localhost:3000/callback"
echo "2. Set initiate login URL:"
echo "   - http://localhost:3000/login"
echo "3. Set logout redirect:"
echo "   - http://localhost:3000"
echo ""
echo "Then run: bun run dev"
```

Save this as `scripts/setup-workos-env.sh` and run:

```bash
chmod +x scripts/setup-workos-env.sh
./scripts/setup-workos-env.sh
```

---

## 🔧 Environment Variables

After getting credentials from the dashboard, add them to `.env.local`:

```bash
# Required WorkOS credentials (from Dashboard)
WORKOS_API_KEY='sk_test_...'              # Secret - DO NOT COMMIT
WORKOS_CLIENT_ID='client_...'             # Public
WORKOS_COOKIE_PASSWORD='...'              # Generate with: openssl rand -base64 32
NEXT_PUBLIC_WORKOS_REDIRECT_URI='http://localhost:3000/callback'
NEXT_PUBLIC_APP_URL='http://localhost:3000'

# Convex (already configured)
NEXT_PUBLIC_CONVEX_URL='...'
CONVEX_DEPLOYMENT='...'
```

---

## ✅ Validation Script

Use this script to validate your credentials:

```bash
#!/bin/bash
# scripts/validate-workos-credentials.sh

source .env.local

echo "Validating WorkOS credentials..."
echo ""

# Check API Key
if [[ $WORKOS_API_KEY =~ ^sk_(test|prod)_ ]]; then
  echo "✅ WORKOS_API_KEY format is valid"
else
  echo "❌ WORKOS_API_KEY format is invalid (should start with sk_test_ or sk_prod_)"
  exit 1
fi

# Check Client ID
if [[ $WORKOS_CLIENT_ID =~ ^client_ ]]; then
  echo "✅ WORKOS_CLIENT_ID format is valid"
else
  echo "❌ WORKOS_CLIENT_ID format is invalid (should start with client_)"
  exit 1
fi

# Check Cookie Password length
if [ ${#WORKOS_COOKIE_PASSWORD} -ge 32 ]; then
  echo "✅ WORKOS_COOKIE_PASSWORD is at least 32 characters"
else
  echo "❌ WORKOS_COOKIE_PASSWORD is too short (needs at least 32 characters)"
  exit 1
fi

# Check Redirect URI
if [[ $NEXT_PUBLIC_WORKOS_REDIRECT_URI =~ /callback$ ]]; then
  echo "✅ NEXT_PUBLIC_WORKOS_REDIRECT_URI ends with /callback"
else
  echo "⚠️  NEXT_PUBLIC_WORKOS_REDIRECT_URI should end with /callback"
fi

echo ""
echo "✅ All WorkOS credentials are valid!"
echo ""
echo "Next: Configure these URLs in WorkOS Dashboard:"
echo "  Redirect URI: $NEXT_PUBLIC_WORKOS_REDIRECT_URI"
echo "  Login URL: ${NEXT_PUBLIC_APP_URL}/login"
echo "  Logout URL: $NEXT_PUBLIC_APP_URL"
```

---

## 🔒 Security Best Practices

1. **Never commit `.env.local`** to version control
2. **Use different keys for staging/production**
3. **Rotate API keys periodically**
4. **Use environment-specific credentials:**
   - Development: `sk_test_...`
   - Production: `sk_prod_...`
5. **Store production credentials in secure secret managers:**
   - Vercel: Environment Variables
   - Netlify: Environment Variables
   - AWS: Secrets Manager
   - Azure: Key Vault

---

## 🌐 Production Deployment

For production, set environment variables in your hosting platform:

### Vercel
```bash
vercel env add WORKOS_API_KEY production
vercel env add WORKOS_CLIENT_ID production
vercel env add WORKOS_COOKIE_PASSWORD production
```

### Netlify
Dashboard → Site settings → Environment variables → Add variable

### Environment Variables to Set:
- `WORKOS_API_KEY` (use `sk_prod_...` key)
- `WORKOS_CLIENT_ID` (production client ID)
- `WORKOS_COOKIE_PASSWORD` (generate new secure password)
- `NEXT_PUBLIC_WORKOS_REDIRECT_URI` (https://yourdomain.com/callback)
- `NEXT_PUBLIC_APP_URL` (https://yourdomain.com)

---

## 📚 Additional Resources

- **WorkOS Dashboard:** https://dashboard.workos.com
- **API Keys Documentation:** Dashboard → API Keys tab
- **Client ID Location:** Dashboard → Configuration page
- **WorkOS Documentation:** https://workos.com/docs
- **Support:** support@workos.com

---

## ❓ FAQ

**Q: Is there a WorkOS CLI?**  
A: No, WorkOS does not provide a CLI tool. Credentials must be retrieved manually from the dashboard.

**Q: Can I generate API keys programmatically?**  
A: No, for security reasons, API keys must be generated manually in the WorkOS Dashboard.

**Q: Can I use the same credentials for development and production?**  
A: No, you should use separate staging (`sk_test_`) and production (`sk_prod_`) credentials.

**Q: How do I rotate API keys?**  
A: Generate a new key in the dashboard, update your environment variables, and delete the old key.

**Q: Where do I find my credentials after signing up?**  
A: Dashboard → Configuration page for Client ID, Dashboard → API Keys tab for API Key

---

**Remember:** Manual credential retrieval is a security feature, not a limitation!
