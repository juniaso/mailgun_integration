const express = require('express');
const bodyParser = require('body-parser');
const formData = require('form-data');
const Mailgun = require('mailgun.js');

const app = express();
app.use(bodyParser.json());

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY,
});

app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).send('Missing required fields: to, subject, text');
  }

  try {
    const response = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: process.env.FROM_ADDRESS,
      to,
      subject,
      text,
    });

    console.log('Email sent:', response);
    res.status(200).send('Email sent');
  } catch (error) {
    console.error('Mailgun error:', error);
    res.status(500).send('Failed to send email');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Mailgun email service running on port ${PORT}`);
});
