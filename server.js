// server.js
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
//const { ImapFlow } = require('imapflow');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

app.get('/health', (req, res) => res.send('ok'));

app.post('/send', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!email || !message) return res.status(400).json({ error: 'Fehlende Felder' });

    const mailOptions = {
      from: `"Kontaktformular" <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO,
      subject: subject || `Kontaktformular: Nachricht von ${name || email}`,
      text: `Von: ${name || 'Unbekannt'} <${email}>\n\n${message}`,
      html: `<p><strong>Von:</strong> ${name || 'Unbekannt'} &lt;${email}&gt;</p><hr/><p>${message.replace(/\n/g,'<br/>')}</p>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Mail gesendet:', info.messageId);
    res.json({ ok: true, messageId: info.messageId });
  } catch (err) {
    console.error('Mailfehler', err);
    res.status(500).json({ error: 'Fehler beim Versenden der Mail' });
  }
});

// Simple admin token auth for /messages
function getAdminToken(req) {
  return req.headers['x-admin-token'] || req.query.token || '';
}

// GET /messages -> list recent IMAP messages (headers + snippet)
app.get('/messages', async (req, res) => {
  const token = getAdminToken(req);
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const client = new ImapFlow({
    host: process.env.IMAP_HOST,
    port: Number(process.env.IMAP_PORT || 993),
    secure: Number(process.env.IMAP_PORT || 993) === 993,
    auth: {
      user: process.env.IMAP_USER,
      pass: process.env.IMAP_PASS
    }
  });

  try {
    await client.connect();
    // select INBOX
    let lock = await client.getMailboxLock('INBOX');
    try {
      // fetch last 10 messages UIDs
      const last = await client.search({ seen: false }, { uid: true }) // example: unseen
      // fallback: list last N by seq
      let seq = await client.fetch('1:*', { envelope: true, internalDate: true, uid: true, bodyStructure: true });
      // We'll collect last 10 from seq
      const items = [];
      for await (const message of client.fetch('1:*', { envelope: true, internalDate: true, uid: true, source: false })) {
        items.push({
          uid: message.uid,
          subject: message.envelope.subject,
          from: message.envelope.from && message.envelope.from.map(f => f.name || f.address).join(', '),
          date: message.envelope.date
        });
      }
      const latest = items.slice(-10).reverse();
      res.json({ ok: true, messages: latest });
    } finally {
      lock.release();
    }
  } catch (err) {
    console.error('IMAP error', err);
    res.status(500).json({ error: 'IMAP Fehler' });
  } finally {
    try { await client.logout(); } catch(e) {}
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server läuft auf http://localhost:${port}`));
