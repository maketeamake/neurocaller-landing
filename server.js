const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health check for Railway
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Lead submission endpoint
app.post('/api/lead', async (req, res) => {
  const { name, phone, city, note } = req.body;

  // Validate required fields
  if (!name || !phone) {
    return res.status(400).json({ ok: false, error: 'Name and phone are required' });
  }

  const timestamp = new Date().toISOString();
  console.log(`[LEAD] ${timestamp} - Name: ${name}, Phone: ${phone}, City: ${city || 'N/A'}`);

  // Send to Telegram if configured
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (botToken && chatId) {
    const text = [
      '🔔 New Lead!',
      `━━━━━━━━━━━━━━`,
      `👤 Name: ${name}`,
      `📞 Phone: ${phone}`,
      `🏙️ City: ${city || 'Not specified'}`,
      `📝 Note: ${note || 'None'}`,
      `━━━━━━━━━━━━━━`,
      `🕐 ${timestamp}`
    ].join('\n');

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML'
          })
        }
      );

      if (!response.ok) {
        console.error('[TELEGRAM] Failed to send message:', await response.text());
      }
    } catch (error) {
      console.error('[TELEGRAM] Error:', error.message);
    }
  } else {
    console.log('[TELEGRAM] Not configured - skipping notification');
  }

  res.json({ ok: true });
});

// Analytics endpoint
app.post('/api/analytics', (req, res) => {
  const { event, data } = req.body;
  const timestamp = new Date().toISOString();
  console.log(`[ANALYTICS] ${timestamp} - Event: ${event}`, data ? JSON.stringify(data) : '');
  res.json({ ok: true });
});

// Serve index.html for all other routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Telegram configured: ${!!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID)}`);
});
