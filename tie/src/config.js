require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3002,
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
  },
  firecrawl: {
    apiKey: process.env.FIRECRAWL_API_KEY,
  },
  newsApi: {
    apiKey: process.env.NEWSAPI_KEY,
  },
  acled: {
    apiKey: process.env.ACLED_API_KEY,
    email: process.env.ACLED_EMAIL,
  },
  owm: {
    apiKey: process.env.OWM_API_KEY,
  },
  faa: {
    apiKey: process.env.FAA_NOTAM_API_KEY,
    clientSecret: process.env.FAA_NOTAM_CLIENT_SECRET || '',
  },
  webhook: {
    url: process.env.VDIE_WEBHOOK_URL || 'http://localhost:3001/internal/threat-update',
    apiKey: process.env.INTERNAL_API_KEY || 'default-dev-key',
  },
};
