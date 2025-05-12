const express = require('express');
const bodyParser = require('body-parser');
const MailgunAdapter = require('parse-server-mailgun');

const app = express();
app.use(bodyParser.json());

const mailgunAdapter = new MailgunAdapter({
  fromAddress: process.env.FROM_ADDRESS,
  domain: process.env.MAILGUN_DOMAIN,
  apiKey: process.env.MAILGUN_API_KEY,
  callback: (msg) => console.log('Email sent:', msg),
});

app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).send('Missing required fields: to, subject, text');
  }

  try {
    await mailgunAdapter.sendMail({ to, subject, text });
    res.status(200).send('Email sent');
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).send('Failed to send email');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Mailgun email service running on port ${PORT}`);
});
