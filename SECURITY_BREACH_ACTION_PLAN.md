# 🚨 SECURITY BREACH - ACTION PLAN

## KEYS EXPOSED PUBLICLY (Rotate Immediately!)

### Priority 1: HIGH COST RISK
1. **OpenAI** - `sk-proj-AXZOQ...`
   - Dashboard: https://platform.openai.com/api-keys
   - Action: Delete old key, create new one
   - Risk: Unlimited API usage charges

2. **Anthropic Claude** - `sk-ant-api03-zOol...`
   - Dashboard: https://console.anthropic.com/settings/keys
   - Action: Delete old key, create new one
   - Risk: High-cost Claude API usage

3. **ElevenLabs** - `sk_dd8272ea...`
   - Dashboard: https://elevenlabs.io/app/settings/api-keys
   - Action: Revoke old key, create new one
   - Risk: Voice synthesis charges

### Priority 2: MEDIUM COST RISK
4. **Cerebras** - `csk-6dt8kym...`
   - Dashboard: https://cloud.cerebras.ai/settings/api-keys
   - Action: Rotate key
   - Risk: Inference charges

5. **Google Gemini** - `AIzaSyAhdI...`
   - Dashboard: https://makersuite.google.com/app/apikey
   - Action: Delete and recreate
   - Risk: API usage charges

6. **OpenRouter** - `sk-or-v1-a47e04...`
   - Dashboard: https://openrouter.ai/keys
   - Action: Delete key, create new one
   - Risk: Multiple model API charges

7. **Deepgram** - `ed4f7f4eb...`
   - Dashboard: https://console.deepgram.com/api-keys
   - Action: Delete key, create new one
   - Risk: Speech-to-text charges

### Priority 3: ACCESS TOKENS
8. **LiveKit** - API Key + Secret
   - Dashboard: https://cloud.livekit.io/projects
   - Action: Regenerate credentials
   - Risk: Unauthorized access to video/audio streams

9. **Mastra Cloud** - JWT token
   - Dashboard: https://mastra.ai
   - Action: Invalidate token, generate new one
   - Risk: Unauthorized access to project

10. **CopilotKit** - `ck_pub_ae6ddc7...`
    - Dashboard: https://cloud.copilotkit.ai
    - Action: Regenerate API key
    - Risk: Unauthorized CopilotKit usage

11. **Pica** - `sk_live_1_fi2rLc...`
    - Dashboard: Your Pica account
    - Action: Rotate secret key
    - Risk: Unauthorized API access

12. **Rime** - `xt64vAkLym...`
    - Dashboard: Your Rime account
    - Action: Regenerate key
    - Risk: Unauthorized access

## STEPS TO TAKE RIGHT NOW

### 1. Rotate ALL Keys (15-30 minutes)
Go to each dashboard above and:
- Delete/revoke the old key
- Generate a new key
- Save it to your password manager (1Password, LastPass, etc.)
- Update your local .env.local file

### 2. Update .env.local
```bash
cd /Users/alias/Desktop/website/unified-alias-damn
cp .env.local .env.local.backup-$(date +%Y%m%d-%H%M%S)
nano .env.local  # Update with NEW keys
```

### 3. Verify .gitignore
```bash
# Check that .env.local is ignored
git check-ignore .env.local
# Should output: .env.local
```

### 4. Check Git History
```bash
# Make sure no .env files were committed
git log --all --full-history -- .env.local
git log --all --full-history -- .env

# If any appear, you need to:
# 1. Remove them from history (git filter-branch or BFG Repo-Cleaner)
# 2. Force push to remote
# 3. Rotate ALL keys again
```

### 5. Monitor Usage (Next 48 hours)
Check each service's usage dashboard for unexpected activity:
- OpenAI: https://platform.openai.com/usage
- Anthropic: https://console.anthropic.com/settings/usage
- Google Cloud: https://console.cloud.google.com/billing
- Each other service's billing/usage page

### 6. Set Up Spending Alerts
- OpenAI: Set up usage limits
- Anthropic: Set up monthly budget alerts
- Google Cloud: Set up billing alerts
- Each service with billing options

## SECURITY BEST PRACTICES GOING FORWARD

### 1. Use Environment Variables Properly
✅ DO:
- Store keys in .env.local (gitignored)
- Use .env.local.example for templates
- Use password manager for backup
- Use different keys for dev/staging/prod

❌ DON'T:
- Share keys in chat/messages/email
- Commit .env files to git
- Hardcode keys in source code
- Screenshot .env files

### 2. Use Secrets Management
For production:
- Vercel: Use Environment Variables in project settings
- Netlify: Use Environment Variables in site settings
- AWS: Use AWS Secrets Manager
- Google Cloud: Use Secret Manager
- Azure: Use Key Vault

### 3. Regular Key Rotation
- Rotate production keys every 90 days
- Rotate immediately if exposure suspected
- Keep old keys for 24h during transition
- Update all environments simultaneously

### 4. Monitoring
- Set up usage alerts
- Review API logs monthly
- Monitor for unusual patterns
- Set spending limits where possible

## COST ESTIMATES IF KEYS ARE ABUSED

**Worst Case Scenarios:**

- OpenAI GPT-4: $10-100/hour of abuse
- Anthropic Claude: $15-150/hour of abuse
- ElevenLabs: $5-50/hour of abuse
- Other services: $1-20/hour combined

**Total potential cost: $500-$5,000+ per day**

## NOTES

- Keys were exposed on: $(date)
- Location: Claude Code chat session
- Action: Immediate rotation required
- Follow-up: Monitor usage for 7 days

## CHECKLIST

- [ ] OpenAI key rotated
- [ ] Anthropic key rotated
- [ ] Google Gemini key rotated
- [ ] Cerebras key rotated
- [ ] ElevenLabs key rotated
- [ ] Deepgram key rotated
- [ ] LiveKit credentials rotated
- [ ] OpenRouter key rotated
- [ ] Mastra token regenerated
- [ ] CopilotKit key rotated
- [ ] Pica key rotated
- [ ] Rime key rotated
- [ ] .env.local updated with new keys
- [ ] Verified .env.local in .gitignore
- [ ] Checked git history for leaked keys
- [ ] Set up usage monitoring
- [ ] Set up spending alerts
- [ ] Documented incident
