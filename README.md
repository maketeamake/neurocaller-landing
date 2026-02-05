# NeuroCaller Landing Page

Co-founder landing page for NeuroCaller - AI-powered staff calling for restaurants.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your Telegram credentials

# Run locally
npm start
```

## Telegram Setup

1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Send `/newbot` and follow prompts
3. Copy the bot token to `.env`
4. Message your bot, then visit:
   `https://api.telegram.org/bot<TOKEN>/getUpdates`
5. Find your `chat_id` in the response and add to `.env`

## Railway Deployment

1. Push to GitHub
2. Create new project on [Railway](https://railway.app)
3. Connect your repository
4. Add environment variables:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
5. Deploy (Railway auto-detects Node.js)

## Customization

Update in `public/index.html`:
- Phone number in `tel:` and `wa.me` links
- Email in footer
- Video URL in demo section (replace `VIDEO_ID`)

## Endpoints

- `GET /` - Landing page
- `GET /health` - Health check
- `POST /api/lead` - Submit lead form
- `POST /api/analytics` - Track events
