// src/routes/emailRoutes.js
import express from 'express';
import { sendTestEmail, verifyEmailConfig, sendEmail } from '../services/emailService.js';

const router = express.Router();

// Verify SMTP connection
router.get('/verify', async (req, res) => {
  try {
    const ok = await verifyEmailConfig();
    res.json({ success: ok });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send a test email
router.post('/test', async (req, res) => {
  try {
    const { to } = req.body;
    await sendTestEmail(to);
    res.json({ success: true, message: `Test email sent to ${to}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generic send email (optional)
router.post('/send', async (req, res) => {
  try {
    const { to, subject, template, data } = req.body;
    await sendEmail({ to, subject, template, data });
    res.json({ success: true, message: `Email sent to ${to}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
